import {
  ConsultantResponseSchema,
  AllConsultantsResponseSchema,
} from "../../schemas/consultants/consultants.schema.js";
import { JsonFilterSchema } from "../../schemas/consultants/search.schema.js";

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
  "/consultants/search": {
    get: {
      summary: "Search consultant by name",
      tags: ["Consultants"],
      parameters: [
        {
          name: "consultantName",
          in: "query" as const,
          required: true,
          schema: { type: "string" as const },
        },
      ],
      responses: {
        200: {
          description: "Some consultant found",
        },
        500: { description: "Internal server error" },
      },
    },
  },
  "/consultants/filter": {
    get: {
      summary: "Filter consultant by freetext",
      tags: ["Consultants"],
      parameters: [
        {
          name: "freeText",
          in: "query" as const,
          required: true,
          schema: { type: "string" as const },
        },
      ],
      responses: {
        200: {
          description: "Some consultant found",
        },
        500: { description: "Internal server error" },
      },
    },
  },
  "/consultants/jsonFilter": {
    post: {
      summary: "Filter consultant by JsonFilter",
      tags: ["Consultants"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: JsonFilterSchema,
          },
        },
      },
      responses: {
        200: {
          description: "Some consultant found",
          content: { "application/json": { schema: ConsultantResponseSchema } },
        },
        500: { description: "Internal server error" },
      },
    },
  },
};
