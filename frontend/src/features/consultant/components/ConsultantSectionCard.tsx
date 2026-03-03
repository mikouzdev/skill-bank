import type { components } from "@api-types/openapi";
import { Stack, Typography } from "@mui/material";
import CommentThread from "./CommentThread";

type Section = components["schemas"]["GetPageSectionsResponse"][number];

type Props = {
  section: Section;
  replyAllowed?: boolean;
  onCommentDeleted?: (sectionId: number, commentId: number) => void;
};

/**
 * Displays a single page section comments.
 */
export default function ConsultantSectionCard({
  section,
  replyAllowed,
  onCommentDeleted,
}: Props) {
  if (!section) return <Typography>Section data failed to load.</Typography>;

  // split section comments into comments that ARENT replies, and comments that ARE replies.
  // based on wether they have a replyToId or not.
  const rootComments = section.comments.filter((c) => c.replyToId === null);
  const replies = section.comments.filter((c) => c.replyToId !== null);

  const sectionComments = rootComments.map((c) => (
    <CommentThread
      key={c.id}
      comment={c}
      replies={replies}
      section={section}
      replyAllowed={replyAllowed}
      onCommentDeleted={(commentId) => onCommentDeleted?.(section.id, commentId)}
    />
  ));

  return (
    <Stack spacing={2} alignItems={"flex-end"}>
      {sectionComments}
    </Stack>
  );
}
