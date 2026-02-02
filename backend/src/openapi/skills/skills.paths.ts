import {
  PatchSkillTagBodySchema,
  PostSkillTagBodySchema,
  SkillNameParamsSchema,
  SkillTagSchema,
  SkillTagsSchema,
} from "../../schemas/skills/skill-tags.schema.js";
import { PostSkillCategoryBodySchema, skillCategorySchema, SkillCategoriesSchema } from "../../schemas/skills/skill-categories.schema.js"

export const allSkillsPaths = {
  "/skills": {
    get: {
      summary: "Get all available skills",
      tags: ["Skills"],
      responses: {
        200: {
          description: "Retrieval successful",
          content: {
            "application/json": { schema: SkillTagsSchema },
          },
        },
        500: { description: "Server error" },
      },
    },
    post: {
      summary: "Create a new skill",
      tags: ["Skills"],
      requestBody: {
        required: true,
        content: { "application/json": { schema: PostSkillTagBodySchema } },
      },
      responses: {
        201: {
          description: "Created",
          content: { "application/json": { schema: SkillTagSchema } },
        },
        400: { description: "Invalid request" },
        500: { description: "Server error" },
      },
    },
  },
  "/skills/{skillName}": {
    patch: {
      summary: "Update a skill",
      description:
        "Updates the category of an existing skill. Either categoryId or null can be provided.",
      tags: ["Skills"],
      requestParams: {
        path: SkillNameParamsSchema,
      },
      requestBody: {
        required: true,
        content: { "application/json": { schema: PatchSkillTagBodySchema } },
      },
      responses: {
        200: {
          description: "Updated",
          content: { "application/json": { schema: SkillTagSchema } },
        },
        400: { description: "Invalid request" },
        403: { description: "Unauthorized" },
        404: { description: "Skill not found" },
        500: { description: "Server error" },
      },
    },
    delete: {
      summary: "Delete a skill",
      tags: ["Skills"],
      requestParams: {
        path: SkillNameParamsSchema,
      },
      responses: {
        204: { description: "Skill deleted" },
        403: { description: "Unauthorized" },
        404: { description: "Skill not found" },
        409: { description: "Skill is in use and cannot be deleted" },
        500: { description: "Server error" },
      },
    },
  },
  "/skills/categories": {
    get: {
      summary: "Get all skill categories",
      tags: ["Skills"],
      responses: {
        200: {
          description: "Retrieval successful",
          content: {
            "application/json": { schema: SkillCategoriesSchema },
          },
        },
        500: { description: "Server error" },
      },
    },
    post: {
      summary: "Create a new skill category",
      tags: ["Skills"],
      requestBody: {
        required: true,
        content: { "application/json": { schema: PostSkillCategoryBodySchema } },
      },
      responses: {
        201: {
          description: "Created",
          content: { "application/json": { schema: skillCategorySchema } },
        },
        400: { description: "Invalid request" },
        500: { description: "Server error" },
      },
    },
  },
  "/skills/categories/{categoryId}": {
    put: {
      summary: "Edits a skill category",
      tags: ["Skills"],
      parameters: [
        {
          name: "categoryId",
          in: "path" as const,
          required: true,
          //TODO: use SkillCategoryIdParamsSchema
          schema: { type: "integer" as const },
        },
      ],
      requestBody: {
        required: true,
        content: { "application/json": { schema: PostSkillCategoryBodySchema } },
      },
      responses: {
        200: {
          description: "Edit successful",
          content: {
            "application/json": { schema: skillCategorySchema },
          },
        },
        400: { description: "Invalid request" },
        500: { description: "Server error" },
      },
    },
  }
};
