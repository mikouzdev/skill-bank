import { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

export function AddUserDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", title: "",  email: "", userRole: ""  });

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Add user
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add user</DialogTitle>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log("submit payload:", form); //pass to console for debuging
            setOpen(false);
          }}
        >
          <DialogContent>
            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Full name"
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                required
                fullWidth
              />
              <TextField
                label="Title"
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
                required
                fullWidth
              />

              <TextField
                label="Email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                required
                fullWidth
              />

              <FormControl fullWidth>
                <InputLabel>User role</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={form.userRole}
                    label="Age"
                    required
                    onChange={(e) => setForm((p) => ({ ...p, userRole: e.target.value }))}
                    
                  >
                    <MenuItem value={"Consultant"}>Consultant</MenuItem>
                    <MenuItem value={"Sales"}>Sales</MenuItem>
                    <MenuItem value={"Admin"}>Admin</MenuItem>
                  </Select>
              </FormControl>
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button type="submit" variant="contained">
              Add an user
            </Button>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
