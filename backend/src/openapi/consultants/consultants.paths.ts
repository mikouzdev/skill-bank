import {
  ConsultantResponseSchema,
  AllConsultantsResponseSchema,
} from "../../schemas/consultants/consultants.schema.js";

export const consultantsPaths = {
  "/consultants": {
    get: {
      summary: "Get all consultants",
      tags: ["Consultants"],
      responses: {
        200: {
          description: "Retrieval successful",
          content: {
            "application/json": { schema: AllConsultantsResponseSchema },
          },
        },
        500: { description: "Server error" },
      },
    },
  },
  "/consultants/{consultantId}": {
    get: {
      summary: "Get a single consultant",
      tags: ["Consultants"],
      parameters: [
        {
          name: "consultantId",
          in: "path" as const,
          required: true,
          // TODO: use ConsultantIdParamsSchema
          schema: { type: "integer" as const },
        },
      ],
      responses: {
        200: {
          description: "Retrieval successful",
          content: {
            "application/json": { schema: ConsultantResponseSchema },
          },
        },
        400: { description: "Invalid consultant id" },
        404: { description: "Consultant with that id was not found" },
        500: { description: "Internal server error" },
      },
    },
  },
  "/consultants/me": {
    put: {
      summary: "Change consultant's data",
      tags: ["Consultants"],
      responses: {
        200: {
          description: "Data change successful",
        },
        500: { description: "Internal server error" },
      },
    },
  },
};
