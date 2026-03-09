import { Router, type Request, type Response } from "express";
import {
  UserBodySchema,
  UserIdParamsSchema,
  UserBodyPartialSchema,
} from "../../schemas/admin/admin.schema.js";
import { adminOnly, authenticate } from "../../middlewares/authentication.js";
import { prisma } from "../../db/prismaClient.js";
import argon2 from "argon2";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

export const adminRouter = Router();

/**
 * Gets all users in the database
 * @route GET /admin/users
 * @returns [users]
 */
adminRouter.get(
  "/users",
  authenticate,
  adminOnly,
  async (req: Request, res: Response) => {
    try {
      const users = await prisma.user.findMany({
        include: {
          roles: {},
        },
        omit: {
          passwordHash: true,
        },
      });
      res.send(users);
      return;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === "P1000") {
          return res
            .status(503)
            .json({ error: "Database authentication failed" });
        }
        if (err.code === "P1001") {
          return res.status(503).json({ error: "Database server unreachable" });
        }

        return res
          .status(503)
          .json({ error: "Database initialization/connection failed" });
      }
      res.status(500).json(err);
      return;
    }
  }
);

/**
 * Add a new user in the database
 * @route POST /admin/users
 * @returns created user
 */
adminRouter.post(
  "/users",
  authenticate,
  adminOnly,
  async (req: Request, res: Response) => {
    const parsedBody = UserBodySchema.safeParse(req.body);

    if (!parsedBody.success) {
      res.status(400).json(parsedBody.error);
      return;
    }
    const { name, email, password, roles } = parsedBody.data;

    const lowerCaseEmail = email.toLowerCase();

    const passwordHash = await argon2.hash(password);

    try {
      const user = await prisma.user.findFirst({
        where: { email: lowerCaseEmail },
      });
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
          email: lowerCaseEmail,
          passwordHash: passwordHash,
          roles: {
            create: roles,
          },
        },
        include: {
          roles: true,
        },
        omit: {
          passwordHash: true,
        },
      });

      const userId = createdUser.id;
      await Promise.all(
        roles.map(async (role) => {
          switch (role.role) {
            case "CONSULTANT":
              await prisma.consultant.create({
                data: {
                  userId: userId,
                  description: "",
                  roleTitle: "",
                  profilePictureUrl: "",
                  consultantAttributes: {
                    create: [],
                  },
                  pageSections: {
                    create: [
                      {
                        name: "GENERAL" as const,
                        visibility: "PUBLIC" as const,
                      },
                      {
                        name: "NETWORKING_LINKS" as const,
                        visibility: "PUBLIC" as const,
                      },
                      {
                        name: "SKILLS" as const,
                        visibility: "PUBLIC" as const,
                      },
                      {
                        name: "EMPLOYMENTS" as const,
                        visibility: "PUBLIC" as const,
                      },
                      {
                        name: "PROJECTS" as const,
                        visibility: "PUBLIC" as const,
                      },
                    ],
                  },
                },
              });
              break;
            case "SALESPERSON":
              await prisma.salesperson.create({
                data: {
                  userId: userId,
                  salesLists: {
                    create: [],
                  },
                },
              });
              break;
            case "CUSTOMER":
              await prisma.customer.create({
                data: {
                  userId: userId,
                  salesLists: {
                    create: [],
                  },
                },
              });
              break;
          }
          return;
        })
      );
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === "P1000") {
          return res
            .status(503)
            .json({ error: "Database authentication failed" });
        }
        if (err.code === "P1001") {
          return res.status(503).json({ error: "Database server unreachable" });
        }
        if (err.code === "P2002") {
          return res
            .status(409)
            .json({ error: `Duplicate entry: already exists` });
        }
        if (err.code === "P2003") {
          return res
            .status(400)
            .json({ error: "Invalid reference (related record missing)" });
        }
      }
      res.status(500).json(err);
      return;
    }
    res.status(201).json(createdUser);
  }
);

/**
 * Delete a user in the database
 * @route DELETE /admin/users/{userId}
 * @returns
 */
