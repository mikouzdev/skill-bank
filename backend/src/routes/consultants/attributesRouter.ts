import { Router, type Response } from "express";
import { ConsultantIdParamsSchema } from "../../schemas/consultants/consultants.schema.js";
import {
  AttributeBodySchema,
  AttributeIdParamsSchema,
} from "../../schemas/consultants/attributes.schema.js";
import { Visibility } from "../../generated/prisma/enums.js";
import { prisma } from "../../db/prismaClient.js";
import {
  authenticate,
  type AuthenticatedRequest,
} from "../../middlewares/authentication.js";

export const attributesRouter = Router();

/**
 * Gets all attributes of a consultant
 * @route GET /{consultantId}/attributes
 * @returns [attributes]
 */
attributesRouter.get(
  "/:consultantId/attributes",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    const parsedParams = ConsultantIdParamsSchema.safeParse(req.params);
    if (!parsedParams.success) {
      res.status(400).json(parsedParams.error);
      return;
    }
    const { consultantId } = parsedParams.data;
    const roles = req.user?.roles ?? [];
    let allowedVisibilities = [Visibility.PUBLIC, Visibility.LIMITED];
    //Sales/admin can see everyone, consult gets only public
    if (!roles?.includes("ADMIN") && !roles?.includes("SALESPERSON")) {
      allowedVisibilities = [Visibility.PUBLIC];
    }
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
  }
);

/**
 * Add a new attribute for a consultant
 * @route POST /me/attributes
 * @returns new attribute
 */
attributesRouter.post(
  "/me/attributes",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    const parsedBody = AttributeBodySchema.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json(parsedBody.error);
      return;
    }
    const { value, label, type, visibility } = parsedBody.data;

    let attribute = null;
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        roles: { select: { role: true } },
        consultant: { select: { id: true } },
      },
    });
    if (user === null) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const consultantId = user?.consultant?.id;
    try {
      if (consultantId !== undefined && consultantId !== null) {
        const consultant = await prisma.consultant.findUnique({
          where: { id: consultantId },
        });
        if (consultant === null) {
          res.status(404).json({ message: "Consultant not found" });
          return;
        }
        attribute = await prisma.consultantAttribute.create({
          data: {
            consultantId,
            value,
            label,
            type,
            visibility,
          },
        });
      }
    } catch (err) {
      res.status(500).json(err);
      return;
    }

    res.json(attribute);
  }
);
/**
 * Delete an attribute
 * @route DELETE /me/attributes/{attributeId}
 * @returns deleted attribute
 */
attributesRouter.delete(
  "/me/attributes/:attributeId",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    const parsedParams = AttributeIdParamsSchema.safeParse(req.params);
    if (!parsedParams.success) {
      res.status(400).json(parsedParams.error);
      return;
    }
    const { attributeId } = parsedParams.data;
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        roles: { select: { role: true } },
        consultant: { select: { id: true } },
      },
    });
    if (user === null) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const consultantId = user?.consultant?.id;
    try {
      if (consultantId !== undefined && consultantId !== null) {
        const consultant = await prisma.consultant.findUnique({
          where: { id: consultantId },
        });
        if (consultant === null) {
          res.status(404).json({ message: "Consultant not found" });
          return;
        }
        await prisma.consultantAttribute.delete({
          where: { id: attributeId, consultantId: consultantId },
        });
      }
    } catch (err) {
      res.status(500).json(err);
      return;
    }

    res.status(204).send();
  }
);
/**
 * Update an attribute
 * @route PUT /me/attributes/{attributeId}
 * @returns updated attribute
 */
attributesRouter.put(
  "/me/attributes/:attributeId",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
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
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        roles: { select: { role: true } },
        consultant: { select: { id: true } },
      },
    });
    if (user === null) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const consultantId = user?.consultant?.id;
    try {
      if (consultantId !== undefined && consultantId !== null) {
        const consultant = await prisma.consultant.findUnique({
          where: { id: consultantId },
        });
        if (consultant === null) {
          res.status(404).json({ message: "Consultant not found" });
          return;
        }
        attribute = await prisma.consultantAttribute.update({
          where: { id: attributeId, consultantId: consultantId },
          data: {
            value,
            label,
            type,
            visibility,
          },
        });
      }
    } catch (err) {
      res.status(500).json(err);
      return;
    }

    res.json(attribute);
  }
);
