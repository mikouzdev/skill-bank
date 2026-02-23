import type { components } from "@api-types/openapi";
import { api } from "./api";

type SectionName = components["schemas"]["PageSection"]["name"];
type CommentBody = components["schemas"]["CommentBody"];

export const createComment = (
  consultantId: number,
  section: SectionName,
  comment: CommentBody
) => {
  return api.post(
    `/consultants/${consultantId}/sections/${section}/comments`,
    comment
  );
};
