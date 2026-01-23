import {
  AllUsersResponseSchema,
  FullUserResponseSchema,
  UserBodySchema
} from "../../schemas/admin/admin.schema.js";

export const adminPaths = {
    "/admin/users": {
        get: {
            summary: "Get all users",
            tags: ["Admin", "User"],
            responses: {
                "200": {
                    description: "Token received",
                    content: {
                        "application/json": { schema: AllUsersResponseSchema },
                    },
                },
                "500": {
                    description: "Server error"
                },
            },
        },
        post: {
            summary: "Post new user",
            tags: ["Admin", "User"],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                    schema: UserBodySchema, // Unsafe assignmet, for later could consider using zod-to-openapi https://github.com/asteasolutions/zod-to-openapi
                    },
                },
            },
            responses: {
                "201": {
                    description: "User created",
                    content: {
                        "application/json": { schema: FullUserResponseSchema },
                    },
                },
                "409": {
                    description: "User email already in use"
                },
                "500": {
                    description: "Server error"
                },
            },
        },
    },
    "/admin/users/{userId}": {
        delete: {
            summary: "Delete a user",
            tags: ["Admin", "User"],
            parameters: [
                {
                    name: "userId",
                    in: "path" as const,
                    required: true,
                    schema: { type: "integer" as const },
                },
            ],
            responses: {
                204: { description: "Deletion successful" },
                400: { description: "Invalid request" },
                500: { description: "Server error" },
            },
        },
    },
}