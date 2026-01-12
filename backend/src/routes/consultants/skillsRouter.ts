import { Router, type Request, type Response } from "express";
import { ConsultantIdParamsSchema } from "../../schemas/consultants/consultants.schema.js";
import { prisma } from "../../db/prismaClient.js";
import {
  SkillIdParamsSchema,
  PostSkillBodySchema,
  SkillProficiencyBodySchema,
} from "../../schemas/consultants/skills.schema.js";

export const skillsRouter = Router();

/**
 * Gets all skills in the database
 * @route GET /consultants/skills
 * @returns [skills]
 */
skillsRouter.get("/", async (req: Request, res: Response) => {
  try {
    const skills = await prisma.consultantSkill.findMany();
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
skillsRouter.get("/:consultantId", async (req: Request, res: Response) => {
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
});

/**
 * Creates a skill for consultant
 * @route : POST /consultants/skills/me
 * @body : {skill: string, proficiency: number}
 */
skillsRouter.post("/me", async (req: Request, res: Response) => {
  const parsedBody = PostSkillBodySchema.safeParse(req.body);

  if (!parsedBody.success) {
    res.status(400).json(parsedBody.error);
    return;
  }

  const { skillName, proficiency } = parsedBody.data;

  // TODO: use consultantId from a JWT token instead of getting the first
  //       entry from the database
  let consultantId;
  try {
    const consultant = await prisma.consultant.findFirst();
    if (consultant === null) {
      res
        .status(400)
        .json({ message: "No mock data found; create some first" });
      return;
    }
    consultantId = consultant.id;
  } catch (err) {
    res.status(500).json(err);
    return;
  }

  try {
    if (!(await prisma.skillTag.findFirst({ where: { name: skillName } }))) {
      await prisma.skillTag.create({
        data: {
          name: skillName,
        },
      });
      await prisma.consultantSkill.create({
        data: {
          skillName,
          proficiency: proficiency,
          consultantId: consultantId,
        },
      });
      const user = await prisma.user.findFirst({ where: { id: consultantId } });
      res.status(200).json(`Skill ${skillName} added to ${user?.name}`);
      return;
    } else {
      res.status(500).json(`Skill ${skillName} already exists`);
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
skillsRouter.delete("/me/:skillId", async (req: Request, res: Response) => {
  const parsedParams = SkillIdParamsSchema.safeParse(req.params);

  if (!parsedParams.success) {
    res.status(400).json(parsedParams.error);
    return;
  }

  const { skillId } = parsedParams.data;

  try {
    await prisma.consultantSkill.delete({ where: { id: skillId } });
  } catch (err) {
    res.status(500).json(err);
    return;
  }

  res.status(204).json();
});

/**
 * Edit the proficiency of a skill
 * @body {proficiency: {skill's proficiency}}
 * @route PUT /consultants/skills/me/{skillId}
 */
skillsRouter.put("/me/:skillId", async (req: Request, res: Response) => {
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
    await prisma.consultantSkill.update({
      where: { id: skillId },
      data: { proficiency },
    });
  } catch (err) {
    res.status(500).json(err);
    return;
  }

  res.json();
});
