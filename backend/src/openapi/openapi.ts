import { createDocument } from "zod-openapi";
import { authPaths } from "./auth.paths.js";
import type { OpenAPIV3_1 } from "openapi-types";
import { consultantsPaths } from "./consultants.paths.js";

export const openApiDoc: OpenAPIV3_1.Document = createDocument({
  openapi: "3.1.0",
  info: {
    title: "SPankki API",
    version: "1.0.0",
    description: "This API is for SPankki recruiter app",
  },
  security: [{ bearerAuth: [] }], // if no auth required, override with : security: [] at the operation level
  servers: [
    { url: "http://localhost:3000", description: "Local development server" },
  ],

  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },

  paths: {
    ...authPaths, // add paths here
    ...consultantsPaths,
  },
}) as unknown as OpenAPIV3_1.Document; // workaround to have TS accept a mismatch between zod-openapi and openapi-types.
