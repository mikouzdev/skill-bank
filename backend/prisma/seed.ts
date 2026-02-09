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
  await prisma.salesList.deleteMany();
  await prisma.consultantSkill.deleteMany();
  await prisma.consultant.deleteMany();
  await prisma.salesperson.deleteMany();
  await prisma.userRole.deleteMany();
  await prisma.user.deleteMany();
  await prisma.skillTag.deleteMany();
  await prisma.skillCategory.deleteMany();
  await prisma.offerPages.deleteMany();

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

  const sales1 = await prisma.salesperson.create({
    data: {
      id: 1,
      userId: salesUser.id,
    },
  });

  console.log("🧑‍💼 Salesperson Sally created");

  // ===========================================
  // Customer user
  // ===========================================

  // password is hashed-password
  // sama passu kuin Alice Consultantilla
  const customerUser = await prisma.user.create({
    data: {
      name: "Cuno Customer",
      email: "cuno@demo.com",
      passwordHash:
        "$argon2i$v=19$m=16,t=2,p=1$aXNuVjNDZmlWdVdSUG9KYQ$k0KvnEBaLJHBQ9y3rHwQUQ",
      roles: {
        create: [{ role: Role.CUSTOMER }],
      },
    },
  });

  const customer1 = await prisma.customer.create({
    data: {
      userId: customerUser.id,
    },
  });

  console.log("🧑‍💼 Customer Cuno created");

  // ===========================================
  // Categories
  // ===========================================

  const frontendCategory = await prisma.skillCategory.create({
    data: { name: "Frontend" },
  });

  console.log("🏷️ Frontend category created");

  const backendCategory = await prisma.skillCategory.create({
    data: { name: "Backend" },
  });

  console.log("🏷️ Backend category created");

  // ===========================================
  // Skills
  // ===========================================

  await prisma.skillTag.createMany({
    data: [
      { name: "html", categoryId: frontendCategory.id },
      { name: "css", categoryId: frontendCategory.id },
      { name: "react", categoryId: frontendCategory.id },
      { name: "vue", categoryId: frontendCategory.id },
      { name: "angular", categoryId: frontendCategory.id },
      { name: "svelte", categoryId: frontendCategory.id },
      { name: "java", categoryId: backendCategory.id }, //backend start
      { name: "csharp", categoryId: backendCategory.id },
      { name: "python", categoryId: backendCategory.id },
      { name: "php", categoryId: backendCategory.id },
      { name: "sql", categoryId: backendCategory.id },
      { name: "graphql", categoryId: backendCategory.id },
      { name: "javascript" },
      { name: "typescript" },
      { name: "kotlin" },
      { name: "rust" },
      { name: "go" },
      { name: "ruby" },
      { name: "swift" },
      { name: "scala" },
      { name: "perl" },
      { name: "dart" },
      { name: "elixir" },
      { name: "haskell" },
      { name: "clojure" },
      { name: "objective-c" },
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

  await prisma.salesList.createMany({
    data: [
      {
        salespersonId: sales1.id,
        description: "Pitempi testi teksti" as const,
        shortDescription: "testi teksti" as const,
        customerId: customer1.id,
      },
    ],
  });

  console.log("📖 Sales lists created");

  //password: hashed-password
  const offerPage = await prisma.offerPages.create({
    data: {
      salespersonId: sales1.id,
      name: "Project A" as const,
      description: `Here is a offer for Project A. 
        You were looking for a consultant with at least 10 years of experience of frontend technology. 
        Here is three professional choices.` as const,
      shortDescription: "testi teksti" as const,
      passwordHash:
        "$argon2i$v=19$m=16,t=2,p=1$aXNuVjNDZmlWdVdSUG9KYQ$k0KvnEBaLJHBQ9y3rHwQUQ",
      customerId: customer1.id,
    },
  });

  console.log("📖 Offer pages created");

  await prisma.consultantPages.createMany({
    data: [
      {
        offerPageId: offerPage.id,
        consultantId: consultant.id,
        showInfo: true,
      },
      {
        offerPageId: offerPage.id,
        consultantId: consultant2.id,
        showInfo: true,
      },
      {
        offerPageId: offerPage.id,
        consultantId: consultant3.id,
        showInfo: true,
      },
    ],
  });

  console.log("📖 Consultants added to offer page");

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
