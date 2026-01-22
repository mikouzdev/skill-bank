import { Router, type Request, type Response } from "express";
import {
  UserBodySchema,
} from "../../schemas/admin/admin.schema.js";
import { adminOnly, authenticate } from "../../middlewares/authentication.js";
import { prisma } from "../../db/prismaClient.js";

export const adminRouter = Router();

/**
 * Gets all users in the database
 * @route GET /admin/users
 * @returns [users]
 */
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

/**
 * Add a new user in the database
 * @route POST /admin/users
 * @returns created user
 */
//Add this once it is made functional (checks for user admin role correctly)
//adminOnly,
adminRouter.post("/users", authenticate, async (req: Request, res: Response) => {
  const parsedBody = UserBodySchema.safeParse(req.body);
  
  if (!parsedBody.success) {
    res.status(400).json(parsedBody.error);
    return;
  }
  const {
    name,
    email,
    passwordHash,
    roles,
  } = parsedBody.data;
  try {
    const user = await prisma.user.findFirst({ where: { email: email }});
    if (user !== null) {
      res.status(409).json({ message: "User email already in use" });
      return;
    }
  } catch (err) {
    res.status(500).json(err);
    return;
  }
  let createdUser = null;
  try {
    createdUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        roles:{
          create: roles
        }
      },
    });
  } catch (err) {
    res.status(500).json(err);
    return;
  }

  res.status(201).json(createdUser);
});