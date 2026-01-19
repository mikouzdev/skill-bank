import {
  AllUsersResponseSchema,
} from "../../schemas/admin/admin.schema.js";

export const adminPaths = {
    "/admin/users": {
        get: {
            summary: "Get all users",
            tags: ["Admin"],
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
    },
}