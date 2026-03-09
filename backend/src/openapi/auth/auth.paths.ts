import { FullUserResponseSchema } from "../../schemas/admin/admin.schema.js";
import {
  LoginSchema,
  AuthResponseSchema as AuthLoginResponseSchema,
  LogoutResponseSchema,
  MeResponseSchema,
  RoleBodySchema,
} from "../../schemas/auth/auth.schema.js";

export const authPaths = {
  "/auth/login": {
    post: {
      summary: "Login user",
      tags: ["Auth"],
      security: [], //override auth require
      requestBody: {
        required: true,
        content: {
          "application/json": { schema: LoginSchema },
        },
      },
      responses: {
        "200": {
          description: "Login successful",
          content: {
            "application/json": { schema: AuthLoginResponseSchema },
          },
        },
        401: { description: "Invalid credentials" },
      },
    },
  },
  "/auth/logout": {
    post: {
      summary: "Logout user",
      tags: ["Auth"],
      responses: {
        "200": {
          description: "Logout successful",
          content: {
            "application/json": { schema: LogoutResponseSchema },
          },
        },
      },
    },
  },
  "/auth/me": {
    get: {
      summary: "Get current user identity and roles",
      tags: ["Auth"],
      responses: {
        "200": {
          description: "OK",
          content: {
            "application/json": { schema: MeResponseSchema },
          },
        },
      },
    },
  },
  "/auth/role": {
    patch: {
      summary: "Update current user's primary role",
      tags: ["Auth"],
      requestBody: {
        required: true,
        content: {
          "application/json": { schema: RoleBodySchema },
        },
      },
      responses: {
        200: {
          description: "Update successful",
          content: {
            "application/json": { schema: FullUserResponseSchema },
          },
        },
        202: { description: "Role is already primary role" },
        400: { description: "Invalid request" },
        401: { description: "Unauthorized" },
        404: { description: "Not found" },
        422: { description: "User only has one role" },
        500: { description: "Server error" },
        503: { description: "Prisma error" },
      },
    },
  },
};
