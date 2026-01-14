import { Router, type Request, type Response } from "express";
import { ConsultantIdParamsSchema } from "../../schemas/consultants/consultants.schema.js";
import { Visibility } from "../../generated/prisma/enums.js";
import {
  createEmploymentForConsultant,
  getEmploymentsForConsultant,
} from "../../services/employmentService.js";
import { EmploymentCreateSchema } from "../../schemas/consultants/employment.schema.js";
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
      // Visibility for now, auth based later
      //Sales/admin can see everyone, consult gets only public
      //Visibility.LIMITED
      const allowedVisibilities = [Visibility.PUBLIC];
      const employments = await getEmploymentsForConsultant(
        consultantId,
        allowedVisibilities
      );

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
    try {
      const parsedBody = EmploymentCreateSchema.safeParse(req.body);
      if (!parsedBody.success) {
        res.status(400).json(parsedBody.error);
        return;
      }
      const userId = 1; // Hard coded now to match the seed, waiting for auth middleware implementation
      const consultant = await prisma.consultant.findUnique({
        where: { userId },
      });

      if (!consultant) {
        res.status(404).json({ message: "Consultant profile not found" });
        return;
      }

      const createdEmployment = await createEmploymentForConsultant(
        consultant.id,
        parsedBody.data
      );
      res.status(201).json(createdEmployment);
    } catch (error) {
      console.error("Failed at: POST /consultants/me/employment");
    }
  }
);
