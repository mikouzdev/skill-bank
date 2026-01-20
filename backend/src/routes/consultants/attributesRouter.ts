import { Router, type Request, type Response } from "express";
import { ConsultantIdParamsSchema } from "../../schemas/consultants/consultants.schema.js";
import { Visibility } from "../../generated/prisma/enums.js";
import { prisma } from "../../db/prismaClient.js";

export const attributesRouter = Router();

attributesRouter.get(
  "/:consultantId/attributes",
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
      sections = await prisma.consultantAttribute.findMany({
        where: {
          consultantId,
          visibility: {
            in: allowedVisibilities,
          },
        },
      });
    } catch (err) {
      res.status(500).json(err);
      return;
    }

    res.json(sections);
});


//TODO: attributes endpoints
//POST /consultants/me/attributes
//PUT /consultants/me/attributes/{attributeId}
//DELETE /consultants/me/attributes/{attributeId}