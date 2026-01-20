import {
    GetAttributesResponseSchema
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
}