## Setup

1. `cd backend`
2. `pnpm install`
3. `pnpm run db:migrate` (database has to be running)
4. `pnpm run db:seed`
5. (Add secrets to `.env` if something is missing from `.env.example`)
6. `pnpm run dev`

## Environmental variables

The file `.env.example` has all the env variables listed and some default values if possible. The file `.env` overwrites the default values and it can contain secret values so it's not uploaded to the repository.

## Package.json scripts

* `pnpm run dev`: Run in development mode.
* `pnpm run generate:api-types`: Generate shared types for the frontend after changes in the backend.
* `pnpm run db:generate`: Generates typescript files based on the Prisma schema.
* `pnpm run db:migrate`: Moves changes from Prisma schema to the database.
* `pnpm run db:seed`: Seeds the database with the `seed.ts`.
* `pnpm run env`: Used to set up environment variables for the other commands. Uses dotenvx instead of dotenv to handle multiple .env files.

## File hierarchy

```
backend
├── prisma/
│   ├── schema.prisma  # database tables as prisma models
│   └── seed.ts  # testing data
├── src
│   ├── db/
│   │   └── prismaClient.ts  # manages the database connection
│   ├── middlewares/
│   ├── openapi/
│   ├── routes/
│   ├── schemas/
│   ├── services/
│   ├── storage/
│   ├── app.ts
│   └── index.ts
└── ...
```