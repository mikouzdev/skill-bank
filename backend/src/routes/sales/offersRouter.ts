import { Router, type Response } from "express";
import {
  authenticate,
  type AuthenticatedRequest,
} from "../../middlewares/authentication.js";
import { prisma } from "../../db/prismaClient.js";
import { SalesIdParamsSchema } from "../../schemas/sales/sales.schema.js";
import { OfferPageBodySchema, PutOfferPageParamsSchema, OfferPageBodyPartialSchema } from "../../schemas/sales/offers.schema.js";

export const offersRouter = Router();

/**
 * Gets all offer pages of a sales user
 * @route GET /{salesId}/offers
 * @returns [offer pages]
 */
offersRouter.get(
  "/:salesId/offers",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    const parsedParams = SalesIdParamsSchema.safeParse(req.params);
    if (!parsedParams.success) {
      res.status(400).json(parsedParams.error);
      return;
    }
    const { salesId } = parsedParams.data;
    const roles = req.user?.roles ?? [];

    let offerPages = null;

    //Customer should only get their own offers
    if (roles?.includes("CUSTOMER")) {
      const user = await prisma.user.findUnique({
        where: { id: req.user!.id },
        select: {
          id: true,
          roles: { select: { role: true } },
          customer: { select: { id: true } },
        },
      });
      if (user === null) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      const customerId = user?.customer?.id;
      try {
        if (customerId !== undefined && customerId !== null) {
          const customer = await prisma.customer.findUnique({
            where: { id: customerId },
          });
          if (customer === null) {
            res.status(404).json({ message: "Customer not found" });
            return;
          }
          offerPages = await prisma.offerPages.findMany({
            where: {
              salespersonId: salesId,
              customerId: customerId,
            },
            include: {
              consultantPages: true,
            },
            omit: {
              passwordHash: true,
            },
          });
        }
      } catch (err) {
        res.status(500).json(err);
        return;
      }
    } else {
      try {
        offerPages = await prisma.offerPages.findMany({
          where: {
            salespersonId: salesId,
          },
          include: {
            consultantPages: true,
          },
          omit: {
            passwordHash: true,
          },
        });
      } catch (err) {
        res.status(500).json(err);
        return;
      }
    }
    res.json(offerPages);
  }
);

/**
 * Add new offer page for a sales user
 * @route POST /{salesId}/offers
 * @returns created offer page
 */
offersRouter.post(
  "/:salesId/offers",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    const parsedParams = SalesIdParamsSchema.safeParse(req.params);
    if (!parsedParams.success) {
      res.status(400).json(parsedParams.error);
      return;
    }
    const { salesId } = parsedParams.data;
    const parsedBody = OfferPageBodySchema.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json(parsedBody.error);
      return;
    }
    const {
      customerId,
      description,
      name,
      shortDescription,
      consultantPages,
      passwordHash,
    } = parsedBody.data;

    let newOfferPage = null;

    try {
      const customer = await prisma.customer.findUnique({
        where: { id: customerId },
      });
      if (customer === null) {
        res.status(404).json({ message: "Customer not found" });
        return;
      }
      newOfferPage = await prisma.offerPages.create({
        data: {
          salespersonId: salesId,
          customerId: customer.id,
          description,
          name,
          shortDescription,
          passwordHash,
          consultantPages: {
            create: consultantPages.map((consultantPage) => ({
              consultantId: consultantPage.consultantId,
              showInfo: consultantPage.showInfo,
            })),
          },
        },
        omit: {
          passwordHash: true,
        },
      });
    } catch (err) {
      res.status(500).json(err);
      return;
    }
    res.json(newOfferPage);
  }
);

/**
 * Edit offer page of a sales user
 * @route PUT /{salesId}/offers/{offerPageId}
 * @returns edited offer page
 */
offersRouter.put(
  "/:salesId/offers/:offerPageId",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    const parsedParams = PutOfferPageParamsSchema.safeParse(req.params);
    if (!parsedParams.success) {
      res.status(400).json(parsedParams.error);
      return;
    }
    const { salesId, offerPageId } = parsedParams.data;

    const parsedBody = OfferPageBodyPartialSchema.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json(parsedBody.error);
      return;
    }
    const { name, description, shortDescription, passwordHash, customerId, consultantPages  } = parsedBody.data;

    let offerPage = null;

    try {
      if (customerId !== undefined && customerId !== null) {
        const customer = await prisma.customer.findUnique({
          where: { id: customerId },
        });
        if (customer === null) {
          res.status(404).json({ message: "Customer not found" });
          return;
        }
      }
      if (consultantPages !== undefined && consultantPages !== null) {
        await Promise.all(
          consultantPages.map(async (consultantPage) => {
            const consultant = await prisma.consultant.findUnique({
              where: { id: consultantPage.consultantId },
            });
            if (consultant === null) {
              res.status(404).json({ message: "Consultant not found" });
              return;
            }
          }))
      }
      offerPage = await prisma.offerPages.update({
        where: { id: offerPageId, salespersonId: salesId },
        data: {
          ...(name !== undefined ? { name } : {}),
          ...(description !== undefined ? { description } : {}),
          ...(customerId !== undefined ? { customerId } : {}),
          ...(passwordHash !== undefined ? { passwordHash } : {}),
          ...(shortDescription !== undefined ? { shortDescription } : {}),
          ...(consultantPages !== undefined ? { consultantPages: {
            create: consultantPages.map((consultantPage) => ({
              consultantId: consultantPage.consultantId,
              showInfo: consultantPage.showInfo,
            })),
          }, } : {}),
        },
        include: {
          consultantPages: true,
        },
        omit: {
          passwordHash: true,
        },
      });
    } catch (err) {
      res.status(500).json(err);
      return;
    }

    res.json(offerPage);
});
