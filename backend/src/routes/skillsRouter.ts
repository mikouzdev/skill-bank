import { Router, type Request, type Response } from "express";
import { UserSkill } from "../schemas/consultants.schema.js";

export const skillsRouter = Router();

skillsRouter.get("/:skills", (req: Request, res: Response) => {
  const parsedParams = UserSkill.safeParse(req.params);
  if (!parsedParams.success) {
    res.status(400).json(parsedParams.error);
    return;
  }
  const skill = parsedParams.data.skillName;

  res.send({
    skill,
    userId: 1,
  });
});
