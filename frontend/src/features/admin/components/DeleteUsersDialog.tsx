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


type SelectedUser = {id: number, name: string}
type Props = {
  selectedUsers: SelectedUser[];
};

export function DeleteUsersDialog({selectedUsers} : Props) {
  const [open, setOpen] = useState(false);
  
  return (
    <>
      <Button variant="contained" sx={{backgroundColor: "red", "&:hover": { backgroundColor: "darkred" }}}  onClick={() => setOpen(true)}>
        Delete selected users
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Remove {selectedUsers.length} user(s)</DialogTitle>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log("submit payload:", selectedUsers); //pass to console for debuging
            
            setOpen(false);
          }}
        >
          <DialogContent>
            <Stack direction="column" spacing={2} sx={{ mt: 1 }}>
               {selectedUsers.map((u) => (
              <Box key={u.id}>{u.name}</Box>
            ))}
              </Stack>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained"
            onClick={() => {
              console.log("Selected IDs to delete:", selectedUsers);
              setOpen(false);
            }}
            >
              Delete user(s)
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
