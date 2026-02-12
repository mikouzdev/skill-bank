import {
    GetSalesListsResponseSchema
} from "../../schemas/sales/salesLists.schema.js";

export const salesListPaths = {
    "/sales/{salesId}/lists": {
        get: {
            summary: "Get lists of a sales person",
            tags: ["Sales lists"],
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
        }
    }
}