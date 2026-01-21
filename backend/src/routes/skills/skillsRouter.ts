import { Router, type Request, type Response } from "express";
import { prisma } from "../../db/prismaClient.js";

export const skillsRouter = Router();

/**
 * Gets all skills in the database
 * @route GET /skills
 * @returns [skills]
 */
skillsRouter.get("/", async (req: Request, res: Response) => {
  try {
    const skills = await prisma.skillTag.findMany();
    res.send(skills);
    return;
  } catch (err) {
    res.status(500).json(err);
    return;
  }
});