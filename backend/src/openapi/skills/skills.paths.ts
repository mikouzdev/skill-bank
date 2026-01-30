import {
  PatchSkillTagBodySchema,
  PostSkillTagBodySchema,
  SkillNameParamsSchema,
  SkillTagSchema,
  SkillTagsSchema,
} from "../../schemas/skills/skill-tags.schema.js";

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
  },
};
