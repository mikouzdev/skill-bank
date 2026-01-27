import { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Box,
} from "@mui/material";

type SelectedUser = { id: number; name: string };
type Props = {
  selectedUsers: SelectedUser[];
  onDelete: () => Promise<boolean>;
};

export function DeleteUsersDialog({ selectedUsers, onDelete }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);

    const success = await onDelete();
    setLoading(false);

    // close form only on success
    if (success) {
      setOpen(false);
    }
  }

  return (
    <>
      <Button
        variant="contained"
        sx={{
          backgroundColor: "red",
          "&:hover": { backgroundColor: "darkred" },
        }}
        onClick={() => setOpen(true)}
      >
        Delete selected users
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Remove {selectedUsers.length} user(s)</DialogTitle>

        <form onSubmit={(e) => void handleSubmit(e)}>
          <DialogContent>
            <Stack direction="column" spacing={2} sx={{ mt: 1 }}>
              {selectedUsers.map((u) => (
                <Box key={u.id}>{u.name}</Box>
              ))}
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" loading={loading}>
              Delete user(s)
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