adminRouter.delete(
  "/users/:userId",
  authenticate,
  adminOnly,
  async (req: Request, res: Response) => {
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
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === "P2025") {
          return res.status(404).json({ error: "User not found" });
        }
        if (err.code === "P2003") {
          return res
            .status(409)
            .json({ error: "Cannot delete – record is referenced elsewhere" });
        }
      }
      res.status(500).json(err);
      return;
    }

    res.status(204).send();
  }
);

/**
 * Update a user in the database
 * @route PUT /admin/users/{userId}
 * @returns updated user
 */
adminRouter.put(
  "/users/:userId",
  authenticate,
  adminOnly,
  async (req: Request, res: Response) => {
    const parsedParams = UserIdParamsSchema.safeParse(req.params);

    if (!parsedParams.success) {
      res.status(400).json(parsedParams.error);
      return;
    }
    const { userId } = parsedParams.data;

    const parsedBody = UserBodyPartialSchema.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json(parsedBody.error);
      return;
    }

    const { name, email, password, roles } = parsedBody.data;
    let lowerCaseEmail;
    if (email !== undefined) {
      lowerCaseEmail = email.toLowerCase();
    }
    let passwordHash;
    if (password !== undefined) {
      passwordHash = await argon2.hash(password);
    }

    let user = null;

    try {
      user = await prisma.user.update({
        where: { id: userId },
        data: {
          ...(lowerCaseEmail !== undefined ? { email: lowerCaseEmail } : {}),
          ...(name !== undefined ? { name } : {}),
          ...(passwordHash !== undefined ? { passwordHash: passwordHash } : {}),
          roles: {
            deleteMany: {},
            create: roles,
          },
        },
        include: {
          roles: true,
        },
        omit: {
          passwordHash: true,
        },
      });
      await Promise.all(
        roles.map(async (role) => {
          switch (role.role) {
            case "CONSULTANT": {
              const existingConsultant = await prisma.consultant.findUnique({
                where: { userId: userId },
              });
              if (existingConsultant) {
                break;
              }
              await prisma.consultant.create({
                data: {
                  userId: userId,
                  description: "",
                  roleTitle: "",
                  profilePictureUrl: "",
                  consultantAttributes: {
                    create: [],
                  },
                  pageSections: {
                    create: [
                      {
                        name: "GENERAL" as const,
                        visibility: "PUBLIC" as const,
                      },
                      {
                        name: "NETWORKING_LINKS" as const,
                        visibility: "PUBLIC" as const,
                      },
                      {
                        name: "SKILLS" as const,
                        visibility: "PUBLIC" as const,
                      },
                      {
                        name: "EMPLOYMENTS" as const,
                        visibility: "PUBLIC" as const,
                      },
                      {
                        name: "PROJECTS" as const,
                        visibility: "PUBLIC" as const,
                      },
                    ],
                  },
                },
              });
              break;
            }
            case "SALESPERSON": {
              const existingSalesPerson = await prisma.salesperson.findUnique({
                where: { userId: userId },
              });
              if (existingSalesPerson) {
                break;
              }
              await prisma.salesperson.create({
                data: {
                  userId: userId,
                  salesLists: {
                    create: [],
                  },
                },
              });
              break;
            }
            case "CUSTOMER": {
              const existingCustomer = await prisma.customer.findUnique({
                where: { userId: userId },
              });
              if (existingCustomer) {
                break;
              }
              await prisma.customer.create({
                data: {
                  userId: userId,
                  salesLists: {
                    create: [],
                  },
                },
              });
              break;
            }
          }
          return;
        })
      );
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === "P1000") {
          return res
            .status(503)
            .json({ error: "Database authentication failed" });
        }
        if (err.code === "P1001") {
          return res.status(503).json({ error: "Database server unreachable" });
        }
        if (err.code === "P2002") {
          return res
            .status(409)
            .json({ error: `Duplicate entry: already exists` });
        }
        if (err.code === "P2025") {
          return res.status(404).json({ error: "Not found" });
        }

        return res
          .status(503)
          .json({ error: "Database initialization/connection failed" });
      }
      res.status(500).json(err);
      return;
    }

    res.json(user);
  }
);
