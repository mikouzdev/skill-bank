import { Router, type Response } from "express";
import {
  authenticate,
  type AuthenticatedRequest,
} from "../../middlewares/authentication.js";
import { prisma } from "../../db/prismaClient.js";
import { SalesIdParamsSchema } from "../../schemas/sales/sales.schema.js";
import { SalesListBodySchema, PutSalesListParamsSchema, SalesListBodyPartialSchema} from "../../schemas/sales/salesLists.schema.js";

export const salesListRouter = Router();

/**
 * Gets all saleslists of a sales user
 * @route GET /{salesId}/lists
 * @returns [sales lists]
 */
salesListRouter.get(
  "/:salesId/lists",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    const parsedParams = SalesIdParamsSchema.safeParse(req.params);
    if (!parsedParams.success) {
      res.status(400).json(parsedParams.error);
      return;
    }
    const { salesId } = parsedParams.data;
    const roles = req.user?.roles ?? [];

    let salesLists = null;

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
          salesLists = await prisma.salesList.findMany({
            where: {
              salespersonId: salesId,
              customerId: customerId,
            },
            include: {
              salesListItems: true,
            },
          });
        }
      } catch (err) {
        res.status(500).json(err);
        return;
      }
    } else {
      try {
        salesLists = await prisma.salesList.findMany({
          where: {
            salespersonId: salesId,
          },
          include: {
            salesListItems: true,
          },
        });
      } catch (err) {
        res.status(500).json(err);
        return;
      }
    }
    res.json(salesLists);
  }
);

/**
 * Add new sales list for a sales user
 * @route POST /{salesId}/lists
 * @returns created list
 */
salesListRouter.post(
  "/:salesId/lists",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    const parsedParams = SalesIdParamsSchema.safeParse(req.params);
    if (!parsedParams.success) {
      res.status(400).json(parsedParams.error);
      return;
    }
    const { salesId } = parsedParams.data;
    const parsedBody = SalesListBodySchema.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json(parsedBody.error);
      return;
    }
    const {
      customerId,
      description,
      shortDescription,
      isReviewDone,
      salesListItems,
    } = parsedBody.data;

    let newSalesList = null;

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
      if (salesListItems !== undefined && salesListItems !== null) {
        await Promise.all(
          salesListItems.map(async (salesListItem) => {
            const consultant = await prisma.consultant.findUnique({
              where: { id: salesListItem.consultantId },
            });
            if (consultant === null) {
              res.status(404).json({ message: "Consultant not found" });
              returnIfTrue = true;
              return;
            }
            if (uniqueConsultants.includes(salesListItem.consultantId)) {
              res.status(409).json({
                message:
                  "Cannot add same consultant twice to the same sales list",
              });
              returnIfTrue = true;
              return;
            } else {
              uniqueConsultants.push(salesListItem.consultantId);
            }
          })
        );
      }
      if (returnIfTrue) {
        return;
      } else {
        newSalesList = await prisma.salesList.create({
          data: {
            salespersonId: salesId,
            customerId: customer.id,
            description,
            shortDescription,
            isReviewDone,
            salesListItems: {
              create: salesListItems.map((salesListItem) => ({
                consultantId: salesListItem.consultantId,
                salesNote: salesListItem.salesNote,
                isAccepted: salesListItem.isAccepted,
                isHidden: salesListItem.isHidden,
              })),
            },
          },
          include: {
            salesListItems: true,
          }
        });
      }
    } catch (err) {
      res.status(500).json(err);
      return;
    }
    res.json(newSalesList);
  }
);

/**
 * Edit list of a sales user
 * @route PUT /{salesId}/lists/{salesListId}
 * @returns edited sales list
 */
salesListRouter.put(
  "/:salesId/lists/:salesListId",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    const parsedParams = PutSalesListParamsSchema.safeParse(req.params);
    if (!parsedParams.success) {
      res.status(400).json(parsedParams.error);
      return;
    }
    const { salesId, salesListId } = parsedParams.data;

    const parsedBody = SalesListBodyPartialSchema.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json(parsedBody.error);
      return;
    }
    const {
      description,
      customerId,
      shortDescription,
      isReviewDone,
      salesListItems
    } = parsedBody.data;

    let salesList = null;

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
      if (salesListItems !== undefined && salesListItems !== null) {
        await Promise.all(
          salesListItems.map(async (salesListItem) => {
            const consultant = await prisma.consultant.findUnique({
              where: { id: salesListItem.consultantId },
            });
            if (consultant === null) {
              res.status(404).json({ message: "Consultant not found" });
              returnIfTrue = true;
              return;
            }
            if (
              salesListItem.consultantId !== undefined &&
              salesListItem.consultantId !== null
            ) {
              const existingSalesListItem =
                await prisma.salesListItem.findFirst({
                  where: {
                    salesListId: salesListId,
                    consultantId: salesListItem.consultantId,
                  },
                });
              if (existingSalesListItem !== null) {
                res
                  .status(409)
                  .json({ message: "Sales list item already exists" });
                returnIfTrue = true;
                return;
              }
            }
            if (uniqueConsultants.includes(salesListItem.consultantId)) {
              res.status(409).json({
                message:
                  "Cannot add same consultant twice to the same sales list",
              });
              returnIfTrue = true;
              return;
            } else {
              uniqueConsultants.push(salesListItem.consultantId);
            }
          })
        );
      }
      if (returnIfTrue) {
        return;
      } else {
        salesList = await prisma.salesList.update({
          where: { id: salesListId, salespersonId: salesId },
          data: {
            ...(isReviewDone !== undefined ? { isReviewDone } : {}),
            ...(description !== undefined ? { description } : {}),
            ...(customerId !== undefined ? { customerId } : {}),
            ...(customerId !== undefined ? { customerId } : {}),
            ...(shortDescription !== undefined ? { shortDescription } : {}),
            ...(salesListItems !== undefined
              ? {
                  salesListItems: {
                    create: salesListItems.map((salesListItem) => ({
                      consultantId: salesListItem.consultantId,
                      isHidden: salesListItem.isHidden,
                      isAccepted: salesListItem.isAccepted,
                      salesNote: salesListItem.salesNote
                    })),
                  },
                }
              : {}),
          },
          include: {
            salesListItems: true,
          },
        });
      }
    } catch (err) {
      res.status(500).json(err);
      return;
    }

    res.json(salesList);
  }
);