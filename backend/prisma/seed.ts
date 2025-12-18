import { PrismaClient, Role } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding unified schema...");

  // ===========================================
  // CLEAN DATABASE
  // ===========================================

  await prisma.userSkill.deleteMany();
  await prisma.user.deleteMany();
  await prisma.consultant.deleteMany();
  await prisma.skillTag.deleteMany();
  await prisma.userRole.deleteMany();

  console.log("🧹 Database cleared");

  const consultantUser = await prisma.user.create({
    data: {
      name: "Alice Consultant",
      email: "alice@demo.com",
      passwordHash: "hashed-password",
      roles: {
        create: [{ role: Role.CONSULTANT }],
      },
    },
  });

  const consultant = await prisma.consultant.create({
    data: {
      userId: consultantUser.id,
      description: "Senior backend developer",
      roleTitle: "Senior Backend Engineer",
      profilePictureUrl: "https://picsum.photos/200",
      consultantAttributes: {
        create: [
          {
            label: "LinkedIn",
            value: "https://linkedin.com/in/alice",
          },
        ],
      },
    },
  });
  console.log("🧑‍💼 Consultant created");
  // ===========================================
  // Skills
  // ===========================================

  const skilltags = await prisma.skillTag.createMany({
    data: [{ name: "Java" }, { name: "C#" }, { name: "Python" }],
  });

  const skills = await prisma.userSkill.createMany({
    data: [
      { skillName: "Java", proficiency: 4, consultantId: consultant.id },
      {
        skillName: "C#",
        proficiency: 3,
        consultantId: consultant.id,
      },
      {
        skillName: "Python",
        proficiency: 2,
        consultantId: consultant.id,
      },
    ],
  });

  console.log("🛠️ Skills created");

  console.log("🎉 Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
