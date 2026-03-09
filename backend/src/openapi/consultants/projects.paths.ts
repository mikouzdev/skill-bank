import {
  GetProjectsResponseSchema,
  ProjectSchema,
  ProjectBodySchema,
  PostProjectLinkBodySchema,
  ProjectLinkSchema,
  ProjectSkillSchema,
  PostProjectSkillBodySchema,
  ProjectBodyPartialSchema,
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
        201: {
          description: "Creation successful",
          content: {
            "application/json": { schema: ProjectSchema },
          },
        },
        400: { description: "Invalid request body" },
        403: { descriptiom: "Prisma error" },
        500: { description: "Server error" },
        503: { descriptiom: "Database connection error" },
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
        403: { descriptiom: "Prisma error" },
        500: { description: "Server error" },
        503: { descriptiom: "Database connection error" },
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
        403: { descriptiom: "Prisma error" },
        500: { description: "Server error" },
        503: { descriptiom: "Database connection error" },
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
        403: { descriptiom: "Prisma error" },
        409: { descriptiom: "reference error" },
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
        201: {
          description: "Creation successful",
          content: {
            "application/json": { schema: ProjectLinkSchema },
          },
        },
        400: { description: "Invalid request" },
        403: { descriptiom: "Prisma error" },
        500: { description: "Server error" },
        503: { descriptiom: "Database connection error" },
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
        403: { descriptiom: "Prisma error" },
        409: { descriptiom: "Reference error" },
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
        201: {
          description: "Creation successful",
          content: {
            "application/json": { schema: ProjectSkillSchema },
          },
        },
        400: { description: "Invalid request" },
        403: { descriptiom: "Prisma error" },
        500: { description: "Server error" },
        503: { descriptiom: "Database connection error" },
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
        403: { descriptiom: "Prisma error" },
        409: { descriptiom: "Reference error" },
        500: { description: "Server error" },
      },
    },
  },
};
