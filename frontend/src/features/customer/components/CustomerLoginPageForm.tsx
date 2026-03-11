import {
  Container,
  Paper,
  Box,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import { useState } from "react";

type Props = {
  onSubmit: (password: string) => Promise<void>;
};

export const CustomerLoginPageForm = ({ onSubmit }: Props) => {
  const [password, setPassword] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await onSubmit(password);
    return;
  }

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
  }

  return (
    <Container maxWidth="sm">
      <Paper sx={{ padding: 2 }}>
        <Typography component="h1" variant="h4" sx={{ textAlign: "center" }}>
          Sign in
        </Typography>
        <Typography
          component="h1"
          variant="subtitle2"
          sx={{ textAlign: "center" }}
        >
          Please enter your password.
        </Typography>
        <Box component="form" onSubmit={(e) => void handleSubmit(e)}>
          <TextField
            value={password}
            onChange={handlePasswordChange}
            type="password"
            placeholder="Password"
            fullWidth
            required
            name="password"
            sx={{ mb: 2 }}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Button type="submit">Sign in</Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};
