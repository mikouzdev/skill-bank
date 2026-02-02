import { Router, type Request, type Response } from "express";
import { ConsultantIdParamsSchema } from "../../schemas/consultants/consultants.schema.js";
import {
  DeleteEmploymentSkillParamsSchema,
  EmploymentBodySchema,
  EmploymentIdParamsSchema,
  PostEmploymentSkillBodySchema,
} from "../../schemas/consultants/employment.schema.js";
import { Visibility } from "../../generated/prisma/enums.js";
import { prisma } from "../../db/prismaClient.js";
import { authenticate, type AuthenticatedRequest, findMe } from "../../middlewares/authentication.js";

export const employmentsRouter = Router();

employmentsRouter.get(
  "/:consultantId/employments",
  async (req: Request, res: Response) => {
    try {
      const parsedParams = ConsultantIdParamsSchema.safeParse(req.params);
      if (!parsedParams.success) {
        res.status(400).json(parsedParams.error);
        return;
      }

      const { consultantId } = parsedParams.data;
      // Visibility for now, auth based later
      //Sales/admin can see everyone, consult gets only public
      //Visibility.LIMITED
      const allowedVisibilities = [Visibility.PUBLIC];
      const employments = await prisma.employment.findMany({
        where: {
          consultantId,
          visibility: {
            in: allowedVisibilities,
          },
        },
        include: {
          employmentSkills: true,
        },
      });

      res.status(200).json(employments);
    } catch (error) {
      console.error("Failed at: GET /:consultantId/employments", error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }
);

employmentsRouter.post(
  "/me/employments", authenticate, findMe,
  async (req: AuthenticatedRequest, res: Response) => {
    console.log("Found consultant");

    const parsedBody = EmploymentBodySchema.safeParse(req.body);

    if (!parsedBody.success) {
      res.status(400).json(parsedBody.error);
      return;
    }
    const {
      description,
      jobTitle,
      start,
      end,
      visibility,
      employer,
      employmentSkills,
    } = parsedBody.data;

    let createdEmployment = null;
    let consultantId = res.locals.consultantId;
    try {
      if(consultantId !== undefined && consultantId !== null){
        createdEmployment = await prisma.employment.create({
          data: {
            consultantId,
            employer,
            description,
            jobTitle,
            start,
            ...(end !== undefined ? { end } : {}),
            visibility,
            employmentSkills: {
              create: employmentSkills.map((skill) => ({
                skillTagName: skill.skillTagName,
              })),
            },
          },
        });
      }
    } catch (err) {
      res.status(500).json(err);
      return;
    }

    res.status(201).json(createdEmployment);
  }
);

employmentsRouter.put(
  "/me/employments/:employmentId", authenticate, findMe,
  async (req: AuthenticatedRequest, res: Response) => {
    const parsedParams = EmploymentIdParamsSchema.safeParse(req.params);
    if (!parsedParams.success) {
      res.status(400).json(parsedParams.error);
      return;
    }
    const { employmentId } = parsedParams.data;

    const parsedBody = EmploymentBodySchema.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json(parsedBody.error);
      return;
    }
    const {
      description,
      jobTitle,
      start,
      end,
      visibility,
      employer,
      employmentSkills,
    } = parsedBody.data;

    let employment = null;
    let consultantId = res.locals.consultantId;
    try {
      if(consultantId !== undefined && consultantId !== null){
        employment = await prisma.employment.update({
          where: { id: employmentId, consultantId: consultantId },
          data: {
            description,
            employer,
            jobTitle,
            start,
            ...(end !== undefined ? { end } : {}),
            visibility,
            employmentSkills: {
              deleteMany: {}, // delete skills of the employment
              // create incoming skills, ( it errors if the skill doesnt exist in SkillTag )
              create: employmentSkills.map((skill) => ({
                skillTagName: skill.skillTagName,
              })),
            },
          },
        });
      }
    } catch (err) {
      res.status(500).json(err);
      return;
    }

    res.json(employment);
  }
);

employmentsRouter.delete(
  "/me/employments/:employmentId", authenticate, findMe,
  async (req: AuthenticatedRequest, res: Response) => {
    const parsedParams = EmploymentIdParamsSchema.safeParse(req.params);
    if (!parsedParams.success) {
      res.status(400).json(parsedParams.error);
      return;
    }
    const { employmentId } = parsedParams.data;
    let consultantId = res.locals.consultantId;
    try {
      if(consultantId !== undefined && consultantId !== null){
        await prisma.employment.delete({
          where: { id: employmentId, consultantId: consultantId },
        });
      }
    } catch (err) {
      res.status(500).json(err);
      return;
    }

    res.status(204).send();
  }
);

employmentsRouter.post(
  "/me/employments/:employmentId/skills", authenticate, findMe,
  async (req: AuthenticatedRequest, res: Response) => {
    const parsedParams = EmploymentIdParamsSchema.safeParse(req.params);
    const parsedBody = PostEmploymentSkillBodySchema.safeParse(req.body);

    if (!parsedParams.success) {
      res.status(400).json(parsedParams.error);
      return;
    }
    if (!parsedBody.success) {
      res.status(400).json(parsedBody.error);
      return;
    }

    const { employmentId } = parsedParams.data;
    const { skillTagName } = parsedBody.data;

    let employmentSkill = null;
    let consultantId = res.locals.consultantId;
    try {
      if(consultantId !== undefined && consultantId !== null){
        const employment = await prisma.employment.findUnique({
          where: { id: employmentId, consultantId: consultantId }
        });
        if (employment === null) {
          res
            .status(404)
            .json({ message: "Employment not found" });
          return;
        }
        employmentSkill = await prisma.employmentSkill.create({
          data: {
            employmentId,
            skillTagName,
          },
        });
      }
    } catch (err) {
      res.status(500).json(err);
      return;
    }

    res.json(employmentSkill);
  }
);

employmentsRouter.delete(
  "/me/employments/:employmentId/skills/:employmentSkillId", authenticate, findMe,
  async (req: AuthenticatedRequest, res: Response) => {
    const parsedParams = DeleteEmploymentSkillParamsSchema.safeParse(
      req.params
    );
    if (!parsedParams.success) {
      res.status(400).json(parsedParams.error);
      return;
    }
    const { employmentId, employmentSkillId } = parsedParams.data;
    let consultantId = res.locals.consultantId;
    try {
      if(consultantId !== undefined && consultantId !== null){
        const employment = await prisma.employment.findUnique({
          where: { id: employmentId, consultantId: consultantId }
        });
        if (employment === null) {
          res
            .status(404)
            .json({ message: "Employment not found" });
          return;
        }
        await prisma.employmentSkill.delete({
          where: { id: employmentSkillId, employmentId },
        });
      }
    } catch (err) {
      res.status(500).json(err);
      return;
    }

    res.status(204).send();
  }
);
