Documentation: [[Backend]]

This backend uses **Zod + zod-openapi** to generate OpenAPI documentation and
shared TypeScript types **directly from code**.

- **Swagger UI**  
  → http://localhost:3000/docs

- **OpenAPI JSON (generated at runtime)**  
  → http://localhost:3000/openapi.json

This JSON is the **only OpenAPI source of truth**.

Quick instructions:

1. Start backend
   Run server:

- pnpmn run dev
  Verify in browser:
- http://localhost:3000/openapi.json

2. Generate shared API types
   While server running:

- pnpm generate:api-types
- this will create in the project root shared/generated/api-types/openapi.d.ts
- commit this file, no manual editing

3. Create/edit schemas & paths and after that generate api-types again
