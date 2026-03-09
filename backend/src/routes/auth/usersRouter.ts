import { Router, type Request, type Response } from "express";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { prisma } from "../../db/prismaClient.js";
import { LoginSchema, RoleBodySchema } from "../../schemas/auth/auth.schema.js";
import {
  authenticate,
  type AuthenticatedRequest,
} from "../../middlewares/authentication.js";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

export const usersRouter = Router();

const secret = process.env.SECRET;
if (secret === undefined) {
  throw new Error("SECRET environment variable is not set");
}

const options: jwt.SignOptions = { expiresIn: "1h" };

/**
 * Post a login request and get JWT response
 * @route POST /auth/login
 * @returns [jwt]
 */
usersRouter.post("/login", async (req: Request, res: Response) => {
  //Get login info from req body
  const parsedBody = LoginSchema.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(400).json(parsedBody.error);
    return;
  }
  const { email, password } = parsedBody.data;

  const lowerCaseEmail = email.toLowerCase();

  //Find user in DB
  const user = await prisma.user.findUnique({
    where: { email: lowerCaseEmail },
  });
  if (!user) {
    res.status(401).send({ error: "Invalid email or password" });
    return;
  }
  //Check if password is correct
  const passwordMatches = await argon2.verify(user.passwordHash, password);
  if (!passwordMatches) {
    res.status(401).send({ error: "Invalid email or password" });
    return;
  }
  //Return new JWT
  const token = jwt.sign({ userId: user.id }, secret, options);
  const success = true;
  res.status(200).send({ token, success });
});

/**
 * Post a logout request
 * @route POST /auth/logout
 * @returns json message
 */
usersRouter.post("/logout", async (req: Request, res: Response) => {
  const auth = req.get("Authorization");
  if (!auth?.startsWith("Bearer ")) {
    res.status(401).send("Invalid token");
    return;
  }
  const token = auth.substring(7);
  if (token != null) {
    //Check if token already expired
    const checkIfBlacklisted = await prisma.blacklistedTokens.findFirst({
      where: { token: token },
    });

    if (checkIfBlacklisted) return res.sendStatus(204);
    //Blacklist token so it cannot be used anymore
    await prisma.blacklistedTokens.create({
      data: {
        token: token,
      },
    });
    res.setHeader("Clear-Site-Data", '"cookies"');

    res.cookie("jwt", "loggedout", {
      expires: new Date(Date.now() + 10 * 1000), // Expires in 10 seconds
      httpOnly: true,
    });

    res.status(200).json({ success: true, message: "Logged out successfully" });
  } else {
    res.status(400).send({ error: "Logout failed" });
  }
});

/**
 * Get the current user's JWT
 * @route GET /auth/me
 * @returns jwt
 */
usersRouter.get(
  "/me",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        name: true,
        roles: { select: { role: true } },
        consultant: { select: { id: true } },
        salesperson: { select: { id: true } },
        customer: { select: { id: true } },
      },
    });

    if (!user) {
      return res.status(401).send("Unauthorized");
    }

    res.status(200).json({
      id: user.id,
      email: user.email,
      name: user.name,

      roles: user.roles.map((r) => r.role),
      consultantId: user.consultant?.id ?? null,
      salespersonId: user.salesperson?.id ?? null,
      customerId: user.customer?.id ?? null,
    });
  }
);

/**
 * Change user's primary role
 * @route PATCH /auth/role
 * @returns confirmation message
 */
usersRouter.patch(
  "/role",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    const parsedBody = RoleBodySchema.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json(parsedBody.error);
      return;
    }
    const { role } = parsedBody.data;
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        name: true,
        roles: { select: { role: true } },
        consultant: { select: { id: true } },
        salesperson: { select: { id: true } },
        customer: { select: { id: true } },
      },
    });

    if (!user) {
      return res.status(401).send("Unauthorized");
    }

    if (user.roles.length === 1) {
      return res.status(422).send("User only has one role");
    }

    const currentIndex = user.roles.findIndex(
      (userrole) => userrole.role === role
    );
    if (currentIndex === 0) {
      return res.status(202).send("Role is already primary role");
    } else if (currentIndex === -1) {
      return res.status(404).send("User does not have the role");
    }
    //This should shift the role to the first position in the array
    const newRoles = user.roles.sort(function (x, y) {
      return x.role == role ? -1 : y.role == role ? 1 : 0;
    });
    let editedUser = null;
    try {
      editedUser = await prisma.user.update({
        where: { id: req.user!.id },
        data: {
          roles: {
            deleteMany: {},
            create: newRoles,
          },
        },
        include: {
          roles: true,
        },
        omit: {
          passwordHash: true,
        },
      });
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
      }
      res.status(500).json(err);
      return;
    }

    res.json(editedUser);
  }
);
