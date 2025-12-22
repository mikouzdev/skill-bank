import { z } from "zod";

export const UserSkillSchema = z.object({
  consultantId: z.coerce.number().meta({ id: "3" }),
});

export type UserSkill = z.infer<typeof UserSkillSchema>;
