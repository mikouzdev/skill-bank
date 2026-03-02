import { Router, type Response } from "express";
import { ConsultantIdParamsSchema } from "../../schemas/consultants/consultants.schema.js";
import {
  ProjectIdParamsSchema,
  ProjectBodySchema,
  PostProjectLinkBodySchema,
  DeleteProjectLinkParamsSchema,
  DeleteProjectSkillParamsSchema,
  PostProjectSkillBodySchema,
  ProjectBodyPartialSchema
} from "../../schemas/consultants/projects.schema.js";
import { Visibility } from "../../generated/prisma/enums.js";
import { prisma } from "../../db/prismaClient.js";
import {
  authenticate,
  type AuthenticatedRequest,
} from "../../middlewares/authentication.js";

export const projectsRouter = Router();

/**
 * Add a project for current consultant
 * @route POST /consultants/me/projects
 * @returns created project
 */
projectsRouter.post(
  "/me/projects",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    const parsedBody = ProjectBodySchema.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json(parsedBody.error);
      return;
    }
    const { description, name, start, end, visibility } = parsedBody.data;

    let project = null;
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
        project = await prisma.project.create({
          data: {
            consultantId,
            description,
            name,
            start,
            ...(end !== undefined ? { end } : {}),
            visibility,
          },
        });
      }
    } catch (err) {
      res.status(500).json(err);
      return;
    }
    res.status(201).json(project);
  }
);

/**
 * Get all projects from a consultant
 * @route GET /consultants/{consultantId}/projects
 * @returns [projects]
 */
projectsRouter.get(
  "/:consultantId/projects",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    const parsedParams = ConsultantIdParamsSchema.safeParse(req.params);
    if (!parsedParams.success) {
      res.status(400).json(parsedParams.error);
      return;
    }
    const { consultantId } = parsedParams.data;
    const roles = req.user?.roles ?? [];
    let isSameConsultant = false;
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        roles: { select: { role: true } },
        consultant: { select: { id: true } },
      },
    });
    const consultantIdOfCurrentUser = user?.consultant?.id;
    if (consultantIdOfCurrentUser !== undefined && consultantIdOfCurrentUser !== null && consultantIdOfCurrentUser === consultantId) {
      isSameConsultant = true;
    }
    let allowedVisibilities = [Visibility.PUBLIC, Visibility.LIMITED];
    //Sales/admin can see everyone, consult gets only public UNLESS the consultant ID is same as current user's consultant ID
    if (!roles?.includes("ADMIN") && !roles?.includes("SALESPERSON") && isSameConsultant === false) {
      allowedVisibilities = [Visibility.PUBLIC];
    }
    let projects = null;
    try {
      projects = await prisma.project.findMany({
        where: {
          consultantId,
          visibility: {
            in: allowedVisibilities,
          },
        },
        include: {
          projectLinks: true,
          projectSkills: true,
        },
      });
    } catch (err) {
      res.status(500).json(err);
      return;
    }

    res.json(projects);
  }
);

/**
 * Update a project for current consultant
 * @route PUT /consultants/me/projects/{projectId}
 * @returns updated project
 */
projectsRouter.put(
  "/me/projects/:projectId",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    const parsedParams = ProjectIdParamsSchema.safeParse(req.params);
    if (!parsedParams.success) {
      res.status(400).json(parsedParams.error);
      return;
    }
    const { projectId } = parsedParams.data;

    const parsedBody = ProjectBodyPartialSchema.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json(parsedBody.error);
      return;
    }
    const { description, name, start, end, visibility, projectSkills } =
      parsedBody.data;

    let project = null;
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
        project = await prisma.project.update({
          where: { id: projectId, consultantId: consultantId },
          data: {
            ...(description !== undefined ? { description } : {}),
            ...(name !== undefined ? { name } : {}),
            ...(start !== undefined ? { start } : {}),
            ...(end !== undefined ? { end } : {}),
            ...(visibility !== undefined ? { visibility } : {}),
            ...(projectSkills !== undefined ? {  projectSkills: {
              deleteMany: {}, // delete skills of the project
              // create incoming skills, ( it errors if the skill doesnt exist in SkillTag )
              create: projectSkills.map((skill) => ({
                skillTagName: skill.skillTagName,
              })),
            } } : {}),
          },
        });
      }
    } catch (err) {
      res.status(500).json(err);
      return;
    }

    res.json(project);
  }
);

/**
 * Delete a project for current consultant
 * @route DELETE /consultants/me/projects/{projectId}
 * @returns confirmation message
 */
