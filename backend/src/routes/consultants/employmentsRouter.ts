import { Router, type Request, type Response } from "express";
import { ConsultantIdParamsSchema } from "../../schemas/consultants/consultants.schema.js";

export const employmentsRouter = Router();

employmentsRouter.get(
  "/:consultantId/employments",
  (req: Request, res: Response) => {
    try {
      const parsedParams = ConsultantIdParamsSchema.safeParse(req.params);
      if (!parsedParams.success) {
        res.status(400).json(parsedParams.error);
        return;
      }

      const { consultantId } = parsedParams.data;

      // Fetch employments with consultantId, filter by visibility, sort, now just dummy data

      res.status(200).json([
        {
          id: 1,
          employer: "Oy Firma Ab",
          jobTitle: "Fullstack Developer",
          description: "A bit of this and a bit of that",
          start: "2020-03-01",
          end: "2021-06-20",
          skills: [
            { name: "react", category: "frontend" },
            { name: "nodejs", category: "backend" },
            { name: "postgresql", category: "database" },
          ],
        },
        {
          id: 2,
          employer: "Oy Pulju Ab",
          jobTitle: "Software Consultant",
          description: "Waving hands in a dynamic environment",
          start: "2021-07-01",
          end: null,
          skills: [
            { name: "typescript", category: "language" },
            { name: "express", category: "backend" },
          ],
        },
      ]);
    } catch (error) {
      //TODO, error handler middleware
      console.error("Failed at GET /:consultantId/employments", error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }
);
