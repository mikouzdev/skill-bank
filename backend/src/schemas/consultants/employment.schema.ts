import z from "zod";

export const EmploymentSkillSchema = z.object({
  name: z.string().meta({ example: "react" }),
  category: z.string().nullable().meta({ example: "frontend" }),
});

export const EmploymentSchema = z.object({
  id: z.number().int().meta({ example: 1 }),
  employer: z.string().meta({ example: "Oy Firma Ab" }),
  jobTitle: z.string().meta({ example: "Fullstack developer" }),
  description: z
    .string()
    .meta({ example: "Description text of the role and responsibilites" }),
  start: z.string().meta({ example: "2020-03-01" }),
  end: z.string().nullable().meta({ example: "2021-06-20" }),
  skills: z.array(EmploymentSkillSchema),
});

export const EmploymentListResponseSchema = z
  .array(EmploymentSchema)
  .meta({ id: "EmploymentListResponse" });

export type EmploymentListResponse = z.infer<
  typeof EmploymentListResponseSchema
>;
