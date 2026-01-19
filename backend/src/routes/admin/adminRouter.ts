import { Router, type Request, type Response } from "express";
import { adminOnly, authenticate } from "../../middlewares/authentication.js";
import { prisma } from "../../db/prismaClient.js";

export const adminRouter = Router();

//Add this once it is made functional (checks for user admin role correctly)
//adminOnly,
adminRouter.get("/users", authenticate, async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
        omit: {
            passwordHash: true,
            id: true
        }});
    res.send(users);
    return;
  } catch (err) {
    res.status(500).json(err);
    return;
  }
});