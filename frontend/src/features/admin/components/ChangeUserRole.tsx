import { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@mui/material";

type Props = {
    id: number; 
    name: string;
}
export function ChangeUserRole({id, name} : Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({}); // add roles here

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Change Role
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Change role of {name}</DialogTitle>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log("submit payload:", form); //pass to console for debuging
            setOpen(false);
          }}
        >
          <DialogContent>
            <Stack direction="column" spacing={2} sx={{ mt: 1 }}>
              <FormGroup>
                <FormControlLabel control={<Checkbox defaultChecked />} label="Consultant" />
                <FormControlLabel control={<Checkbox />} label="Sales" />
                <FormControlLabel control={<Checkbox />} label="Customer" />
                <FormControlLabel control={<Checkbox />} label="Admin" />
              </FormGroup>
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
