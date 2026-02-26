import dayjs from "dayjs";
import type { components } from "@api-types/openapi";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  KeyboardArrowDown,
  KeyboardArrowRight,
  Delete,
} from "@mui/icons-material";
import CommentReplyButton from "./CommentReplyButton";
import { useAuth } from "../../../app/hooks/useAuth";
import { deleteComment } from "../../../shared/api/comments.api";
import { useState } from "react";
import { useSnackbar } from "../../../shared/components/useSnackbar";

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
  onCommentDeleted?: (commentId: number) => void;
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
  onCommentDeleted,
}: Props) {
  const { currentUser } = useAuth();
  const isOwnComment = commentData.userId === currentUser?.id;

  const { showSuccess, showError } = useSnackbar();
  const [loading, setLoading] = useState<boolean>(false);
  async function handleDeleteComment() {
    try {
      setLoading(true);
      await deleteComment(commentData.id);
      onCommentDeleted?.(commentData.id);
      showSuccess("Comment deleted successfully.");
    } catch (error) {
      showError("Failed to delete comment.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

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

  const collapseRepliesButton =
    !isReply && collapsible ? (
      <IconButton onClick={onCollapse} aria-label="collapse replies">
        {isCollapsed ? <KeyboardArrowRight /> : <KeyboardArrowDown />}
      </IconButton>
    ) : null;

  const deleteButton = isOwnComment ? (
    <Button
      onClick={() => void handleDeleteComment()}
      sx={{ px: 2 }}
      size="small"
      startIcon={<Delete />}
      aria-label="delete comment"
      loading={loading}
    >
      Delete
    </Button>
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
          <Stack
            direction={"row"}
            spacing={1}
            justifyContent={"flex-end"}
            alignItems={"center"}
            flex={1}
          >
            {collapseRepliesButton}
            {replyButton}
            {deleteButton}
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
}
