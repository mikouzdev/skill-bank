import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";

//TODO: roles
interface AuthenticatedRequest extends Request {
    user?: { email: string, admin?: boolean };
}

const secret = process.env.SECRET;
if (secret === undefined) {
    throw new Error("SECRET environment variable is not set");
}

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const auth = req.get("Authorization");
    if (!auth?.startsWith("Bearer ")) {
        res.status(401).send("Invalid token");
        return;
    }

    const token = auth.substring(7);
    try {
        const decodedToken = jwt.verify(token, secret) as { email: string };
        req.user = decodedToken;
        next();
    } catch (error) {
        res.status(401).send("Invalid token");
    }
}

export const adminOnly = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    //TODO: check for admin role instead of boolean
    if (!req.user || !req.user.admin) {
        res.status(403).send("Forbidden");
        return;
    }
    next();
};