import { Router, type Request, type Response } from "express";
import { UserSkill } from "../../schemas/consultants/consultants.schema.js";
import { prisma } from "../../db/prismaClient.js";

export const skillsRouter = Router();

skillsRouter.get("/:skills", async (req: Request, res: Response) => {
  const parsedParams = UserSkill.safeParse(req.params);
  if (!parsedParams.success) {
    res.status(400).json(parsedParams.error);
    return;
  }
  const skill = parsedParams.data.SkillName;
  let getSkill = null;
  try {
    getSkill = await prisma.userSkill.findFirst({
      where: { id: 0 },
    });
  } catch (err) {
    res.status(500).json(err);
    return;
  }
});
