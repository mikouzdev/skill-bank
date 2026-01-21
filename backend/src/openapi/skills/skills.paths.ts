import {
  SkillTagsSchema,
} from "../../schemas/consultants/skills.schema.js";

export const skillsPaths2 = {
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
  },
}