import { Router, type Request, type Response } from "express";
import { prisma } from "../../db/prismaClient.js";
import {
  authenticate,
  type AuthenticatedRequest,
} from "../../middlewares/authentication.js";
import {
  PostSkillTagBodySchema,
  PatchSkillTagBodySchema,
  SkillNameParamsSchema,
} from "../../schemas/skills/skill-tags.schema.js";
import { PostSkillCategoryBodySchema, SkillCategoryIdParamsSchema } from "../../schemas/skills/skill-categories.schema.js"
import { Prisma } from "../../generated/prisma/client.js";
export const skillsRouter = Router();

/**
 * Gets all skills in the database
 * @route GET /skills
 * @returns [skills]
 */
skillsRouter.get("/", async (req: Request, res: Response) => {
  const skills = await prisma.skillTag.findMany({
    orderBy: { name: "asc" },
  });
  return res.json(
    skills.map((s) => ({
      id: s.id,
      name: s.name,
      categoryId: s.categoryid, // to get rid of mapping, change DB field to categoryId
    }))
  );
});

/**
 * Add new skill in the database
 * @route POST /skills
 * @returns added skill
 */
skillsRouter.post(
  "/",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    const roles = req.user?.roles ?? [];
    if (!roles?.includes("ADMIN") && !roles?.includes("SALESPERSON")) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    const parsed = PostSkillTagBodySchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ error: "Invalid body", details: parsed.error });
    }

    const name = parsed.data.name.trim().toLowerCase();

    const categoryId = parsed.data.categoryId ?? null;

    const skillTagRow = await prisma.skillTag.upsert({
      where: { name },
      update: {
        ...(parsed.data.categoryId !== undefined
          ? { categoryid: categoryId }
          : {}),
      },
      create: { name, categoryid: categoryId },
    });

    const skillTag = {
      id: skillTagRow.id,
      name: skillTagRow.name,
      categoryId: skillTagRow.categoryid, //DB name is categoryid, in Zod categoryId
    };

    return res.status(201).json(skillTag);
  }
);

/**
 * Update skill in the database
 * @route PATCH /skills/{skillName}
 * @returns updated skill
 */
skillsRouter.patch(
  "/:skillName",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const roles = req.user?.roles ?? [];
      if (!roles?.includes("ADMIN") && !roles?.includes("SALESPERSON")) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      const paramsParsed = SkillNameParamsSchema.safeParse(req.params);
      if (!paramsParsed.success) {
        return res.status(400).json({ error: "Invalid request" });
      }

      const skillName = paramsParsed.data.skillName.trim().toLowerCase();

      const bodyParsed = PatchSkillTagBodySchema.safeParse(req.body);
      if (!bodyParsed.success) {
        return res.status(400).json({ error: "Invalid request" });
      }

      const categoryId = bodyParsed.data.categoryId;

      const updatedSkillTag = await prisma.skillTag.update({
        where: { name: skillName },
        data: {
          ...(categoryId !== undefined ? { categoryid: categoryId } : {}),
        },
      });

      return res.status(200).json({
        id: updatedSkillTag.id,
        name: updatedSkillTag.name,
        categoryId: updatedSkillTag.categoryid,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case "P2025":
            return res.status(404).json({ error: "Skill tag not found" });
          case "P2003":
            return res.status(400).json({ error: "Invalid request" }); // categoryId does not exist
        }
      }
      throw error;
    }
  }
);

/**
 * Delete skill in the database
 * @route DELETE /skills/{skillName}
 * @returns confirmation message
 */
