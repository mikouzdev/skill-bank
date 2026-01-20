import { prisma } from "../db/prismaClient.js";
import "dotenv/config";

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
      ],
    },
  });

  const skill = await prisma.consultantSkill.findMany({
    where: {
      skillName: {
        contains: freeText,
        mode: "insensitive",
      },
    },
  });
  // This returns real UserIds like [1,2]
  //console.log(skill.map((el) => el.consultantId));
  const consultant = await prisma.consultant.findMany({
    where: {
      OR: [
        {
          // This should return consultant based on userId found in skill.
          // But this returns only empty arrays.
          userId: {
            in: skill.map((el) => el.consultantId),
          },
        },
        {
          userId: {
            in: user.map((el) => el.userId),
          },
        },
      ],
    },
  });

  if (user.length === 0) {
    return [];
  }
  return consultant;
}
