import {
    GetAttributesResponseSchema, AttributeBodySchema, AttributeSchema
} from "../../schemas/consultants/attributes.schema.js";

export const attributesPaths = {
    "/consultants/{consultantId}/attributes": {
        get: {
            summary: "Get all attributes of a consultant",
            tags: ["Consultants", "Attributes"],
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
                        "application/json": { schema: GetAttributesResponseSchema },
                    },
                },
                400: { description: "Invalid consultant id" },
                500: { description: "Server error" },
            },
        },
    },
    "/consultants/me/attributes": {
        post: {
            summary: "Create a new attribute",
            tags: ["Consultants", "Attributes"],
            requestBody: {
                required: true,
                content: { "application/json": { schema: AttributeBodySchema } },
            },
            responses: {
                200: {
                    description: "Creation successful",
                    content: {
                    "application/json": { schema: AttributeSchema },
                    },
                },
                400: { description: "Invalid request body" },
                500: { description: "Server error" },
            },
        },
    }
}