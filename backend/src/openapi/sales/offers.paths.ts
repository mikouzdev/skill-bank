import {
    GetOfferPagesResponseSchema, OfferPageBodySchema, OfferPageSchema
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
}