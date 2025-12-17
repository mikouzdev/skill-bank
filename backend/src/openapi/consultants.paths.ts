import {
  ConsultantIdParamsSchema,
  ConsultantResponseSchema,
  AllConsultantsResponseSchema,
} from "../schemas/consultants.schema.js";

export const consultantPaths = {
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
          in: "path",
          required: true,
          schema: ConsultantIdParamsSchema,
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
        500: { description: "Server error" },
      },
    },
  },
};
