import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import type { components } from "@api-types/openapi";
import { useSnackbar } from "../../../../shared/components/useSnackbar";

type Consultant = components["schemas"]["ConsultantResponse"];

type Props = {
  consultant: Consultant;
  onNoteAdd: (consultantId: number, note: string) => void;
};

export default function NoteAddDialog({ consultant, onNoteAdd }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const [note, setNote] = useState<string>("");
  const { showSuccess } = useSnackbar();

  function handleNoteChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNote(e.target.value);
  }

  function handleApply() {
    onNoteAdd(consultant.id, note);
    setOpen(false);
    showSuccess("Note added.");
  }

  return (
    <>
      <IconButton aria-label="add note" onClick={() => setOpen(true)}>
        <EditIcon fontSize="small" />
      </IconButton>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Note for {consultant.user.name}</DialogTitle>
        <DialogContent>
          <Stack p={1} spacing={3}>
            <TextField
              type="text"
              size="small"
              label="Note"
              fullWidth
              value={note}
              onChange={handleNoteChange}
            />
            <Stack direction={"row"} spacing={"auto"}>
              <Button size="small" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button size="small" onClick={handleApply}>
                Apply
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}