projectsRouter.delete(
  "/me/projects/:projectId",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    const parsedParams = ProjectIdParamsSchema.safeParse(req.params);
    if (!parsedParams.success) {
      res.status(400).json(parsedParams.error);
      return;
    }
    const { projectId } = parsedParams.data;
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
        await prisma.project.delete({
          where: { id: projectId, consultantId: consultantId },
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
 * Add a link for a project for current consultant
 * @route POST /consultants/me/projects/{projectId}/links
 * @returns created project link
 */
projectsRouter.post(
  "/me/projects/:projectId/links",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    const parsedParams = ProjectIdParamsSchema.safeParse(req.params);
    const parsedBody = PostProjectLinkBodySchema.safeParse(req.body);

    if (!parsedParams.success) {
      res.status(400).json(parsedParams.error);
      return;
    }
    if (!parsedBody.success) {
      res.status(400).json(parsedBody.error);
      return;
    }

    const { projectId } = parsedParams.data;
    const { url, label } = parsedBody.data;

    let projectLink = null;
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
        const project = await prisma.project.findUnique({
          where: { id: projectId, consultantId: consultantId },
        });
        if (project === null) {
          res.status(404).json({ message: "Project not found" });
          return;
        }
        projectLink = await prisma.projectLink.create({
          data: {
            projectId,
            url,
            label,
          },
        });
      }
    } catch (err) {
      res.status(500).json(err);
      return;
    }
    res.status(201).json(projectLink);
  }
);

/**
 * Delete a link for a project for current consultant
 * @route DELETE /consultants/me/projects/{projectId}/links/{linkId}
 * @returns confirmation message
 */
projectsRouter.delete(
  "/me/projects/:projectId/links/:linkId",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    const parsedParams = DeleteProjectLinkParamsSchema.safeParse(req.params);
    if (!parsedParams.success) {
      res.status(400).json(parsedParams.error);
      return;
    }
    const { projectId, linkId } = parsedParams.data;
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
        const project = await prisma.project.findUnique({
          where: { id: projectId, consultantId: consultantId },
        });
        if (project === null) {
          res.status(404).json({ message: "Project not found" });
          return;
        }
        await prisma.projectLink.delete({
          where: { id: linkId, projectId },
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
 * Add a skill for a project for current consultant
 * @route POST /consultants/me/projects/{projectId}/skills
 * @returns created project skill
 */
projectsRouter.post(
  "/me/projects/:projectId/skills",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    const parsedParams = ProjectIdParamsSchema.safeParse(req.params);
    const parsedBody = PostProjectSkillBodySchema.safeParse(req.body);

    if (!parsedParams.success) {
      res.status(400).json(parsedParams.error);
      return;
    }
    if (!parsedBody.success) {
      res.status(400).json(parsedBody.error);
      return;
    }

    const { projectId } = parsedParams.data;
    const { skillTagName } = parsedBody.data;

    let projectSkill = null;
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
        const project = await prisma.project.findUnique({
          where: { id: projectId, consultantId: consultantId },
        });
        if (project === null) {
          res.status(404).json({ message: "Project not found" });
          return;
        }
        projectSkill = await prisma.projectSkill.create({
          data: {
            project: {
              connect: { id: projectId },
            },
            skillTag: {
              connectOrCreate: {
                where: { name: skillTagName },
                create: { name: skillTagName },
              },
            },
          },
        });
      }
    } catch (err) {
      res.status(500).json(err);
      return;
    }
    res.status(201).json(projectSkill);
  }
);

/**
 * Delete a project skill from current consultant
 * @route DELETE /consultants/me/projects/{projectId}/skills/{projectSkillId}
 * @returns confirmation message
 */
projectsRouter.delete(
  "/me/projects/:projectId/skills/:projectSkillId",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    const parsedParams = DeleteProjectSkillParamsSchema.safeParse(req.params);
    if (!parsedParams.success) {
      res.status(400).json(parsedParams.error);
      return;
    }
    const { projectId, projectSkillId } = parsedParams.data;
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
        const project = await prisma.project.findUnique({
          where: { id: projectId, consultantId: consultantId },
        });
        if (project === null) {
          res.status(404).json({ message: "Project not found" });
          return;
        }
        await prisma.projectSkill.delete({
          where: { id: projectSkillId, projectId },
        });
      }
    } catch (err) {
      res.status(500).json(err);
      return;
    }

    res.status(204).send();
  }
);
