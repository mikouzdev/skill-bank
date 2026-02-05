import { Router, type Request, type Response } from "express";
import { authenticate, type AuthenticatedRequest } from "../../middlewares/authentication.js";
import { prisma } from "../../db/prismaClient.js";
import { SalesIdParamsSchema } from "../../schemas/sales/sales.schema.js";

export const offersRouter = Router();

/**
 * Gets all offer pages of a sales user
 * @route GET /{salesId}/offers
 * @returns [offer pages]
 */
offersRouter.get(
  "/:salesId/offers", authenticate,
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
    if(roles?.includes("CUSTOMER")) {
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
            if(customerId !== undefined && customerId !== null){
                const customer = await prisma.customer.findUnique({
                    where: { id: customerId }
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
                    omit: {
                        passwordHash: true,
                    },
                });
            }
        } catch (err) {
            res.status(500).json(err);
            return;
        }
    }
    else {
         try {
            offerPages = await prisma.offerPages.findMany({
                where: {
                    salespersonId: salesId,
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
});