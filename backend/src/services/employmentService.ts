import { prisma } from "../db/prismaClient.js";
import { Visibility } from "../generated/prisma/enums.js";
import type { Prisma } from "../generated/prisma/client.js";
import {
  EmploymentListResponseSchema,
  EmploymentResponseSchema,
  type EmploymentCreateInput,
  type EmploymentListResponse,
  type EmploymentResponse,
} from "../schemas/consultants/employment.schema.js";

type EmploymentWithSkills = Prisma.EmploymentGetPayload<{
  include: {
    employmentSkills: {
      include: {
        skillTag: {
          include: {
            category: true;
          };
        };
      };
    };
  };
}>;

export async function getEmploymentsForConsultant(
  consultantId: number,
  allowedVisibilities: Visibility[]
): Promise<EmploymentListResponse> {
  const employments: EmploymentWithSkills[] = await prisma.employment.findMany({
    where: {
      consultantId,
      visibility: {
        in: allowedVisibilities,
      },
    },
    orderBy: {
      start: "desc",
    },
    include: {
      employmentSkills: {
        include: {
          skillTag: {
            include: {
              category: true,
            },
          },
        },
      },
    },
  });

  const mapped = employments.map((emp) => ({
    id: emp.id,
    employer: emp.employer,
    jobTitle: emp.jobTitle,
    description: emp.description,
    start: emp.start.toISOString().slice(0, 10),
    end: emp.end ? emp.end.toISOString().slice(0, 10) : null,
    skills: emp.employmentSkills.map((empSkill) => ({
      name: empSkill.skillTag.name,
      category: empSkill.skillTag.category?.name ?? null,
    })),
  }));

  return EmploymentListResponseSchema.parse(mapped);
}

export async function createEmploymentForConsultant(
  consultantId: number,
  input: EmploymentCreateInput
): Promise<EmploymentResponse> {
  const employment = await prisma.employment.create({
    data: {
      consultantId,
      employer: input.employer,
      jobTitle: input.jobTitle,
      description: input.description,
      start: new Date(input.start),
      end: input.end ? new Date(input.end) : null,
      visibility: input.visibility,
    },
  });

  await prisma.employmentSkill.createMany({
    data: input.employmentSkills.map((skillName) => ({
      employmentId: employment.id,
      skillTagName: skillName,
    })),
  });

  const createdEmployment: EmploymentWithSkills =
    await prisma.employment.findUniqueOrThrow({
      // fail early if something went wrong
      where: { id: employment.id },
      include: {
        employmentSkills: {
          include: {
            skillTag: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

  // TODO, create common helper mapper for GET, POST and PUT
  const mapped = {
    id: createdEmployment.id,
    employer: createdEmployment.employer,
    jobTitle: createdEmployment.jobTitle,
    description: createdEmployment.description,
    start: createdEmployment.start.toISOString().slice(0, 10),
    end: createdEmployment.end
      ? createdEmployment.end.toISOString().slice(0, 10)
      : null,
    skills: createdEmployment.employmentSkills.map((empSkill) => ({
      name: empSkill.skillTag.name,
      category: empSkill.skillTag.category?.name ?? null,
    })),
  };

  return EmploymentResponseSchema.parse(mapped);
}
