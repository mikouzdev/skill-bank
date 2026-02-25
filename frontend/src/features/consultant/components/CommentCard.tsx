import dayjs from "dayjs";
import type { components } from "@api-types/openapi";
import { Box, Chip, IconButton, Paper, Stack, Typography } from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowRight } from "@mui/icons-material";
import CommentReplyButton from "./CommentReplyButton";

const DATE_FORMAT = "DD/MM/YYYY - HH:mm";

type Comment = components["schemas"]["Comment"];
type Section = components["schemas"]["PageSection"];

type Props = {
  commentData: Comment;
  sectionData: Section;
  replyAllowed?: boolean;
  isReply?: boolean;
  collapsible?: boolean;
  onCollapse?: () => void;
  isCollapsed?: boolean;
};

/**
 * Displays a single comment.
 */
export default function CommentCard({
  commentData,
  sectionData,
  replyAllowed,
  isReply,
  collapsible,
  onCollapse,
  isCollapsed,
}: Props) {
  const sectionNameChip = !isReply ? (
    <Chip label={sectionData.name} size="small" color="primary" />
  ) : null;

  const replyButton =
    replyAllowed && !isReply ? (
      <CommentReplyButton
        commentId={commentData.id}
        consultantId={sectionData.consultantId}
        sectionName={sectionData.name}
      />
    ) : null;

  const collapseRepliesButton = !isReply ? (
    <IconButton onClick={onCollapse} aria-label="collapse replies">
      {isCollapsed ? <KeyboardArrowRight /> : <KeyboardArrowDown />}
    </IconButton>
  ) : null;

  return (
    <Paper
      key={commentData.id}
      sx={{ width: isReply ? "95%" : "100%" }}
      elevation={2}
    >
      <Box p={2}>
        <Stack direction={"row"} justifyContent={"space-between"}>
          {isReply ? (
            <Typography gutterBottom fontWeight={500}>
              {commentData.userRole} {commentData.userId} replied:
            </Typography>
          ) : (
            <Typography gutterBottom fontWeight={500}>
              {commentData.userRole} {commentData.userId} commented:
            </Typography>
          )}

          <Typography>
            {dayjs(commentData.updatedAt).format(DATE_FORMAT)}
          </Typography>
        </Stack>

        <Box py={1}>
          <Typography gutterBottom>{commentData.content}</Typography>
        </Box>

        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          {sectionNameChip}
          <Stack direction={"row"} spacing={1}>
            {collapsible ? collapseRepliesButton : null}
            {replyButton}
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
}
