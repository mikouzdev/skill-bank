import { z } from "zod";
import { CommentBodySchema } from "../consultants/pageSections.schema.js";

export const CommentIdParamsSchema = z.object({
  commentId: z.coerce.number().meta({ example: "1" }),
});

export const CommentBodyPartialSchema = CommentBodySchema.partial({
  replyToId: true,
  content: true,
}).meta({ id: "CommentBodyPartial" });
