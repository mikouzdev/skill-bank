import { Router, type Request, type Response } from "express";
import { prisma } from "../../db/prismaClient.js";
import {
  authenticate,
  type AuthenticatedRequest,
} from "../../middlewares/authentication.js";
import {
  CommentBodyPartialSchema,
  CommentIdParamsSchema,
} from "../../schemas/comments/comments.schema.js";

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

/**
 * Edit a comment in the database
 * @route PUT /comments/{commentId}
 * @returns edited comment
 */
commentsRouter.put(
  "/:commentId",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    const parsedParams = CommentIdParamsSchema.safeParse(req.params);
    if (!parsedParams.success) {
      res.status(400).json(parsedParams.error);
      return;
    }
    const { commentId } = parsedParams.data;

    const parsedBody = CommentBodyPartialSchema.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json(parsedBody.error);
      return;
    }
    const { content, replyToId } = parsedBody.data;
    const roles = req.user?.roles ?? [];
    let comment = null;
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user!.id },
        select: {
          id: true,
          roles: { select: { role: true } },
          consultant: { select: { id: true } },
        },
      });
      if (user === null) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      comment = await prisma.comment.findUnique({
        where: { id: commentId },
      });
      if (user.id !== comment?.userId && !roles?.includes("ADMIN")) {
        return res.status(401).send("Unauthorized");
      }
      comment = await prisma.comment.update({
        where: { id: commentId },
        data: {
          ...(content !== undefined ? { content } : {}),
          ...(replyToId !== undefined ? { replyToId } : {}),
        },
      });
    } catch (err) {
      res.status(500).json(err);
      return;
    }

    res.json(comment);
  }
);

/**
 * Deletes a comment in the database
 * @route DELETE /comments/{commentId}
 * @returns confirmation message
 */
commentsRouter.delete(
  "/:commentId",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    const parsedParams = CommentIdParamsSchema.safeParse(req.params);
    if (!parsedParams.success) {
      res.status(400).json(parsedParams.error);
      return;
    }
    const { commentId } = parsedParams.data;
    const roles = req.user?.roles ?? [];
    let comment = null;
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user!.id },
        select: {
          id: true,
          roles: { select: { role: true } },
          consultant: { select: { id: true } },
        },
      });
      if (user === null) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      comment = await prisma.comment.findUnique({
        where: { id: commentId },
      });
      if (user.id !== comment?.userId && !roles?.includes("ADMIN")) {
        return res.status(401).send("Unauthorized");
      }
      await prisma.comment.delete({
        where: {
          id: commentId,
        },
      });
      res.status(204).json();
      return;
    } catch (err) {
      res.status(500).json(err);
      return;
    }
  }
);
