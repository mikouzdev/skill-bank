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
import type { components } from "@api-types/openapi";
import { useSnackbar } from "../../../shared/components/useSnackbar";

type UserRequest = components["schemas"]["UserBody"];

type Props = {
  onAddUser: (user: UserRequest) => Promise<boolean>;
};

export function AddUserDialog({ onAddUser }: Props) {
  const { showError } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<UserRequest>({
    name: "",
    email: "",
    roles: [{ role: "CONSULTANT" }],
    password: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);

    if (form.password.length < 6) {
      showError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    const success = await onAddUser(form);
    setLoading(false);

    // close form only on success
    if (success) {
      setOpen(false);
    }
  }

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Add user
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add user</DialogTitle>

        <form onSubmit={(e) => void handleSubmit(e)}>
          <DialogContent>
            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Full name"
                placeholder="Full name"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                required
                fullWidth
              />

              <TextField
                label="Email"
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
                required
                fullWidth
              />

              <TextField
                label="Password"
                value={form.password}
                onChange={(e) =>
                  setForm((p) => ({ ...p, password: e.target.value }))
                }
                required
                fullWidth
              />

              <FormControl fullWidth>
                <InputLabel>User role</InputLabel>
                <Select
                  value={form.roles[0]?.role || ""}
                  required
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      roles: [{ role: e.target.value }],
                    }))
                  }
                >
                  <MenuItem value="CONSULTANT">Consultant</MenuItem>
                  <MenuItem value="SALESPERSON">Sales</MenuItem>
                  <MenuItem value="ADMIN">Admin</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button loading={loading} type="submit" variant="contained">
              Add an user
            </Button>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
