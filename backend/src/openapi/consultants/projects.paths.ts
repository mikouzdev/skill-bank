import { GetProjectsResponseSchema } from "../../schemas/consultants/projects.schema.js";

export const projectsPaths = {
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
