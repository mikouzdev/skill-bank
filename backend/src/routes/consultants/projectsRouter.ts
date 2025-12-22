import { Router, type Request, type Response } from "express";
import { ConsultantIdParamsSchema } from "../../schemas/consultants/consultants.schema.js";
import {
  ProjectIdParamsSchema,
  ProjectBodySchema,
} from "../../schemas/consultants/projects.schema.js";
import { prisma } from "../../db/prismaClient.js";

export const projectsRouter = Router();

projectsRouter.post("/me/projects", async (req: Request, res: Response) => {
  const parsedBody = ProjectBodySchema.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(400).json(parsedBody.error);
    return;
  }
  const { description, name, start, end, visibility } = parsedBody.data;

  // TODO: use consultantId from a JWT token instead of getting the first
  //       entry from the database
  let consultantId;
  try {
    const consultant = await prisma.consultant.findFirst();
    if (consultant === null) {
      res.status(404).json({ message: "No mock data found" });
      return;
    }
    consultantId = consultant.id;
  } catch (err) {
    res.status(500).json(err);
    return;
  }

  let project = null;
  try {
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
  } catch (err) {
    res.status(500).json(err);
    return;
  }

  res.json(project);
});

projectsRouter.get(
  "/:consultantId/projects",
  async (req: Request, res: Response) => {
    const parsedParams = ConsultantIdParamsSchema.safeParse(req.params);
    if (!parsedParams.success) {
      res.status(400).json(parsedParams.error);
      return;
    }
    const { consultantId } = parsedParams.data;

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
