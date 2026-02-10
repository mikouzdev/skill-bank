import {
  EmploymentListResponseSchema,
  EmploymentResponseSchema,
  EmploymentCreateSchema,
  PostEmploymentSkillBodySchema,
  EmploymentBodyPartialSchema,
} from "../../schemas/consultants/employment.schema.js";

export const employmentPaths = {
  "/consultants/{consultantId}/employments": {
    get: {
      summary: "Get consultant employments",
      tags: ["Employments"],
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
      tags: ["Employments"],
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
  "/consultants/me/employments/{employmentId}": {
    put: {
      summary: "Edits consultant's employment",
      tags: ["Employments"],
      parameters: [
        {
          name: "employmentId",
          in: "path" as const,
          required: true,
          schema: { type: "integer" as const },
        },
      ],
      requestBody: {
        required: true,
        content: { "application/json": { schema: EmploymentBodyPartialSchema } },
      },
      responses: {
        200: {
          description: "Creation successful",
          content: {
            "application/json": { schema: EmploymentCreateSchema },
          },
        },
        400: { description: "Invalid request" },
        500: { description: "Server error" },
      },
    },
    delete: {
      summary: "Deletes a consultant's employment",
      tags: ["Employments"],
      parameters: [
        {
          name: "employmentId",
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
  "/consultants/me/employments/{employmentId}/skills": {
    post: {
      summary: "Adds a skill to consultant's employment",
      tags: ["Employments"],
      parameters: [
        {
          name: "employmentId",
          in: "path" as const,
          required: true,
          schema: { type: "integer" as const },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": { schema: PostEmploymentSkillBodySchema },
        },
      },
      responses: {
        201: {
          description: "Employment created",
          content: {
            "application/json": {
              schema: PostEmploymentSkillBodySchema,
            },
          },
        },
        400: { description: "Invalid input" },
        401: { description: "Unauthorized" },
        500: { description: "Internal server error" },
      },
    },
  },
  "/consultants/me/employments/{employmentId}/skills/{skillId}": {
    delete: {
      summary: "Delete a employment skill",
      tags: ["Employments"],
      parameters: [
        {
          name: "employmentId",
          in: "path" as const,
          required: true,
          schema: { type: "integer" as const },
        },
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
