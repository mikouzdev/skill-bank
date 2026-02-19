import { Router, type Response } from "express";
import {
  authenticate,
  type AuthenticatedRequest,
} from "../../middlewares/authentication.js";
import { prisma } from "../../db/prismaClient.js";
import { SalesIdParamsSchema } from "../../schemas/sales/sales.schema.js";
import {
  OfferPageBodySchema,
  PutOfferPageParamsSchema,
  OfferPageBodyPartialSchema,
  PatchConsultantPageParamsSchema,
  PatchConsultantPageBodySchema,
} from "../../schemas/sales/offers.schema.js";

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
      const uniqueConsultants: number[] = [];
      let returnIfTrue = false;
      if (consultantPages !== undefined && consultantPages !== null) {
        await Promise.all(
          consultantPages.map(async (consultantPage) => {
            const consultant = await prisma.consultant.findUnique({
              where: { id: consultantPage.consultantId },
            });
            if (consultant === null) {
              res.status(404).json({ message: "Consultant not found" });
              returnIfTrue = true;
              return;
            }
            if (uniqueConsultants.includes(consultantPage.consultantId)) {
              res.status(409).json({
                message:
                  "Cannot add same consultant twice to the same offer page",
              });
              returnIfTrue = true;
              return;
            } else {
              uniqueConsultants.push(consultantPage.consultantId);
            }
          })
        );
      }
      if (returnIfTrue) {
        return;
      } else {
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
                isAccepted: consultantPage.isAccepted,
              })),
            },
          },
          omit: {
            passwordHash: true,
          },
          include: {
            consultantPages: true,
          }
        });
      }
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
    const {
      name,
      description,
      shortDescription,
      passwordHash,
      customerId,
      consultantPages,
    } = parsedBody.data;

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
      const uniqueConsultants: number[] = [];
      let returnIfTrue = false;
      if (consultantPages !== undefined && consultantPages !== null) {
        await Promise.all(
          consultantPages.map(async (consultantPage) => {
            const consultant = await prisma.consultant.findUnique({
              where: { id: consultantPage.consultantId },
            });
            if (consultant === null) {
              res.status(404).json({ message: "Consultant not found" });
              returnIfTrue = true;
              return;
            }
            if (
              consultantPage.consultantId !== undefined &&
              consultantPage.consultantId !== null
            ) {
              const existingConsultantPage =
                await prisma.consultantPages.findFirst({
                  where: {
                    offerPageId: offerPageId,
                    consultantId: consultantPage.consultantId,
                  },
                });
              if (existingConsultantPage !== null) {
                res
                  .status(409)
                  .json({ message: "Consultant page already exists" });
                returnIfTrue = true;
                return;
              }
            }
            if (uniqueConsultants.includes(consultantPage.consultantId)) {
              res.status(409).json({
                message:
                  "Cannot add same consultant twice to the same offer page",
              });
              returnIfTrue = true;
              return;
            } else {
              uniqueConsultants.push(consultantPage.consultantId);
            }
          })
        );
      }
      if (returnIfTrue) {
        return;
      } else {
        offerPage = await prisma.offerPages.update({
          where: { id: offerPageId, salespersonId: salesId },
          data: {
            ...(name !== undefined ? { name } : {}),
            ...(description !== undefined ? { description } : {}),
            ...(customerId !== undefined ? { customerId } : {}),
            ...(passwordHash !== undefined ? { passwordHash } : {}),
            ...(shortDescription !== undefined ? { shortDescription } : {}),
            ...(consultantPages !== undefined
              ? {
                  consultantPages: {
                    create: consultantPages.map((consultantPage) => ({
                      consultantId: consultantPage.consultantId,
                      ...(consultantPage.isAccepted !== undefined ? { isAccepted: consultantPage.isAccepted } : { isAccepted: false }),
                      ...(consultantPage.showInfo !== undefined ? { showInfo: consultantPage.showInfo } : { showInfo: true }),
                      ...(consultantPage.customerReview !== undefined ? { customerReview: consultantPage.customerReview } : {}),
                    })),
                  },
                }
              : {}),
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

    res.json(offerPage);
  }
);

/**
 * Delete an offer page of a sales user
 * @route DELETE /{salesId}/offers/{offerPageId}
 * @returns confirmation message
 */
offersRouter.delete(
  "/:salesId/offers/:offerPageId",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    const parsedParams = PutOfferPageParamsSchema.safeParse(req.params);
    if (!parsedParams.success) {
      res.status(400).json(parsedParams.error);
      return;
    }
    const { salesId, offerPageId } = parsedParams.data;

    try {
      await prisma.offerPages.delete({
        where: {
          salespersonId: salesId,
          id: offerPageId,
        },
      });
      res.status(204).json();
      return;
    } catch (err) {
      res.status(500).json(err);
      return;
    }
  }
);

/**
 * Update isAccepted status and review of a consultant page
 * @route PATCH /{salesId}/offers/{offerPageId}/consultants/{consultantPageId}
 * @returns updated consultant page
 */
offersRouter.patch(
  "/:salesId/offers/:offerPageId/consultants/:consultantPageId",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    const parsedParams = PatchConsultantPageParamsSchema.safeParse(req.params);
    if (!parsedParams.success) {
      res.status(400).json(parsedParams.error);
      return;
    }
    const { salesId, offerPageId, consultantPageId } = parsedParams.data;

    const parsedBody = PatchConsultantPageBodySchema.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json(parsedBody.error);
      return;
    }
    const { isAccepted, customerReview } = parsedBody.data;

    // validate that user is customer
    if (!req.user?.roles.includes("CUSTOMER")) {
      res.status(401).json("Unauthorized");
      return;
    }

    // find user from db
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        roles: { select: { role: true } },
        customer: { select: { id: true } },
      },
    });

    // validate that user exists
    if (user === null) {
      res.status(404).json("User not found");
      return;
    }

    try {
      const offerPage = await prisma.offerPages.findUnique({
        where: { id: offerPageId, salespersonId: salesId },
      });

      if (offerPage === null) {
        res.status(404).json({ message: "Offer page not found" });
        return;
      }

      // allow to change only own offer
      if (offerPage.customerId !== user.customer?.id) {
        res.status(403).json("Forbidden");
      }

      const consultantPage = await prisma.consultantPages.findFirst({
        where: { id: consultantPageId, offerPageId: offerPageId },
      });

      if (consultantPage === null) {
        res.status(404).json({ message: "Consultant page not found" });
        return;
      }

      const updatedConsultantPage = await prisma.consultantPages.update({
        where: { id: consultantPageId },
        data: { isAccepted, ...(customerReview !== undefined ? { customerReview } : {}),},
      });

      res.json(updatedConsultantPage);
    } catch (err) {
      res.status(500).json(err);
      return;
    }
  }
);
