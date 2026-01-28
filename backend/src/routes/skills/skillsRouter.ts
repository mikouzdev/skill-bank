import { Router, type Request, type Response } from "express";
import { prisma } from "../../db/prismaClient.js";
import {
  authenticate,
  type AuthenticatedRequest,
} from "../../middlewares/authentication.js";
import { PostSkillTagBodySchema } from "../../schemas/skills/skill-tags.schema.js";

export const skillsRouter = Router();

/**
 * Gets all skills in the database
 * @route GET /skills
 * @returns [skills]
 */
skillsRouter.get("/", async (req: Request, res: Response) => {
  try {
    const skills = await prisma.skillTag.findMany({
      orderBy: { name: "asc" },
    });
    res.send(skills);
    return;
  } catch (err) {
    res.status(500).json(err);
    return;
  }
});

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
