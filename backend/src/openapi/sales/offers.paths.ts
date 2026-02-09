import {
    GetOfferPagesResponseSchema, OfferPageBodySchema, OfferPageSchema, OfferPageBodyPartialSchema
} from "../../schemas/sales/offers.schema.js";

export const offersPaths = {
    "/sales/{salesId}/offers": {
        get: {
            summary: "Get offer pages of a sales person",
            tags: ["Sales", "Offer Pages"],
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
            tags: ["Sales", "Offer Pages"],
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
                200: {
                    description: "Creation successful",
                    content: {
                    "application/json": { schema: OfferPageSchema },
                    },
                },
                400: { description: "Invalid request body" },
                404: { description: "Customer not found" },
                500: { description: "Server error" },
            },
        },
    },
    "/sales/{salesId}/offers/{offerPageId}": {
        put: {
            summary: "Update an offer page",
            tags: ["Sales", "Offer Pages"],
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
    }
}