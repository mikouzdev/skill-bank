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
        const testOfferPage = await prisma.offerPages.findUnique({
            where: { shortDescription: "test short description" },
        });
        await prisma.offerPages.delete({
            where: { id: testOfferPage.id },
        });
        const testSkill = await prisma.skillTag.findUnique({
            where: { name: "cypress" },
        });
        await prisma.skillTag.delete({
            where: { name: testSkill.name },
        });
        const testSkill2 = await prisma.skillTag.findUnique({
            where: { OR: [{ name: "testing" }, { name: "testing2" }] },
        });
        await prisma.skillTag.delete({
            where: { name: testSkill2.name },
        });
        const testCategory = await prisma.skillCategory.findUnique({
            where: { OR: [{ name: "Test category" }, { name: "Edited test category" }] },
        });
        await prisma.skillCategory.delete({
            where: { id: testCategory.id },
        });
    } catch (err) {
        res.status(500).json(err);
        return;
    }
    return;
};

export default clean;