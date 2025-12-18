import { EmploymentListResponseSchema } from "../../schemas/consultants/employment.schema.js";

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
          desciption: "Success",
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
};
