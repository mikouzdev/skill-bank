import { prisma } from "../../backend/src/db/prismaClient.ts";

const cleanSkills = async () => {
    await prisma.skillTag.delete({
        where: { name: "cypress" },
    });
    await prisma.skillTag.delete({
        where: { name: "testing" },
    });
    await prisma.skillTag.delete({
        where: { name: "testing2" },
    });
    const testCategory = await prisma.skillCategory.findUnique({
        where: { name: "Test category" },
    });
    await prisma.skillCategory.delete({
        where: { id: testCategory.id },
    });
    const testCategory2 = await prisma.skillCategory.findUnique({
        where: { name: "Edited test category" },
    });
    return await prisma.skillCategory.delete({
        where: { id: testCategory2.id },
    });
};

export default cleanSkills;