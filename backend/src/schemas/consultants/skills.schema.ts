import { z } from "zod";

export const ConsultantSkillSchema = z
  .object({
    id: z.number().meta({ example: "1" }),
    consultantId: z.number().meta({ example: "2" }),
    createdAt: z.date().meta({ example: "2025-12-19T14:01:24.308Z" }),
    updatedAt: z.date().meta({ example: "2025-12-19T14:01:24.308Z" }),
    skillName: z.string().meta({ example: "Python" }),
    proficiency: z.number().meta({ example: "5" }),
    listPosition: z.number().meta({ example: "1" }),
  })
  .meta({ id: "ConsultantSkill" });

export const ConsultantSkillsSchema = z.array(ConsultantSkillSchema);

export const PostConsultantSkillBodySchema = ConsultantSkillSchema.pick({
  skillName: true,
  proficiency: true,
});

export const SkillProficiencyBodySchema = ConsultantSkillSchema.pick({
  proficiency: true,
});

export const SkillIdParamsSchema = z.object({
  skillId: z.coerce.number().meta({ example: "1" }),
});

export type ConsultantSkill = z.infer<typeof ConsultantSkillSchema>;
