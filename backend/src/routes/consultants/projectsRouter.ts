import { Router, type Request, type Response } from "express";
import { ConsultantIdParamsSchema } from "../../schemas/consultants/consultants.schema.js";
import { ProjectIdParamsSchema } from "../../schemas/consultants/projects.schema.js";
import { prisma } from "../../db/prismaClient.js";

export const projectsRouter = Router();

projectsRouter.get(
  "/:consultantId/projects",
  async (req: Request, res: Response) => {
    const parsedParams = ConsultantIdParamsSchema.safeParse(req.params);
    if (!parsedParams.success) {
      res.status(400).json(parsedParams.error);
      return;
    }
    const consultantId = parsedParams.data.consultantId;

    let projects = null;
    try {
      projects = await prisma.project.findMany({
        where: { consultantId: consultantId },
        include: {
          projectLinks: true,
        },
      });
    } catch (err) {
      res.status(500).json(err);
      return;
    }

    res.json(projects);
  }
);

projectsRouter.delete(
  "/me/projects/:projectId",
  async (req: Request, res: Response) => {
    const parsedParams = ProjectIdParamsSchema.safeParse(req.params);
    if (!parsedParams.success) {
      res.status(400).json(parsedParams.error);
      return;
    }
    const { projectId } = parsedParams.data;

    try {
      await prisma.project.delete({
        where: { id: projectId },
      });
    } catch (err) {
      res.status(500).json(err);
      return;
    }

    res.status(204).send();
  }
);
