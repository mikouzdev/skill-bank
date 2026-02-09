import {
  ConsultantSkillSchema,
  ConsultantSkillsSchema,
  PostConsultantSkillBodySchema,
  SkillProficiencyBodyPartialSchema
} from "../../schemas/consultants/skills.schema.js";

import { SkillTagsSchema } from "../../schemas/skills/skill-tags.schema.js";

export const skillsPaths = {
  "/consultants/skills/all": {
    get: {
      summary: "Get all available skills for consultant",
      tags: ["Consultants", "Skills"],
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
  "/consultants/skills/{consultantId}": {
    get: {
      summary: "Get all skills of a consultant",
      tags: ["Consultants", "Skills"],
      parameters: [
        {
          name: "consultantId",
          in: "path" as const,
          required: true,
          schema: { type: "integer" as const },
        },
      ],
      responses: {
        200: {
          description: "Retrieval successful",
          content: {
            "application/json": { schema: ConsultantSkillsSchema },
          },
        },
        400: { description: "Invalid request body" },
        404: { description: "Not found" },
        500: { description: "Server error" },
      },
    },
  },
  "/consultants/skills/me": {
    post: {
      summary: "Create a new skill",
      tags: ["Consultants", "Skills"],
      requestBody: {
        required: true,
        content: {
          "application/json": { schema: PostConsultantSkillBodySchema },
        },
      },
      responses: {
        200: {
          description: "Creation successful",
          content: {
            "application/json": { schema: ConsultantSkillSchema },
          },
        },
        400: { description: "Invalid request" },
        500: { description: "Server error" },
      },
    },
  },
  "/consultants/skills/me/{skillId}": {
    put: {
      summary: "Update a skill",
      tags: ["Consultants", "Skills"],
      parameters: [
        {
          name: "skillId",
          in: "path" as const,
          required: true,
          schema: { type: "integer" as const },
        },
      ],
      requestBody: {
        required: true,
        content: { "application/json": { schema: SkillProficiencyBodyPartialSchema } },
      },
      responses: {
        200: { description: "Update successful" },
        400: { description: "Invalid request" },
        500: { description: "Server error" },
      },
    },
    delete: {
      summary: "Delete a skill",
      tags: ["Consultants", "Skills"],
      parameters: [
        {
          name: "skillId",
          in: "path" as const,
          required: true,
          schema: { type: "integer" as const },
        },
      ],
      responses: {
        204: { description: "Deletion successful" },
        400: { description: "Invalid request" },
        500: { description: "Server error" },
      },
    },
  },
};
