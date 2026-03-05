import { prisma } from "../db/prismaClient.js";
import "dotenv/config";
import type { JsonFilter } from "../schemas/consultants/search.schema.js";
import { Prisma, type Employment } from "../generated/prisma/client.js";

/**
 * Fetches all consulants by name
 * @param consultantName Consultant's name
 * @returns All consultants that matches search parameter
 */
export async function getConsultantsByName(consultantName: string) {
  const consultant = await prisma.consultant.findMany({
    where: {
      user: {
        name: {
          contains: consultantName,
          mode: "insensitive",
        },
      },
    },
  });
  if (consultant.length === 0) {
    return [];
  }
  return consultant;
}

/**
 * Fetches all consulants by name
 * @param consultantName Consultant's name
 * @returns All consultants that matches search parameter
 */
export async function getConsultantsByFilter(freeText: string) {
  const user = await prisma.consultant.findMany({
    where: {
      OR: [
        {
          description: {
            contains: freeText,
            mode: "insensitive", // ignores case
          },
        },
        {
          roleTitle: {
            contains: freeText,
            mode: "insensitive",
          },
        },
        {
          user: {
            name: {
              contains: freeText,
              mode: "insensitive",
            },
          },
        },
        {
          consultantSkills: {
            some: {
              skillName: {
                contains: freeText,
                mode: "insensitive",
              },
            },
          },
        },
      ],
    },
  });

  const consultant = await prisma.consultant.findMany({
    where: {
      userId: {
        in: user.map((el) => el.userId),
      },
    },
  });

  if (user.length === 0) {
    return [];
  }
  return consultant;
}

export async function getConsultantsByJsonFilter(jsonFilter: JsonFilter) {
  const filterSkills = jsonFilter.filter_skills ?? [];

  const proficiencyFilter =
    filterSkills.length > 0
      ? {
          OR: filterSkills.map((el) => ({
            skillName: {
              equals: el.skill,
              mode: Prisma.QueryMode.insensitive,
            },
            proficiency:
              el.range === "LESSER"
                ? { lt: el.proficiency }
                : el.range === "GREATER"
                  ? { gt: el.proficiency }
                  : { equals: el.proficiency },
          })),
        }
      : {};

  const skills = await prisma.consultantSkill.findMany({
    where: proficiencyFilter,
  });

  const getProfessionExperienceLength = await prisma.employment.findMany();

  const filterByLength = (experienceLength: Employment[]) => {
    if (jsonFilter.range == null || jsonFilter.experienceInMonths == null) {
      return experienceLength;
    }

    return experienceLength.filter((el) => {
      const endTime = el.end?.getTime() ?? Date.now();

      const durationInDays =
        (endTime - el.start.getTime()) / (1000 * 60 * 60 * 24);

      const durationInMonths = durationInDays / 30;

      switch (jsonFilter.range) {
        case "LESSER":
          return durationInMonths < jsonFilter.experienceInMonths!;
        case "GREATER":
          return durationInMonths > jsonFilter.experienceInMonths!;
        case "EQUAL":
          return durationInMonths === jsonFilter.experienceInMonths;
        default:
          return true;
      }
    });
  };

  const filteredLength = filterByLength(getProfessionExperienceLength);
  const keywords = jsonFilter.keywords ?? [];

  const keywordsEmployments = await prisma.employment.findMany({
    where: {
      employmentSkills: {
        some: {
          skillTagName: { in: keywords },
        },
      },
    },
  });

  const keywordsSkills = await prisma.consultantSkill.findMany({
    where: {
      skillName: {
        in: keywords,
      },
    },
  });

  const keywordsProjects = await prisma.project.findMany({
    where: {
      projectSkills: {
        some: {
          skillTagName: { in: keywords },
        },
      },
    },
  });

  const consultant = await prisma.consultant.findMany({
    where: {
      OR: [
        {
          id: { in: skills.map((el) => el.consultantId) },
        },
        {
          id: { in: keywordsEmployments.map((el) => el.consultantId) },
        },
        {
          id: { in: keywordsSkills.map((el) => el.consultantId) },
        },
        {
          id: { in: keywordsProjects.map((el) => el.consultantId) },
        },
        {
          id: {
            in: filteredLength.map((el) => el.consultantId),
          },
        },
      ],
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });
  return consultant;
}
