import { prisma } from "../db/prismaClient.js";
import { Visibility } from "../generated/prisma/enums.js";
import type { Prisma } from "../generated/prisma/client.js";
import { EmploymentListResponseSchema } from "../schemas/consultants/employment.schema.js";
import { z } from "zod";

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
): Promise<z.infer<typeof EmploymentListResponseSchema>> {
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
