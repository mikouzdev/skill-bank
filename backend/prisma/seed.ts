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
  await prisma.consultant.deleteMany();
  await prisma.userRole.deleteMany();
  await prisma.user.deleteMany();
  await prisma.skillTag.deleteMany();
  await prisma.skillCategory.deleteMany();

  console.log("🧹 Database cleared");

  // ===========================================
  // Admin User
  // ===========================================

  await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@admin.com",
      passwordHash:
        "$argon2i$v=19$m=16,t=2,p=1$aXNuVjNDZmlWdVdSUG9KYQ$k0KvnEBaLJHBQ9y3rHwQUQ",
      roles: {
        create: [{ role: Role.ADMIN }],
      },
    },
  });

  console.log("🛡️ Admin user created");

  // ===========================================
  // User & Consultant
  // ===========================================

  //password is hashed-password
  const consultantUser = await prisma.user.create({
    data: {
      name: "Alice Consultant",
      email: "alice@demo.com",
      passwordHash:
        "$argon2i$v=19$m=16,t=2,p=1$aXNuVjNDZmlWdVdSUG9KYQ$k0KvnEBaLJHBQ9y3rHwQUQ",
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
            type: "LINK",
          },
          {
            label: "GitHub",
            value: "https://github.com/alice",
            type: "LINK",
          },
          {
            label: "GitLab",
            value: "https://gitlab.com/alice",
            type: "LINK",
          },
        ],
      },
    },
  });
  console.log("🧑‍💼 Consultant Alice created");

  //=============================================

  //password is hashed-password
  const consultantUser2 = await prisma.user.create({
    data: {
      name: "Bob Consultant",
      email: "bob@demo.com",
      passwordHash:
        "$argon2i$v=19$m=16,t=2,p=1$dnczbXJHT1NwcmFLV1QxTQ$YECDcgXPulRTa5tdTH4/Gg",
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

  //password is hashed-password
  const consultantUser3 = await prisma.user.create({
    data: {
      name: "Carol Consultant",
      email: "Carol@demo.com",
      passwordHash:
        "$argon2i$v=19$m=16,t=2,p=1$MVJ6ZnpNeXNtOGtQaHlpVw$fP95KVM9JdBQXOFyKRPsfQ",
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
  // Salesperson user
  // ===========================================

  // password is hashed-password
  // sama passu kuin Alice Consultantilla
  const salesUser = await prisma.user.create({
    data: {
      name: "Sally Sales",
      email: "sally@demo.com",
      passwordHash:
        "$argon2i$v=19$m=16,t=2,p=1$aXNuVjNDZmlWdVdSUG9KYQ$k0KvnEBaLJHBQ9y3rHwQUQ",
      roles: {
        create: [{ role: Role.SALESPERSON }],
      },
    },
  });

  await prisma.salesperson.create({
    data: {
      userId: salesUser.id,
    },
  });

  console.log("🧑‍💼 Salesperson Sally created");
  // ===========================================
  // Skills
  // ===========================================

  await prisma.skillTag.createMany({
    data: [
      { name: "java" },
      { name: "csharp" },
      { name: "python" },
      { name: "kotlin" },
      { name: "rust" },
      { name: "javascript" },
      { name: "typescript" },
      { name: "go" },
      { name: "php" },
      { name: "ruby" },
      { name: "swift" },
      { name: "scala" },
      { name: "perl" },
      { name: "dart" },
      { name: "elixir" },
      { name: "haskell" },
      { name: "clojure" },
      { name: "objective-c" },
      { name: "sql" },
      { name: "graphql" },
      { name: "html" },
      { name: "css" },
      { name: "react" },
      { name: "vue" },
      { name: "angular" },
      { name: "svelte" },
      { name: "docker" },
      { name: "kubernetes" },
      { name: "aws" },
      { name: "azure" },
    ],
  });

  await prisma.consultantSkill.createMany({
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
  // Category
  // ===========================================

  await prisma.skillCategory.create({
    data: { name: "Frontend" },
  });

  console.log("🏷️ Frontend category created");

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

  console.log("💼 Employment skills created");

  // ===========================================
  // Page sections
  // ===========================================
  await prisma.pageSection.createMany({
    data: [
      {
        consultantId: consultant.id,
        name: "GENERAL" as const,
        visibility: "PUBLIC" as const,
      },
      {
        consultantId: consultant.id,
        name: "NETWORKING_LINKS" as const,
        visibility: "PUBLIC" as const,
      },
      {
        consultantId: consultant.id,
        name: "SKILLS" as const,
        visibility: "PUBLIC" as const,
      },
      {
        consultantId: consultant.id,
        name: "EMPLOYMENTS" as const,
        visibility: "PUBLIC" as const,
      },
      {
        consultantId: consultant.id,
        name: "PROJECTS" as const,
        visibility: "PUBLIC" as const,
      },
    ],
  });
  console.log("📖 Page sections created");

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
