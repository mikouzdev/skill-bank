import { PostSkillTagBodySchema, SkillTagsSchema } from "../../schemas/skills/skill-tags.schema.js"

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
        content: { "application/json": { schema: PostSkillTagBodySchema} },
      },
      responses: {
        201: { description: "Created", content: { "application/json": { schema: SkillTagsSchema} } },
        400: { description: "Invalid request" }, 
        409: { description: "Skill already exists"},
        500: { description: "Server error" },
      }
    }
  },
};