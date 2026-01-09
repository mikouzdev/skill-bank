import {
  ConsultantSkillSchema,
  ConsultantSkillsSchema,
  PostSkillBodySchema,
  SkillProficiencyBodySchema,
} from "../../schemas/consultants/skills.schema.js";

export const skillsPaths = {
  "/consultants/skills": {
    get: {
      summary: "Get all skills of all consultants",
      tags: ["Consultants", "Skills"],
      responses: {
        200: {
          description: "Retrieval successful",
          content: {
            "application/json": { schema: ConsultantSkillsSchema },
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
        content: { "application/json": { schema: PostSkillBodySchema } },
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
        content: { "application/json": { schema: SkillProficiencyBodySchema } },
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
