import { Router, type Request, type Response } from "express";
import { ConsultantIdParamsSchema } from "../../schemas/consultants/consultants.schema.js";
import {
  EmploymentBodySchema,
  EmploymentIdParamsSchema,
} from "../../schemas/consultants/employment.schema.js";
import { prisma } from "../../db/prismaClient.js";

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

      const employments = await prisma.employment.findMany({
        where: { consultantId },
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
  "/me/employments",
  async (req: Request, res: Response) => {
    console.log("Found consultant");

    const parsedBody = EmploymentBodySchema.safeParse(req.body);

    if (!parsedBody.success) {
      res.status(400).json(parsedBody.error);
      return;
    }
    const { description, jobTitle, start, end, visibility, employer } =
      parsedBody.data;

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

    let createdEmployment = null;
    try {
      createdEmployment = await prisma.employment.create({
        data: {
          consultantId,
          employer,
          description,
          jobTitle,
          start,
          ...(end !== undefined ? { end } : {}),
          visibility,
        },
      });
    } catch (err) {
      res.status(500).json(err);
      return;
    }

    res.status(201).json(createdEmployment);
  }
);

employmentsRouter.put(
  "/me/employments/:employmentId",
  async (req: Request, res: Response) => {
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
    const { description, jobTitle, start, end, visibility, employer } =
      parsedBody.data;

    let employment = null;
    try {
      employment = await prisma.employment.update({
        where: { id: employmentId },
        data: {
          description,
          employer,
          jobTitle,
          start,
          ...(end !== undefined ? { end } : {}),
          visibility,
        },
      });
    } catch (err) {
      res.status(500).json(err);
      return;
    }

    res.json(employment);
  }
);
