import {
  Container,
  Paper,
  Box,
  TextField,
  Typography,
  Button,
  Link,
} from "@mui/material";
import { useAuth } from "../../../app/hooks/useAuth";
import { useState } from "react";
import type { components } from "@api-types/openapi";
import { useNavigate } from "react-router-dom";

type LoginRequest = components["schemas"]["LoginRequest"];

export const LoginPageForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<LoginRequest>({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.email || !form.password) {
      alert("email and password are required.");
      return;
    }

    setIsLoading(true);

    // just to see the loading icon :)
    await new Promise((res) => setTimeout(res, 500));

    const success = await login(form);
    if (success) {
      void navigate("/me");
      return;
    }

    // todo: error feedback; show error message etc
    setIsLoading(false);
    alert("log in failed");
  }

  return (
    <Container maxWidth="sm">
      <Paper sx={{ padding: 2 }}>
        <Typography component="h1" variant="h4" sx={{ textAlign: "center" }}>
          Sign in
        </Typography>
        <Box component="form" onSubmit={(e) => void handleSubmit(e)}>
          <TextField
            type="email"
            placeholder="Email"
            fullWidth
            required
            autoFocus
            sx={{ mb: 2 }}
            name="email"
            value={form.email}
            onChange={handleChange}
          />

          <TextField
            type="password"
            placeholder="Password"
            fullWidth
            required
            sx={{ mb: 2 }}
            name="password"
            value={form.password}
            onChange={handleChange}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Button type="submit" loading={isLoading}>
              Sign in
            </Button>

            <Link>Forgot password?</Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};
