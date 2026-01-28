import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../db/prismaClient.js";
import type { Role } from "../generated/prisma/enums.js";
import { TokenPayloadSchema } from "../schemas/auth/auth.schema.js";

//TODO: roles
export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    roles: Role[];
  };
}

const secret = process.env.SECRET;
if (secret === undefined) {
  throw new Error("SECRET environment variable is not set");
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const auth = req.get("Authorization");
  if (!auth?.startsWith("Bearer ")) {
    return res.status(401).send("Invalid token");
  }

  const token = auth.substring(7);
  //Check if JWT is expired (blacklisted)
  const checkIfBlacklisted = await prisma.blacklistedTokens.findFirst({
    where: { token: token },
  });

  if (checkIfBlacklisted) {
    return res.status(401).send("Invalid token");
  }

  try {
    const verified: unknown = jwt.verify(token, secret);
    const parsedToken = TokenPayloadSchema.safeParse(verified);
    if (!parsedToken.success) {
      return res.status(401).send("Invalid token");
    }

    const { userId } = parsedToken.data;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        roles: { select: { role: true } },
      },
    });

    if (!user) {
      return res.status(401).send("Invalid token");
    }

    req.user = {
      id: user.id,
      email: user.email,
      roles: user.roles.map((role) => role.role),
    };

    next();
  } catch {
    res.status(401).send("Invalid token");
  }
};

export const requireRoles =
  (...allowed: Role[]) =>
  (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).send("Unauthorized");
    }

    const rolesOk = allowed.some((r) => req.user!.roles.includes(r));
    if (!rolesOk) {
      return res.status(403).send("Forbidden");
    }
    next();
  };

export const adminOnly = requireRoles("ADMIN");
