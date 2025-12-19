import { Router, type Request, type Response } from "express";
import { UserSkillSchema } from "../schemas/skills.schema.js";
import { prisma } from "../db/prismaClient.js";

export const skillsRouter = Router();

skillsRouter.get("/", async (req: Request, res: Response) => {
  try {
    const skills = await prisma.userSkill.findMany();
    res.send(skills);
    return;
  } catch (err) {
    res.status(500).json(err);
    return;
  }
});

skillsRouter.get("/:consultantId", async (req: Request, res: Response) => {
  const parsedParams = UserSkillSchema.safeParse(req.params);
  if (!parsedParams.success) {
    res.status(400).json(parsedParams.error);
    return;
  }
  const consultant = parsedParams.data.consultantId;
  let getSkill = null;

  try {
    getSkill = await prisma.userSkill.findMany({
      where: { consultantId: consultant },
    });
  } catch (err) {
    res.status(500).json(err);
    return;
  }
  if (consultant === null) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(getSkill);
});
