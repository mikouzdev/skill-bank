import { z } from "zod";
import {
  SkillTagSchema,
  PostSkillTagWithoutCategoryBodySchema,
} from "../skills/skill-tags.schema.js";

export const skillCategorySchema = z
  .object({
    id: z.number().meta({ example: "1" }),
    name: z.string().meta({ example: "Backend" }),
    skillTags: z.array(SkillTagSchema),
  })
  .meta({ id: "skillCategory" });

export const PostSkillCategoryBodySchema = skillCategorySchema
  .pick({
    name: true,
  })
  .extend({
    skillTags: z.array(PostSkillTagWithoutCategoryBodySchema),
  })
  .meta({ id: "skillCategoryBody" });

export const SkillCategoriesSchema = z
  .array(skillCategorySchema)
  .meta({ id: "SkillCategories" });

export const SkillCategoryIdParamsSchema = z
  .object({
    categoryId: z.coerce.number().meta({ example: "1" }),
  })
  .meta({ id: "SkillCategoryId" });

export const PostSkillCategoryBodyPartialSchema =
  PostSkillCategoryBodySchema.partial({
    name: true,
    skillTags: true,
  }).meta({ id: "PostSkillCategoryBodyPartial" });
