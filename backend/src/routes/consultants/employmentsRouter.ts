import { Router, type Response } from "express";
import { ConsultantIdParamsSchema } from "../../schemas/consultants/consultants.schema.js";
import {
  DeleteEmploymentSkillParamsSchema,
  EmploymentBodySchema,
  EmploymentIdParamsSchema,
  PostEmploymentSkillBodySchema,
} from "../../schemas/consultants/employment.schema.js";
import { Visibility } from "../../generated/prisma/enums.js";
import { prisma } from "../../db/prismaClient.js";
import {
  authenticate,
  type AuthenticatedRequest,
} from "../../middlewares/authentication.js";

export const employmentsRouter = Router();

/**
 * Get a consultant's employments
 * @route GET /consultants/{consultantId}/employments
 * @returns [employments]
 */
employmentsRouter.get(
  "/:consultantId/employments",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const parsedParams = ConsultantIdParamsSchema.safeParse(req.params);
      if (!parsedParams.success) {
        res.status(400).json(parsedParams.error);
        return;
      }

      const { consultantId } = parsedParams.data;
      const roles = req.user?.roles ?? [];
      let allowedVisibilities = [Visibility.PUBLIC, Visibility.LIMITED];
      //Sales/admin can see everyone, consult gets only public
      if (!roles?.includes("ADMIN") && !roles?.includes("SALESPERSON")) {
        allowedVisibilities = [Visibility.PUBLIC];
      }
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

/**
 * Add employment for current consultant
 * @route POST /consultants/me/employments
 * @returns created employment
 */
employmentsRouter.post(
  "/me/employments",
  authenticate,
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
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        roles: { select: { role: true } },
        consultant: { select: { id: true } },
      },
    });
    if (user === null) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const consultantId = user?.consultant?.id;
    try {
      if (consultantId !== undefined && consultantId !== null) {
        const consultant = await prisma.consultant.findUnique({
          where: { id: consultantId },
        });
        if (consultant === null) {
          res.status(404).json({ message: "Consultant not found" });
          return;
        }
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

/**
 * Update specific employment for current consultant
 * @route PUT /consultants/me/employments/{employmentId}
 * @returns updated employment
 */
employmentsRouter.put(
  "/me/employments/:employmentId",
  authenticate,
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
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        roles: { select: { role: true } },
        consultant: { select: { id: true } },
      },
    });
    if (user === null) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const consultantId = user?.consultant?.id;
    try {
      if (consultantId !== undefined && consultantId !== null) {
        const consultant = await prisma.consultant.findUnique({
          where: { id: consultantId },
        });
        if (consultant === null) {
          res.status(404).json({ message: "Consultant not found" });
          return;
        }
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

/**
 * Delete specific employment for current consultant
 * @route PUT /consultants/me/employments/{employmentId}
 * @returns confirmation message
 */
employmentsRouter.delete(
  "/me/employments/:employmentId",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    const parsedParams = EmploymentIdParamsSchema.safeParse(req.params);
    if (!parsedParams.success) {
      res.status(400).json(parsedParams.error);
      return;
    }
    const { employmentId } = parsedParams.data;
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        roles: { select: { role: true } },
        consultant: { select: { id: true } },
      },
    });
    if (user === null) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const consultantId = user?.consultant?.id;
    try {
      if (consultantId !== undefined && consultantId !== null) {
        const consultant = await prisma.consultant.findUnique({
          where: { id: consultantId },
        });
        if (consultant === null) {
          res.status(404).json({ message: "Consultant not found" });
          return;
        }
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

/**
 * Add skill for an employment of current consultant
 * @route POST /consultants/me/employments/{employmentId}/skills
 * @returns created skill
 */
employmentsRouter.post(
  "/me/employments/:employmentId/skills",
  authenticate,
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
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        roles: { select: { role: true } },
        consultant: { select: { id: true } },
      },
    });
    if (user === null) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const consultantId = user?.consultant?.id;
    try {
      if (consultantId !== undefined && consultantId !== null) {
        const consultant = await prisma.consultant.findUnique({
          where: { id: consultantId },
        });
        if (consultant === null) {
          res.status(404).json({ message: "Consultant not found" });
          return;
        }
        const employment = await prisma.employment.findUnique({
          where: { id: employmentId, consultantId: consultantId },
        });
        if (employment === null) {
          res.status(404).json({ message: "Employment not found" });
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

/**
 * Delete a skill for an employment of current consultant
 * @route POST /consultants/me/employments/{employmentId}/skills/{employmentSkillId}
 * @returns confirmation message
 */
employmentsRouter.delete(
  "/me/employments/:employmentId/skills/:employmentSkillId",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    const parsedParams = DeleteEmploymentSkillParamsSchema.safeParse(
      req.params
    );
    if (!parsedParams.success) {
      res.status(400).json(parsedParams.error);
      return;
    }
    const { employmentId, employmentSkillId } = parsedParams.data;
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        roles: { select: { role: true } },
        consultant: { select: { id: true } },
      },
    });
    if (user === null) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const consultantId = user?.consultant?.id;
    try {
      if (consultantId !== undefined && consultantId !== null) {
        const consultant = await prisma.consultant.findUnique({
          where: { id: consultantId },
        });
        if (consultant === null) {
          res.status(404).json({ message: "Consultant not found" });
          return;
        }
        const employment = await prisma.employment.findUnique({
          where: { id: employmentId, consultantId: consultantId },
        });
        if (employment === null) {
          res.status(404).json({ message: "Employment not found" });
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
