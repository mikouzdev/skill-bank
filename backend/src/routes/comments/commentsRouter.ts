import { Router, type Request, type Response } from "express";
import { prisma } from "../../db/prismaClient.js";

export const commentsRouter = Router();

/**
 * Gets all comments in the database
 * @route GET /comments
 * @returns [comments]
 */
commentsRouter.get("/", async (req: Request, res: Response) => {
  const comments = await prisma.comment.findMany({
    include: {
        directReplies: true,
    },
    orderBy: { pageSectionId: "asc" },
    });
  return res.json(comments);
});