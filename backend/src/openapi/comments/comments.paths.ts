import { GetCommentsResponseSchema } from "../../schemas/consultants/pageSections.schema.js";


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
  }
}