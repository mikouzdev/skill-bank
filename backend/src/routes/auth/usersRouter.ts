import { Router, type Request, type Response } from "express";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { prisma } from "../../db/prismaClient.js";
import {
  LoginSchema,
  AuthResponseSchema,
  LogoutResponseSchema,
} from "../../schemas/auth/auth.schema.js";

export const usersRouter = Router();

const secret = process.env.SECRET;
if (secret === undefined) {
  throw new Error("SECRET environment variable is not set");
}

const options: jwt.SignOptions = { expiresIn: "1h"};

usersRouter.post("/login", async (req: Request, res: Response) => {
    const parsedBody = LoginSchema.safeParse(req.body);
    if (!parsedBody.success) {
        res.status(400).json(parsedBody.error);
        return;
    }
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).send({ error: "Email and password are required" });
        return
    }

    const user = await prisma.user.findFirst({
        where: { email: email },
        include: {
          
        },
    });
    if (!user) {
        res.status(401).send({ error: "Invalid email or password" });
        return;
    }

    const passwordMatches = await argon2.verify(user.passwordHash, password);
    if (!passwordMatches) {
        res.status(401).send({ error: "Invalid email or password" });
        return;
    }

    const token = jwt.sign({ email }, secret, options);
    const success = true;
    res.status(200).send({ token, success });
});