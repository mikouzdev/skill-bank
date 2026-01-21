import { Router, type Request, type Response } from "express";
import { ConsultantIdParamsSchema } from "../../schemas/consultants/consultants.schema.js";
import { Visibility } from "../../generated/prisma/enums.js";
import { prisma } from "../../db/prismaClient.js";

export const pageSectionsRouter = Router();

/**
 * Get a consultant's page sections
 * @route GET /consultants/{consultantId}/sections
 * @returns [sections]
 */
pageSectionsRouter.get(
  "/:consultantId/sections",
  async (req: Request, res: Response) => {
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
    let sections = null;
    try {
      sections = await prisma.pageSection.findMany({
        where: {
          consultantId,
          visibility: {
            in: allowedVisibilities,
          },
        },
        include: {
          comments: true
        },
      });
    } catch (err) {
      res.status(500).json(err);
      return;
    }

    res.json(sections);
});

//TODO: page section endpoints
//GET /consultants/{consultantId}/sections/{sectionName}
//PUT /consultants/me/sections/{sectionName}