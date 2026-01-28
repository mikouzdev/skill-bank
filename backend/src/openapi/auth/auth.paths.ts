import {
  LoginSchema,
  AuthResponseSchema as AuthLoginResponseSchema,
  LogoutResponseSchema,
  MeResponseSchema,
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
};
