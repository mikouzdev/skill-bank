import { z } from "zod";

export const SkillTagSchema = z
  .object({
    id: z.number().int().meta({ example: 1 }),
    categoryId: z.number().int().nullable().meta({ example: null }),
    name: z.string().meta({ example: "typescript" }),
  })
  .meta({ id: "SkillTag" });

export const SkillTagsSchema = z
  .array(SkillTagSchema)
  .meta({ id: "SkillTagList" });

export const PostSkillTagBodySchema = z
  .object({
    name: z.string().min(1).meta({ example: "typescript" }),
    categoryId: z.number().int().nullable().optional().meta({ example: 1 }),
  })
  .meta({ id: "PostSkillTagBody" });

export const PostSkillTagWithoutCategoryBodySchema = z
  .object({
    name: z.string().min(1).meta({ example: "typescript" }),
  })
  .meta({ id: "PostSkillTagWithoutCategoryBody" });

export const PatchSkillTagBodySchema = z
  .object({
    categoryId: z.number().int().nullable().optional().meta({ example: 1 }),
  })
  .meta({ id: "PatchSkillTagBody" });

export const SkillNameParamsSchema = z.object({
  skillName: z.string().min(1).meta({ example: "typescript" }),
});

export type PostSkillTagBody = z.infer<typeof PostSkillTagBodySchema>;
