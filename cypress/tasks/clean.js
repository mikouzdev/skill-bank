import {
  PrismaClient
} from "../../backend/src/generated/prisma/client.ts";
import { PrismaPg } from "../../backend/node_modules/@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const clean = async () => {
    try {
        await prisma.user.delete({
            where: { email: "testi@testmail.com" },
        });
        await prisma.user.delete({
            where: { email: "testi@gmail.com" },
        });
    } catch (err) {
        res.status(500).json(err);
        return;
    }
    return;
};

export default clean;