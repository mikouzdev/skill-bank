import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL || "";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const adapter = new PrismaPg({ connectionString });

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const prisma = new PrismaClient({ adapter });
