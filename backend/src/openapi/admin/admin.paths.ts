import {
  AllUsersResponseSchema,
  UserBodySchema,
  UserBodyPartialSchema,
  UserResponseSchema,
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
        403: { descriptiom: "Prisma error" },
        "500": {
          description: "Server error",
        },
      },
    },
    post: {
      summary: "Post new user",
      tags: ["Admin"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: UserBodySchema,
          },
        },
      },
      responses: {
        "201": {
          description: "User created",
          content: {
            "application/json": { schema: UserResponseSchema },
          },
        },
        403: { descriptiom: "Prisma error" },
        "409": {
          description: "User email already in use",
        },
        "500": {
          description: "Server error",
        },
      },
    },
  },
  "/admin/users/{userId}": {
    delete: {
      summary: "Delete a user",
      tags: ["Admin"],
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
        403: { descriptiom: "Prisma error" },
        500: { description: "Server error" },
      },
    },
    put: {
      summary: "Update a user",
      tags: ["Admin"],
      parameters: [
        {
          name: "userId",
          in: "path" as const,
          required: true,
          schema: { type: "integer" as const },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: UserBodyPartialSchema,
          },
        },
      },
      responses: {
        200: {
          description: "Update successful",
          content: {
            "application/json": { schema: UserResponseSchema },
          },
        },
        400: { description: "Invalid request body" },
        403: { descriptiom: "Prisma error" },
        500: { description: "Server error" },
      },
    },
  },
};
