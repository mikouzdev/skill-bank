import {
  GetProjectsResponseSchema,
  ProjectSchema,
  ProjectBodySchema,
  PostProjectLinkBodySchema,
  ProjectLinkSchema,
  ProjectSkillSchema,
  PostProjectSkillBodySchema,
  ProjectBodyPartialSchema
} from "../../schemas/consultants/projects.schema.js";

export const projectsPaths = {
  "/consultants/me/projects": {
    post: {
      summary: "Create a new project",
      tags: ["Projects"],
      requestBody: {
        required: true,
        content: { "application/json": { schema: ProjectBodySchema } },
      },
      responses: {
        200: {
          description: "Creation successful",
          content: {
            "application/json": { schema: ProjectSchema },
          },
        },
        400: { description: "Invalid request body" },
        500: { description: "Server error" },
      },
    },
  },
  "/consultants/{consultantId}/projects": {
    get: {
      summary: "Get all projects of a consultant",
      tags: ["Projects"],
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
            "application/json": { schema: GetProjectsResponseSchema },
          },
        },
        400: { description: "Invalid consultant id" },
        500: { description: "Server error" },
      },
    },
  },
  "/consultants/me/projects/{projectId}": {
    put: {
      summary: "Update a project",
      tags: ["Projects"],
      parameters: [
        {
          name: "projectId",
          in: "path" as const,
          required: true,
          schema: { type: "integer" as const },
        },
      ],
      requestBody: {
        required: true,
        content: { "application/json": { schema: ProjectBodyPartialSchema } },
      },
      responses: {
        200: {
          description: "Update successful",
          content: {
            "application/json": { schema: ProjectSchema },
          },
        },
        400: { description: "Invalid request body" },
        500: { description: "Server error" },
      },
    },
    delete: {
      summary: "Delete a project",
      tags: ["Projects"],
      parameters: [
        {
          name: "projectId",
          in: "path" as const,
          required: true,
          schema: { type: "integer" as const },
        },
      ],
      responses: {
        204: {
          description: "Deletion successful",
        },
        400: { description: "Invalid project id" },
        500: { description: "Server error" },
      },
    },
  },
  "/consultants/me/projects/{projectId}/links": {
    post: {
      summary: "Create a new project link",
      tags: ["Projects"],
      parameters: [
        {
          name: "projectId",
          in: "path" as const,
          required: true,
          schema: { type: "integer" as const },
        },
      ],
      requestBody: {
        required: true,
        content: { "application/json": { schema: PostProjectLinkBodySchema } },
      },
      responses: {
        200: {
          description: "Creation successful",
          content: {
            "application/json": { schema: ProjectLinkSchema },
          },
        },
        400: { description: "Invalid request" },
        500: { description: "Server error" },
      },
    },
  },
  "/consultants/me/projects/{projectId}/links/{linkId}": {
    delete: {
      summary: "Delete a project link",
      tags: ["Projects"],
      parameters: [
        {
          name: "projectId",
          in: "path" as const,
          required: true,
          schema: { type: "integer" as const },
        },
        {
          name: "linkId",
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
  "/consultants/me/projects/{projectId}/skills": {
    post: {
      summary: "Create a new project skill",
      tags: ["Projects"],
      parameters: [
        {
          name: "projectId",
          in: "path" as const,
          required: true,
          schema: { type: "integer" as const },
        },
      ],
      requestBody: {
        required: true,
        content: { "application/json": { schema: PostProjectSkillBodySchema } },
      },
      responses: {
        200: {
          description: "Creation successful",
          content: {
            "application/json": { schema: ProjectSkillSchema },
          },
        },
        400: { description: "Invalid request" },
        500: { description: "Server error" },
      },
    },
  },
  "/consultants/me/projects/{projectId}/skills/{projectSkillId}": {
    delete: {
      summary: "Delete a project skill",
      tags: ["Projects"],
      parameters: [
        {
          name: "projectId",
          in: "path" as const,
          required: true,
          schema: { type: "integer" as const },
        },
        {
          name: "projectSkillId",
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
