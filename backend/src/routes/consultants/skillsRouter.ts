import { Router, type Request, type Response } from "express";
import { UserSkillSchema } from "../../schemas/consultants/skills.schema.js";
import { prisma } from "../../db/prismaClient.js";

export const skillsRouter = Router();

/**
 * Gets all skills in the database
 * @route GET /skill/
 * @returns [skills]
 */
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

/**
 * Get skills of a consultants
 * @route GET /skill/{consultantId}
 * @returns Skillbody
 */
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

/**
 * Creates a skill for consultant
 * @route : POST /skill/{consultantId}
 * @body : {skill: string, proficiency: number}
 */
skillsRouter.post("/:consultantId", async (req: Request, res: Response) => {
  const parsedParams = UserSkillSchema.safeParse(req.params);
  const { skill, proficiency } = req.body as {
    skill: string;
    proficiency: number;
  };

  if (!skill || proficiency === undefined) {
    return res.status(400).json({
      error: "skill and proficiency are required",
    });
  }

  if (!parsedParams.success) {
    res.status(400).json(parsedParams.error);
    return;
  }
  const consultantId = parsedParams.data.consultantId;

  try {
    if (!(await prisma.skillTag.findFirst({ where: { name: skill } }))) {
      await prisma.skillTag.create({
        data: {
          name: skill,
        },
      });
      await prisma.userSkill.create({
        data: {
          skillName: skill,
          proficiency: proficiency,
          consultantId: consultantId,
        },
      });
      const user = await prisma.user.findFirst({ where: { id: consultantId } });
      res.status(200).json(`Skill ${skill} added to ${user?.name}`);
      return;
    } else {
      res.status(500).json(`Skill ${skill} already exists`);
    }
  } catch (err) {
    res.status(500).json(err);
    return;
  }
});

/**
 * Deletes a skill by ID
 * @body {id: {skill's id}}
 * @route DELETE /skill/
 */
skillsRouter.delete("/", async (req: Request, res: Response) => {
  const { id } = req.body as {
    id: number;
  };
  const skill = await prisma.userSkill.findFirst({ where: { id: id } });
  try {
    await prisma.userSkill.delete({ where: { id: id } });
    res.status(200).json(`Skill ${skill?.skillName} deleted`);
    return;
  } catch (err) {
    res.status(500).json(err);
  }
});

skillsRouter.put("/:consultantId", async (req: Request, res: Response) => {
  const { id, proficiency, skill } = req.body as {
    id: number;
    proficiency: number;
    skill: string;
  };

  try {
    if (!(await prisma.skillTag.findFirst({ where: { name: skill } }))) {
      await prisma.skillTag.create({
        data: { name: skill },
      });
    }
    await prisma.userSkill.update({
      where: { id: id },
      data: { proficiency: proficiency, skillName: skill },
    });

    res.status(200).json(`Skill updated`);
    return;
  } catch (err) {
    res.status(500).json(err);
  }
});
