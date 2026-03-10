import type { components } from "@api-types/openapi";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Check, Reply } from "@mui/icons-material";
import { createComment } from "../../../shared/api/comments.api";
import { useSnackbar } from "../../../shared/components/useSnackbar";

type SectionName = components["schemas"]["PageSection"]["name"];
type CommentBody = components["schemas"]["CommentBody"];

type Props = {
  sectionName: SectionName;
  commentId: number;
  consultantId: number;
};

export default function CommentReplyButton({
  sectionName,
  commentId,
  consultantId,
}: Props) {
  const { showSuccess, showError } = useSnackbar();
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [replyText, setReplyText] = useState<string>("");

  async function handleSubmitReply(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmedReply = replyText.trim();
    if (trimmedReply === "") {
      showError("Cannot add an empty reply.");
      return;
    }

    const commentPayload: CommentBody = {
      content: replyText,
      replyToId: commentId,
    };

    try {
      setLoading(true);
      await createComment(consultantId, sectionName, commentPayload);
      setOpen(false);
      showSuccess("Reply posted succesfully.");
    } catch (error) {
      console.log(error);
      showError("Failed to post reply.");
    } finally {
      setLoading(false);
    }
  }

  function handleReplyChange(e: React.ChangeEvent<HTMLInputElement>) {
    setReplyText(e.target.value);
  }

  return (
    <>
      <Button
        startIcon={<Reply />}
        sx={{ px: 2 }}
        size="small"
        onClick={() => setOpen(true)}
      >
        Reply
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          <Typography align="center">
            Reply to comment id: {commentId}
            <br />
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Stack
            spacing={2}
            minWidth={300}
            alignItems={"center"}
            component="form"
            onSubmit={(e) => void handleSubmitReply(e)}
          >
            <TextField
              required
              fullWidth
              multiline
              minRows={3}
              placeholder="Write a reply.."
              value={replyText}
              onChange={handleReplyChange}
            />
            <Button
              loading={loading}
              size="small"
              sx={{ px: 1 }}
              startIcon={<Check />}
              type="submit"
            >
              Add reply
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}
