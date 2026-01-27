import { Router, type Request, type Response } from "express";
import {
  UserBodySchema,
  UserIdParamsSchema,
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
            passwordHash: true
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
//adminOnly
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
  let createdConsultant = null;
  let createdSalesPerson = null;
  let createdCustomer = null;
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
    let userId = createdUser.id;
    roles.forEach(async role => {
      switch (role.role) {
        case "CONSULTANT":
          createdConsultant = await prisma.consultant.create({
            data: {
              userId: userId,
              description: "",
              roleTitle: "",
              profilePictureUrl: "",
              consultantAttributes: {
                create: [],
              },
            },
          });
          break;
        case "SALESPERSON":
          createdSalesPerson = await prisma.salesperson.create({
            data: {
              userId: userId,
              salesLists: {
                create: [],
              },
            },
          });
          break;
        case "CUSTOMER":
          createdCustomer = await prisma.customer.create({
            data: {
              userId: userId,
              salesLists: {
                create: [],
              },
            },
          });
          break;
      }
    });
  } catch (err) {
    res.status(500).json(err);
    return;
  }

  res.status(201).json(createdUser);
});

/**
 * Delete a user in the database
 * @route DELETE /admin/users/{userId}
 * @returns 
 */
//Add this once it is made functional (checks for user admin role correctly)
//adminOnly,
adminRouter.delete("/users/:userId", authenticate, async (req: Request, res: Response) => {
  const parsedParams = UserIdParamsSchema.safeParse(req.params);
  if (!parsedParams.success) {
    res.status(400).json(parsedParams.error);
    return;
  }
  const { userId } = parsedParams.data;
  try {
      await prisma.user.delete({
        where: { id: userId },
      });
    } catch (err) {
      res.status(500).json(err);
      return;
    }

    res.status(204).send();
});

/**
 * Update a user in the database
 * @route PUT /admin/users/{userId}
 * @returns updated user
 */
//Add this once it is made functional (checks for user admin role correctly)
//adminOnly,
adminRouter.put("/users/:userId", authenticate, async (req: Request, res: Response) => {
  const parsedParams = UserIdParamsSchema.safeParse(req.params);


  if (!parsedParams.success) {
    res.status(400).json(parsedParams.error);
    return;
  }
  const { userId } = parsedParams.data;

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

  let user = null;

  try {
    user = await prisma.user.update({
      where: { id: userId },
      data: {
        email,
        name,
        passwordHash,
        roles: {
          deleteMany: {},
          create: roles
        },
      },
    });
  } catch (err) {
    res.status(500).json(err);
    return;
  }

  res.json(user);
});