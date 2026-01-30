import { Router, type Request, type Response } from "express";
import { ConsultantIdParamsSchema } from "../../schemas/consultants/consultants.schema.js";
import { prisma } from "../../db/prismaClient.js";
import {
  SkillIdParamsSchema,
  PostConsultantSkillBodySchema,
  SkillProficiencyBodySchema,
} from "../../schemas/consultants/skills.schema.js";
import {
  authenticate,
  type AuthenticatedRequest,
  findMe
} from "../../middlewares/authentication.js";
import jwt from "jsonwebtoken";

export const skillsRouter = Router();

/**
 * Gets all skills in the database
 * @route GET /consultants/skills/all
 * @returns [skills]
 */
skillsRouter.get("/skills/all", async (req: Request, res: Response) => {
  try {
    const skills = await prisma.skillTag.findMany();
    res.send(skills);
    return;
  } catch (err) {
    res.status(500).json(err);
    return;
  }
});

/**
 * Get skills of a consultant
 * @route GET /consultants/skills/{consultantId}
 * @returns Skillbody
 */
skillsRouter.get(
  "/skills/:consultantId",
  async (req: Request, res: Response) => {
    const parsedParams = ConsultantIdParamsSchema.safeParse(req.params);
    if (!parsedParams.success) {
      res.status(400).json(parsedParams.error);
      return;
    }
    const consultant = parsedParams.data.consultantId;
    let getSkill = null;

    try {
      getSkill = await prisma.consultantSkill.findMany({
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
  }
);

/**
 * Creates a skill for consultant
 * @route : POST /consultants/skills/me
 * @body : {skill: string, proficiency: number}
 */
skillsRouter.post("/skills/me", authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const parsedBody = PostConsultantSkillBodySchema.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(400).json(parsedBody.error);
    return;
  }
  const { skillName, proficiency } = parsedBody.data;

  try {
    let consultantId = await findMe(req.user!.id, res);
    if(consultantId !== undefined && consultantId !== null){
      // make sure the skill exists in skilltags
      const skillExists = await prisma.skillTag.findFirst({
        where: { name: skillName },
      });
      if (!skillExists) {
        res.status(404).json(`skill ${skillName} doesnt exist in the skill pool`);
        return;
      }

      // check if consultant already has this skill
      const consultantHasSkill = await prisma.consultantSkill.findFirst({
        where: {
          consultantId: consultantId,
          skillName: skillName,
        },
      });

      if (consultantHasSkill) {
        res.status(400).json(`consultant already has skill ${skillName}`);
        return;
      }

      // add the skill to the consultant
      const createdSkill = await prisma.consultantSkill.create({
        data: {
          skillName,
          proficiency: proficiency,
          consultantId: consultantId,
        },
      });

      res.status(200).json(createdSkill);
      return;
    }
  } catch (err) {
    res.status(500).json(err);
    return;
  }
});

/**
 * Deletes a skill by ID
 * @route DELETE /consultants/skills/me/{skillId}
 */
skillsRouter.delete(
  "/skills/me/:skillId", authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    const parsedParams = SkillIdParamsSchema.safeParse(req.params);

    if (!parsedParams.success) {
      res.status(400).json(parsedParams.error);
      return;
    }

    const { skillId } = parsedParams.data;

    try {
      let consultantId = await findMe(req.user!.id, res);
      if(consultantId !== undefined && consultantId !== null){
        await prisma.consultantSkill.delete({ 
          where: { 
            id: skillId, 
            consultantId: consultantId
          }
        });
      }
    } catch (err) {
      res.status(500).json(err);
      return;
    }

    res.status(204).json();
  }
);

/**
 * Edit the proficiency of a skill
 * @body {proficiency: {skill's proficiency}}
 * @route PUT /consultants/skills/me/{skillId}
 */
skillsRouter.put("/skills/me/:skillId", authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const parsedParams = SkillIdParamsSchema.safeParse(req.params);
  const parsedBody = SkillProficiencyBodySchema.safeParse(req.body);

  if (!parsedParams.success) {
    res.status(400).json(parsedParams.error);
    return;
  }
  if (!parsedBody.success) {
    res.status(400).json(parsedBody.error);
    return;
  }

  const { skillId } = parsedParams.data;
  const { proficiency } = parsedBody.data;

  try {
    let consultantId = await findMe(req.user!.id, res);
    if(consultantId !== undefined && consultantId !== null){
      await prisma.consultantSkill.update({
        where: { id: skillId, consultantId: consultantId },
        data: { proficiency },
      });
    }
  } catch (err) {
    res.status(500).json(err);
    return;
  }

  res.json();
});
