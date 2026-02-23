import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Comment, Check } from "@mui/icons-material";
import type { components } from "@api-types/openapi";
import { useParams } from "react-router-dom";
import { createComment } from "../../../shared/api/comments.api";
import { useState } from "react";
import { useSnackbar } from "../../../shared/components/useSnackbar";
import { useAuth } from "../../../app/hooks/useAuth";

type SectionName = components["schemas"]["PageSection"]["name"];
type CommentBody = components["schemas"]["CommentBody"];

type Props = {
  label: string;
  section: SectionName;
};

export default function AddCommentButton({ label, section }: Props) {
  const { currentUser } = useAuth();
  const { showError, showSuccess } = useSnackbar();
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [commentText, setCommentText] = useState<string>("");

  // get consultant id from url: /consultant/:id
  const { id } = useParams();
  const consultantId = Number(id);

  const isAuthorizedToComment = currentUser?.roles.some(
    (r) => r === "SALESPERSON"
  );

  async function handleSubmitComment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!isAuthorizedToComment) {
      showError("You're not authorized to comment.");
      return;
    }

    const trimmedComment = commentText.trim();
    if (trimmedComment === "") {
      showError("Cannot add an empty comment.");
      return;
    }

    const commentPayload: CommentBody = {
      content: trimmedComment,
      replyToId: undefined,
    };

    try {
      setLoading(true);
      await createComment(consultantId, section, commentPayload);
      showSuccess("Comment added succesfully.");
      setOpen(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  function handleCommentChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCommentText(e.target.value);
  }

  if (!isAuthorizedToComment) return null;

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        size="small"
        startIcon={<Comment />}
        sx={{
          px: 2,
          width: "fit-content",
        }}
      >
        {label}
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          <Typography align="center">
            Add comment to profile section: <br />
            <b>{section}</b>
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Stack
            spacing={2}
            minWidth={300}
            alignItems={"center"}
            component="form"
            onSubmit={(e) => void handleSubmitComment(e)}
          >
            <TextField
              required
              fullWidth
              multiline
              minRows={3}
              placeholder="Write a comment.."
              value={commentText}
              onChange={handleCommentChange}
            />
            <Button
              loading={loading}
              size="small"
              sx={{ px: 1 }}
              startIcon={<Check />}
              type="submit"
            >
              Add comment
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}
