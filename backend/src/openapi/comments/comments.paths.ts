import { CommentBodyPartialSchema } from "../../schemas/comments/comments.schema.js";
import { CommentSchema, GetCommentsResponseSchema } from "../../schemas/consultants/pageSections.schema.js";


export const CommentsPaths = {
  "/comments": {
    get: {
      summary: "Get all comments",
      tags: ["Comments"],
      responses: {
        200: {
          description: "Retrieval successful",
          content: {
            "application/json": { schema: GetCommentsResponseSchema },
          },
        },
        500: { description: "Server error" },
      },
    },
  },
  "/comments/{commentId}": {
    put: {
      summary: "Update a comment",
      tags: ["Comments"],
      parameters: [
        {
          name: "commentId",
          in: "path" as const,
          required: true,
          schema: { type: "integer" as const },
        },
      ],
      requestBody: {
        required: true,
        content: { "application/json": { schema: CommentBodyPartialSchema } },
      },
      responses: {
        200: {
          description: "Update successful",
          content: {
            "application/json": { schema: CommentSchema },
          },
        },
        400: { description: "Invalid request body" },
        401: { description: "Unauthorized" },
        404: { description: "Not found" },
        500: { description: "Server error" },
      },
    },
    delete: {
      summary: "Delete a comment",
      tags: ["Comments"],
      parameters: [
        {
          name: "commentId",
          in: "path" as const,
          required: true,
          schema: { type: "integer" as const },
        },
      ],
      responses: {
        204: {
          description: "Deletion successful",
        },
        400: { description: "Invalid comment id" },
        401: { description: "Unauthorized" },
        404: { description: "Not found" },
        500: { description: "Server error" },
      },
    }
  }
}