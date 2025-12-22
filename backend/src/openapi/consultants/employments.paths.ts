import {
  EmploymentListResponseSchema,
  EmploymentResponseSchema,
  EmploymentCreateSchema,
} from "../../schemas/consultants/employment.schema.js";

export const employmentPaths = {
  "/consultants/{consultantId}/employments": {
    get: {
      summary: "Get consultant employments",
      tags: ["Consultants", "Employments"],
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
          description: "Success",
          content: {
            "application/json": {
              schema: EmploymentListResponseSchema,
            },
          },
        },
        400: { description: "Invalid consultant id" },
        401: { description: "Unauthorized" },
        403: { description: "Forbidden" },
        404: { description: "Consultant not found" },
        500: { description: "Internal server error" },
      },
    },
  },
  "/consultants/me/employments": {
    post: {
      summary: "Create consultant employment",
      tags: ["Consultants", "Employments"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: EmploymentCreateSchema, // Unsafe assignmet, for later could consider using zod-to-openapi https://github.com/asteasolutions/zod-to-openapi
          },
        },
      },
      responses: {
        201: {
          description: "Employment created",
          content: {
            "application/json": {
              schema: EmploymentResponseSchema,
            },
          },
        },
        400: { description: "Invalid input" },
        401: { description: "Unauthorized" },
        500: { description: "Internal server error" },
      },
    },
  },
};
