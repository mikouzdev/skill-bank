import {
  LoginSchema,
  AuthResponseSchema,
  LogoutResponseSchema,
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
            "application/json": { schema: AuthResponseSchema },
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
      summary: "Get decoded token",
      tags: ["Auth"],
      responses: {
        "200": {
          description: "Token received",
          content: {
            "application/json": { schema: AuthResponseSchema },
          },
        },
      },
    },
  },
};
