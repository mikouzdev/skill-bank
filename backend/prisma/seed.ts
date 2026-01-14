import {
  PrismaClient,
  Role,
  Visibility,
} from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding unified schema...");

  // ===========================================
  // CLEAN DATABASE
  // ===========================================

  await prisma.employmentSkill.deleteMany();
  await prisma.employment.deleteMany();
  await prisma.consultantSkill.deleteMany();
  await prisma.user.deleteMany();
  await prisma.consultant.deleteMany();
  await prisma.skillTag.deleteMany();
  await prisma.userRole.deleteMany();

  console.log("🧹 Database cleared");

  // ===========================================
  // User & Consultant
  // ===========================================

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

  //=============================================


  const consultantUser2 = await prisma.user.create({
    data: {
      name: "Bob Consultant",
      email: "bob@demo.com",
      passwordHash: "hashed-password",
      roles: {
        create: [{ role: Role.CONSULTANT }],
      },
    },
  });

  const consultant2 = await prisma.consultant.create({
    data: {
      userId: consultantUser2.id,
      description: "Senior frontend developer",
      roleTitle: "Senior Frontend Engineer",
      profilePictureUrl: "https://picsum.photos/200",
      consultantAttributes: {
        create: [
          {
            label: "LinkedIn",
            value: "https://linkedin.com/in/bob",
          },
        ],
      },
    },
  });
  console.log("🧑‍💼 Consultant Bob created");

  //===========================================

  const consultantUser3 = await prisma.user.create({
    data: {
      name: "Carol Consultant",
      email: "Carol@demo.com",
      passwordHash: "hashed-password",
      roles: {
        create: [{ role: Role.CONSULTANT }],
      },
    },
  });

  const consultant3 = await prisma.consultant.create({
    data: {
      userId: consultantUser3.id,
      description: "Junior backend developer",
      roleTitle: "Junior Backend Engineer",
      profilePictureUrl: "https://picsum.photos/200",
      consultantAttributes: {
        create: [
          {
            label: "LinkedIn",
            value: "https://linkedin.com/in/carol",
          },
        ],
      },
    },
  });
  console.log("🧑‍💼 Consultant Carol created");
  // ===========================================
  // Skills
  // ===========================================

  const skilltags = await prisma.skillTag.createMany({
    data: [{ name: "java" }, { name: "csharp" }, { name: "python" }, {name: "kotlin"}, {name: "rust"}],
  });

  const skills = await prisma.consultantSkill.createMany({
    data: [
      { skillName: "java", proficiency: 4, consultantId: consultant.id },
      {
        skillName: "csharp",

        proficiency: 3,
        consultantId: consultant.id,
      },
      {
        skillName: "python",
        proficiency: 2,
        consultantId: consultant.id,
      },
      {
        skillName: "python",
        proficiency: 1,
        consultantId: consultant3.id,
      },
      {
        skillName: "kotlin",
        proficiency: 1,
        consultantId: consultant2.id,
      },
      {
        skillName: "rust",
        proficiency: 1,
        consultantId: consultant2.id,
      },
      {
        skillName: "java",
        proficiency: 1,
        consultantId: consultant2.id,
      },
      {
        skillName: "python",
        proficiency: 1,
        consultantId: consultant2.id,
      },
      {
        skillName: "csharp",
        proficiency: 1,
        consultantId: consultant2.id,
      },
      {
        skillName: "csharp",
        proficiency: 1,
        consultantId: consultant3.id,
      },

    ],
  });

  //================================================

  console.log("🛠️ Skills created");

  // ===========================================
  // Projects
  // ===========================================

  const data = [
    {
      consultantId: consultant.id,
      name: "Projektien projekti",
      description: "Projektien projekti on tosi iso projekti.",
      visibility: "PUBLIC" as const,
      start: new Date("2024-02-20"),
      projectLinks: [
        {
          url: "https://example.com",
          label: "Github",
        },
        {
          url: "https://example.com",
          label: "Another link",
        },
      ],
    },
    {
      consultantId: consultant.id,
      name: "Piiloniekka",
      description:
        "Peli, jossa piiloniekka piilottaa projekteja konsultanteilta.",
      visibility: "LIMITED" as const,
      start: new Date("2025-03-20"),
      end: new Date("2025-03-27"),
      projectLinks: [
        {
          url: "https://example.com",
          label: "Gitlab",
        },
      ],
    },
    {
      consultantId: consultant.id,
      name: "Lorem Ipsum",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      visibility: "PUBLIC" as const,
      start: new Date("2025-05-20"),
      end: new Date("2025-08-20"),
      projectLinks: [
        {
          url: "https://example.com",
          label: "Lorem ipsum",
        },
      ],
    },
  ];

  await prisma.$transaction(
    data.map((project) =>
      prisma.project.create({
        data: {
          consultantId: project.consultantId,
          name: project.name,
          description: project.description,
          visibility: project.visibility,
          start: project.start,
          end: project.end,
          projectLinks: {
            create: project.projectLinks.map((link) => ({
              url: link.url,
              label: link.label,
            })),
          },
        },
      })
    )
  );

  console.log("🛠️ Projects created");
  // Employment + Employment skills
  // ===========================================

  const employment = await prisma.employment.create({
    data: {
      consultantId: consultant.id,
      employer: "Oy Pulju Ab",
      jobTitle: "Fullstack developer",
      description: "A bit of this and a bit of that",
      start: new Date("2020-03-01"),
      end: new Date("2020-06-20"),
      visibility: Visibility.PUBLIC,
    },
  });

  console.log("Employment created");

  await prisma.employmentSkill.createMany({
    data: [
      { employmentId: employment.id, skillTagName: "java" },
      { employmentId: employment.id, skillTagName: "python" },
    ],
  });

  console.log("Employment skills created");

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
