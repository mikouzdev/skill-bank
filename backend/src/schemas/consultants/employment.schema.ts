import z from "zod";

export const EmploymentSkillSchema = z
  .object({
    skillTagName: z.string().meta({ example: "react" }),
    employmentId: z.number().int().meta({ example: 1 }),
    //category: z.string().nullable().meta({ example: "frontend" }),
  })
  .meta({ id: "EmploymentSkill" });

export const EmploymentResponseSchema = z
  .object({
    id: z.number().int().meta({ example: 1 }),
    employer: z.string().meta({ example: "Oy Firma Ab" }),
    jobTitle: z.string().meta({ example: "Fullstack developer" }),
    consultantId: z.number().int().meta({ example: 1 }),
    createdAt: z.date().meta({ example: "2025-12-19T14:01:24.308Z" }),
    updatedAt: z.date().meta({ example: "2025-12-19T14:01:24.308Z" }),
    description: z
      .string()
      .meta({ example: "Description text of the role and responsibilites" }),
    start: z.string().meta({ example: "2020-03-01" }),
    end: z.string().nullable().meta({ example: "2021-06-20" }),
    employmentSkills: z.array(EmploymentSkillSchema),
    visibility: z.enum(["LIMITED", "PUBLIC"]).meta({ example: "PUBLIC" }),
  })
  .meta({ id: "EmploymentResponse" });

export type EmploymentResponse = z.infer<typeof EmploymentResponseSchema>;

export const EmploymentListResponseSchema = z
  .array(EmploymentResponseSchema)
  .meta({ id: "EmploymentListResponse" });

export type EmploymentListResponse = z.infer<
  typeof EmploymentListResponseSchema
>;

export const EmploymentIdParamsSchema = z.object({
  employmentId: z.coerce.number().meta({ example: "1" }),
});

export const EmploymentBodySchema = EmploymentResponseSchema.omit({
  id: true,
  consultantId: true,
  createdAt: true,
})
  .extend({
    start: z.coerce.date(),
    end: z.coerce.date().nullable().optional(),
  })
  .refine((project) => (project.end ? project.start <= project.end : true), {
    message: "End date must be a later or equal date to start date",
    path: ["end"],
  });

export const EmploymentCreateSchema = EmploymentResponseSchema.omit({
  id: true,
  employmentSkills: true,
}).extend({
  visibility: z.enum(["PUBLIC", "LIMITED"]),
  skills: z
    .array(z.string())
    .min(1)
    .meta({
      example: [
        { employmentId: 1, skillTagName: "java" },
        { employmentId: 1, skillTagName: "python" },
      ],
    }),
});

export const PostEmploymentSkillBodySchema = EmploymentSkillSchema.pick({
  skillTagName: true,
});

export const GetEmploymentSkillResponseSchema = z
  .array(
    EmploymentResponseSchema.extend({
      projectLinks: z.array(EmploymentSkillSchema),
    })
  )
  .meta({ id: "GetEmploymentsResponse" });

export const DeleteEmploymentSkillParamsSchema = z.object({
  employmentId: z.coerce.number().meta({ example: "2" }),
  employmentSkillId: z.coerce.number().meta({ example: "1" }),
});

export type EmploymentCreateInput = z.infer<typeof EmploymentCreateSchema>;
