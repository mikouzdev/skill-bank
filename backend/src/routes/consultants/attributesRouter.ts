import { Router, type Request, type Response } from "express";
import { ConsultantIdParamsSchema } from "../../schemas/consultants/consultants.schema.js";
import { AttributeBodySchema, AttributeIdParamsSchema } from "../../schemas/consultants/attributes.schema.js";
import { Visibility } from "../../generated/prisma/enums.js";
import { prisma } from "../../db/prismaClient.js";
import { authenticate } from "../../middlewares/authentication.js";

export const attributesRouter = Router();

/**
 * Gets all attributes of a consultant
 * @route GET /{consultantId}/attributes
 * @returns [attributes]
 */
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

/**
 * Add a new attribute for a consultant
 * @route POST /me/attributes
 * @returns new attribute
 */
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
/**
 * Delete an attribute
 * @route DELETE /me/attributes/{attributeId}
 * @returns deleted attribute
 */
attributesRouter.delete(
  "/me/attributes/:attributeId", authenticate,
  async (req: Request, res: Response) => {
    const parsedParams = AttributeIdParamsSchema.safeParse(req.params);
    if (!parsedParams.success) {
      res.status(400).json(parsedParams.error);
      return;
    }
    const { attributeId } = parsedParams.data;
    try {
      await prisma.consultantAttribute.delete({
        where: { id: attributeId },
      });
    } catch (err) {
      res.status(500).json(err);
      return;
    }

    res.status(204).send();
});
/**
 * Update an attribute
 * @route PUT /me/attributes/{attributeId}
 * @returns updated attribute
 */
attributesRouter.put(
  "/me/attributes/:attributeId", authenticate,
  async (req: Request, res: Response) => {
    const parsedParams = AttributeIdParamsSchema.safeParse(req.params);
    if (!parsedParams.success) {
      res.status(400).json(parsedParams.error);
      return;
    }
    const { attributeId } = parsedParams.data;

    const parsedBody = AttributeBodySchema.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json(parsedBody.error);
      return;
    }
    const { value, label, type, visibility } = parsedBody.data;

    let attribute = null;
    try {
      attribute = await prisma.consultantAttribute.update({
        where: { id: attributeId },
        data: {
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