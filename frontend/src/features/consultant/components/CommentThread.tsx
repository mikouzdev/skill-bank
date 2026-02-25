import type { components } from "@api-types/openapi";
import { Collapse, Stack } from "@mui/material";

import CommentCard from "./CommentCard";
import { useState } from "react";
import dayjs from "dayjs";

type Section = components["schemas"]["GetPageSectionsResponse"][number];
type Comment = components["schemas"]["Comment"];

type Props = {
  comment: Comment;
  replies: Comment[];
  section: Section;
  replyAllowed?: boolean;
};

/**
 * Displays comment and collapsible replies belonging to it.
 */
export default function CommentThread({
  comment,
  replies,
  section,
  replyAllowed,
}: Props) {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const threadReplies = replies.filter((r) => r.replyToId === comment.id);

  // sort replies by creation date
  const sortedReplies = threadReplies.sort(
    (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix()
  );

  return (
    <Stack direction={"column"} width={"100%"} spacing={2}>
      {/* root comment */}
      <CommentCard
        commentData={comment}
        sectionData={section}
        replyAllowed={replyAllowed}
        collapsible={sortedReplies.length > 0}
        onCollapse={() => setCollapsed((prev) => !prev)}
        isCollapsed={collapsed}
      />

      {/* replies, if there are */}
      {sortedReplies.length > 0 ? (
        <Collapse in={collapsed}>
          <Stack width="100%" spacing={2} alignItems={"flex-end"}>
            {sortedReplies.map((r) => (
              <CommentCard
                key={r.id}
                commentData={r}
                sectionData={section}
                isReply
              />
            ))}
          </Stack>
        </Collapse>
      ) : null}
    </Stack>
  );
}
