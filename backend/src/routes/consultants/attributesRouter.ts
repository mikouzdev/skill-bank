import { Router, type Request, type Response } from "express";
import { ConsultantIdParamsSchema } from "../../schemas/consultants/consultants.schema.js";
import { AttributeBodySchema } from "../../schemas/consultants/attributes.schema.js";
import { Visibility } from "../../generated/prisma/enums.js";
import { prisma } from "../../db/prismaClient.js";
import { authenticate } from "../../middlewares/authentication.js";

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

attributesRouter.post(
  "/me/attributes", authenticate,
  async (req: Request, res: Response) => {
    const parsedBody = AttributeBodySchema.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json(parsedBody.error);
      return;
    }
    const { value, label, type, visibility } = parsedBody.data;

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
    let attribute = null;
    try {
      attribute = await prisma.consultantAttribute.create({
        data: {
          consultantId,
          value,
          label,
          type,
          visibility,
        },
      });
    } catch (err) {
      res.status(500).json(err);
      return;
    }

    res.json(attribute);
});


//TODO: attributes endpoints
//PUT /consultants/me/attributes/{attributeId}
//DELETE /consultants/me/attributes/{attributeId}