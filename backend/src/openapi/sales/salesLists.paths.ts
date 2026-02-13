import {
    GetSalesListsResponseSchema, SalesListBodyPartialSchema, SalesListBodySchema, SalesListSchema
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
                409: { description: "Cannot add same consultant twice to the same sales list" },
                500: { description: "Server error" },
            },
        },
    },
    "/sales/{salesId}/lists/{salesListId}": {
        put: {
            summary: "Update a sales list",
            tags: ["Sales Lists"],
            parameters: [
                {
                    name: "salesId",
                    in: "path" as const,
                    required: true,
                    schema: { type: "integer" as const },
                },
                {
                    name: "salesListId",
                    in: "path" as const,
                    required: true,
                    schema: { type: "integer" as const },
                },
            ],
            requestBody: {
                required: true,
                content: { "application/json": { schema: SalesListBodyPartialSchema } },
            },
            responses: {
                200: {
                    description: "Update successful",
                    content: {
                    "application/json": { schema: SalesListSchema },
                    },
                },
                400: { description: "Invalid request body" },
                404: { description: "Customer or Consultant not found" },
                409: { description: "Consultant sales list already exists" },
                500: { description: "Server error" },
            },
        },
        delete: {
            summary: "Delete a sales list",
            tags: ["Sales Lists"],
            parameters: [
                {
                name: "salesId",
                in: "path" as const,
                required: true,
                schema: { type: "integer" as const },
                },
                {
                name: "salesListId",
                in: "path" as const,
                required: true,
                schema: { type: "integer" as const },
                },
            ],
            responses: {
                204: { description: "Sales list deleted" },
                400: { description: "Invalid request" },
                500: { description: "Server error" },
            },
        },
    }
}