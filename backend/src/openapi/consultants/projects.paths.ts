import {
  GetProjectsResponseSchema,
  ProjectSchema,
  ProjectBodySchema,
} from "../../schemas/consultants/projects.schema.js";

export const projectsPaths = {
  "/consultants/me/projects": {
    post: {
      summary: "Create a new project",
      tags: ["Consultants", "Projects"],
      requestBody: { required: true, content: { schema: ProjectBodySchema } },
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
      tags: ["Consultants", "Projects"],
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
    delete: {
      summary: "Delete a project",
      tags: ["Consultants", "Projects"],
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
};
