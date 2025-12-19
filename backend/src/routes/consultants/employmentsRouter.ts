import { Router, type Request, type Response } from "express";
import { ConsultantIdParamsSchema } from "../../schemas/consultants/consultants.schema.js";
import { Visibility } from "../../generated/prisma/enums.js";
import { getEmploymentsForConsultant } from "../../services/employmentService.js";

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
      const allowedVisibilities = [
        Visibility.SALES,
        Visibility.SALES_AND_CONSULTANTS,
      ];
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
