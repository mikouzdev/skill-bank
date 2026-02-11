import { Router, type Response } from "express";
import {
  authenticate,
  type AuthenticatedRequest,
} from "../../middlewares/authentication.js";
import { prisma } from "../../db/prismaClient.js";
import { SalesIdParamsSchema } from "../../schemas/sales/sales.schema.js";

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