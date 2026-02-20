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
  Box,
} from "@mui/material";
import type { components } from "@api-types/openapi";

type UserResponse = components["schemas"]["UserResponse"];
type UserBody = components["schemas"]["UserBodyPartial"];
type Role = "CONSULTANT" | "SALESPERSON" | "CUSTOMER" | "ADMIN";

type Props = {
  user: UserResponse;
  onSubmit: (id: number, user: UserBody) => Promise<boolean>;
};

export function ChangeUserRole({ user, onSubmit }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<UserResponse>(user); // add roles here
  const [loading, setLoading] = useState<boolean>(false);

  function hasRole(role: Role) {
    return form.roles.some((r) => r.role === role);
  }

  function handleRoleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const role = e.target.name as Role;
    const checked = e.target.checked;

    setForm((prev) => ({
      ...prev,
      roles: checked
        ? [...prev.roles, { role }]
        : prev.roles.filter((r) => r.role !== role),
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const payload: UserBody = {
      roles: form.roles,
    };

    setLoading(true);
    const success = await onSubmit(user.id, payload);
    if (success) setOpen(false);
    setLoading(false);
  }

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Change Role
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <Box component="form" onSubmit={(e) => void handleSubmit(e)}>
          <DialogTitle>Change role of {user.name}</DialogTitle>
          <DialogContent>
            <Stack direction="column" spacing={2} sx={{ mt: 1 }}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="CONSULTANT"
                      checked={hasRole("CONSULTANT")}
                      onChange={(e) => handleRoleChange(e)}
                    />
                  }
                  label="Consultant"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="SALESPERSON"
                      checked={hasRole("SALESPERSON")}
                      onChange={(e) => handleRoleChange(e)}
                    />
                  }
                  label="Sales"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="CUSTOMER"
                      checked={hasRole("CUSTOMER")}
                      onChange={(e) => handleRoleChange(e)}
                    />
                  }
                  label="Customer"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="ADMIN"
                      checked={hasRole("ADMIN")}
                      onChange={(e) => handleRoleChange(e)}
                    />
                  }
                  label="Admin"
                />
              </FormGroup>
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" loading={loading}>
              Save
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}
