import {
  GetOfferPagesResponseSchema,
  OfferPageBodySchema,
  OfferPageSchema,
  OfferPageBodyPartialSchema,
  ConsultantPageSchema,
  PatchConsultantPageBodySchema,
  OfferPagePasswordSchema,
  OfferPageLoginResponseSchema,
} from "../../schemas/sales/offers.schema.js";

export const offersPaths = {
  "/sales/{salesId}/offers": {
    get: {
      summary: "Get offer pages of a sales person",
      tags: ["Offer Pages"],
      parameters: [
        {
          name: "salesId",
          in: "path" as const,
          required: true,
          schema: { type: "integer" as const },
        },
      ],
      responses: {
        200: {
          description: "Retrieval successful",
          content: {
            "application/json": { schema: GetOfferPagesResponseSchema },
          },
        },
        400: { description: "Invalid id" },
        404: { description: "Customer not found" },
        500: { description: "Server error" },
      },
    },
    post: {
      summary: "Create a new offer page",
      tags: ["Offer Pages"],
      parameters: [
        {
          name: "salesId",
          in: "path" as const,
          required: true,
          schema: { type: "integer" as const },
        },
      ],
      requestBody: {
        required: true,
        content: { "application/json": { schema: OfferPageBodySchema } },
      },
      responses: {
        201: {
          description: "Creation successful",
          content: {
            "application/json": { schema: OfferPageSchema },
          },
        },
        400: { description: "Invalid request body" },
        404: { description: "Customer or Consultant not found" },
        409: {
          description:
            "Cannot add same consultant twice to the same offer page",
        },
        500: { description: "Server error" },
      },
    },
  },
  "/sales/{salesId}/offers/{offerPageId}": {
    put: {
      summary: "Update an offer page",
      tags: ["Offer Pages"],
      parameters: [
        {
          name: "salesId",
          in: "path" as const,
          required: true,
          schema: { type: "integer" as const },
        },
        {
          name: "offerPageId",
          in: "path" as const,
          required: true,
          schema: { type: "integer" as const },
        },
      ],
      requestBody: {
        required: true,
        content: { "application/json": { schema: OfferPageBodyPartialSchema } },
      },
      responses: {
        200: {
          description: "Update successful",
          content: {
            "application/json": { schema: OfferPageSchema },
          },
        },
        400: { description: "Invalid request body" },
        404: { description: "Customer or Consultant not found" },
        409: { description: "Consultant offer page already exists" },
        500: { description: "Server error" },
      },
    },
    delete: {
      summary: "Delete an offer page",
      tags: ["Offer Pages"],
      parameters: [
        {
          name: "salesId",
          in: "path" as const,
          required: true,
          schema: { type: "integer" as const },
        },
        {
          name: "offerPageId",
          in: "path" as const,
          required: true,
          schema: { type: "integer" as const },
        },
      ],
      responses: {
        204: { description: "Offer page deleted" },
        400: { description: "Invalid request" },
        500: { description: "Server error" },
      },
    },
    post: {
      summary: "Post a password and get an offer page",
      tags: ["Offer Pages"],
      parameters: [
        {
          name: "salesId",
          in: "path" as const,
          required: true,
          schema: { type: "integer" as const },
        },
        {
          name: "offerPageId",
          in: "path" as const,
          required: true,
          schema: { type: "integer" as const },
        },
      ],
      requestBody: {
        required: true,
        content: { "application/json": { schema: OfferPagePasswordSchema } },
      },
      responses: {
        200: {
          description: "Retrieval successful",
          content: {
            "application/json": { schema: OfferPageLoginResponseSchema },
          },
        },
        400: { description: "Invalid request" },
        401: { description: "Invalid password" },
        404: { description: "Not found" },
        500: { description: "Server error" },
      },
    },
  },
  "/sales/{salesId}/offers/{offerPageId}/consultants/{consultantPageId}": {
    patch: {
      summary:
        "Update isAccepted status and customer review of a consultant page",
      tags: ["Offer Pages"],
      parameters: [
        {
          name: "salesId",
          in: "path" as const,
          required: true,
          schema: { type: "integer" as const },
        },
        {
          name: "offerPageId",
          in: "path" as const,
          required: true,
          schema: { type: "integer" as const },
        },
        {
          name: "consultantPageId",
          in: "path" as const,
          required: true,
          schema: { type: "integer" as const },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": { schema: PatchConsultantPageBodySchema },
        },
      },
      responses: {
        200: {
          description: "Update successful",
          content: {
            "application/json": { schema: ConsultantPageSchema },
          },
        },
        400: { description: "Invalid request" },
        403: { description: "Forbidden" },
        404: { description: "Offer page or consultant page not found" },
        500: { description: "Server error" },
      },
    },
  },
};
