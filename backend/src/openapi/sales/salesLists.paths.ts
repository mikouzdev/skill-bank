import {
    GetSalesListsResponseSchema, SalesListBodySchema, SalesListSchema
} from "../../schemas/sales/salesLists.schema.js";

export const salesListPaths = {
    "/sales/{salesId}/lists": {
        get: {
            summary: "Get lists of a sales person",
            tags: ["Sales Lists"],
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
                        "application/json": { schema: GetSalesListsResponseSchema },
                    },
                },
                400: { description: "Invalid id" },
                500: { description: "Server error" },
            },
        },
        post: {
            summary: "Create a new sales list",
            tags: ["Sales Lists"],
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
                content: { "application/json": { schema: SalesListBodySchema } },
            },
            responses: {
                200: {
                    description: "Creation successful",
                    content: {
                    "application/json": { schema: SalesListSchema },
                    },
                },
                400: { description: "Invalid request body" },
                404: { description: "Customer or Consultant not found" },
                500: { description: "Server error" },
            },
        },
    }
}