import { Router, type Request, type Response } from "express";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { prisma } from "../../db/prismaClient.js";
import {
  LoginSchema,
  AuthResponseSchema,
  LogoutResponseSchema,
} from "../../schemas/auth/auth.schema.js";
import { access } from "node:fs";

export const usersRouter = Router();

const secret = process.env.SECRET;
if (secret === undefined) {
  throw new Error("SECRET environment variable is not set");
}

const options: jwt.SignOptions = { expiresIn: "1h"};

usersRouter.post("/login", async (req: Request, res: Response) => {
    //Get login info from req body
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
    //Find user in DB
    const user = await prisma.user.findFirst({
        where: { email: email },
        include: {
          
        },
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
    const token = jwt.sign({ email }, secret, options);
    const success = true;
    res.status(200).send({ token, success });
});

usersRouter.post("/logout", async (req: Request, res: Response) => {
    const auth = req.get("Authorization");
    if (!auth?.startsWith("Bearer ")) {
        res.status(401).send("Invalid token");
        return;
    }
    const token = auth.substring(7);
    if (token != null || token != undefined) {
        //Check if token already expired
        const checkIfBlacklisted = await prisma.blacklistedTokens.findFirst({ where: { token: token } });
    
        if (checkIfBlacklisted) return res.sendStatus(204);
        //Blacklist token so it cannot be used anymore
        const newBlacklist = await prisma.blacklistedTokens.create({
            data: {
                token: token
            },
        });
        res.setHeader('Clear-Site-Data', '"cookies"');

        res.cookie("jwt", "loggedout", {
            expires: new Date(Date.now() + 10 * 1000), // Expires in 10 seconds
            httpOnly: true,
        });

        res.status(200).json({ success: true, message: "Logged out successfully" });
    }
    else{
        res.status(400).send({ error: "Logout failed" });
    }
});