skillsRouter.delete(
  "/:skillName",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    const roles = req.user?.roles ?? [];
    if (!roles?.includes("ADMIN") && !roles?.includes("SALESPERSON")) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const paramsParsed = SkillNameParamsSchema.safeParse(req.params);
    if (!paramsParsed.success) {
      return res.status(400).json({ error: "Invalid request" });
    }

    const skillName = paramsParsed.data.skillName.trim().toLowerCase();

    const skillUsage = await prisma.skillTag.findUnique({
      where: { name: skillName },
      select: {
        _count: {
          select: {
            consultantSkills: true,
            employmentSkills: true,
            projectSkills: true,
          },
        },
      },
    });

    if (!skillUsage) {
      return res.status(404).json({ error: "Skill not found" });
    }

    if (
      skillUsage._count.consultantSkills > 0 ||
      skillUsage._count.employmentSkills > 0 ||
      skillUsage._count.projectSkills > 0
    ) {
      return res.status(409).json({
        error: "Skill is in use and cannot be deleted",
        counts: skillUsage._count,
      });
    }

    await prisma.skillTag.delete({
      where: { name: skillName },
    });

    return res.status(200).json({ message: "Skill deleted" });
  }
);

/**
 * Get all skill categories in the database
 * @route GET /skills/categories
 * @returns [skill categories]
 */
skillsRouter.get("/categories", authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const categories = await prisma.skillCategory.findMany({
        include: {
          skillTags: true,
        },
      }
    );
    res.send(categories);
    return;
  } catch (err) {
    res.status(500).json(err);
    return;
  }
});

/**
 * Add new skill category in the database
 * @route POST /skills/categories
 * @returns created skill category
 */
skillsRouter.post("/categories", authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const roles = req.user?.roles ?? [];
  if (!roles?.includes("ADMIN") && !roles?.includes("SALESPERSON")) {
    return res.status(403).json({ error: "Unauthorized" });
  }
  const parsedBody = PostSkillCategoryBodySchema.safeParse(req.body);
  if (!parsedBody.success) {
    return res
      .status(400)
      .json({ error: "Invalid body", details: parsedBody.error });
  }
  const { name, skillTags } = parsedBody.data;

  let category = null;
  try {
    category = await prisma.skillCategory.create({
        data: {
          name,
          skillTags: {
            create: skillTags.map((skillTag) => ({
              name: skillTag.name
            })),
          }
        },
      });
      res.status(201).json(category);
      return;
    } catch (err) {
    res.status(500).json(err);
    return;
  }

});

/**
 * Edit skill category in the database
 * @route PUT /skills/categories/{categoryId}
 * @returns edited skill category
 */
skillsRouter.put("/categories/:categoryId", authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const roles = req.user?.roles ?? [];
  if (!roles?.includes("ADMIN") && !roles?.includes("SALESPERSON")) {
    return res.status(403).json({ error: "Unauthorized" });
  }
  const parsedParams = SkillCategoryIdParamsSchema.safeParse(req.params);
  if (!parsedParams.success) {
    res.status(400).json(parsedParams.error);
    return;
  }
  const { categoryId } = parsedParams.data;

  const parsedBody = PostSkillCategoryBodySchema.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(400).json(parsedBody.error);
    return;
  }
  const { name, skillTags } = parsedBody.data;

  let category = null;
  try {
    category = await prisma.skillCategory.update({
      where: { id: categoryId },
      data: {
        name,
        skillTags: {
          deleteMany: {}, // delete skills
            // create incoming skills, ( it errors if the skill doesnt exist in SkillTag )
          create: skillTags.map((skillTag) => ({
            name: skillTag.name,
          })),
        }
      },
    });
    res.status(200).json(category);
    return;
  } catch (err) {
    res.status(500).json(err);
    return;
  }
});

/**
 * Delete skill category in the database
 * @route DELETE /skills/categories/{categoryId}
 * @returns confirmation of deletion
 */
skillsRouter.delete("/categories/:categoryId", authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const roles = req.user?.roles ?? [];
  if (!roles?.includes("ADMIN") && !roles?.includes("SALESPERSON")) {
    return res.status(403).json({ error: "Unauthorized" });
  }
  const parsedParams = SkillCategoryIdParamsSchema.safeParse(req.params);
  if (!parsedParams.success) {
    res.status(400).json(parsedParams.error);
    return;
  }
  const { categoryId } = parsedParams.data;

  try {
      await prisma.skillCategory.delete({ 
          where: { 
            id: categoryId
          }
        });
      res.status(204).json();
      return;
    } catch (err) {
    res.status(500).json(err);
    return;
  }
});