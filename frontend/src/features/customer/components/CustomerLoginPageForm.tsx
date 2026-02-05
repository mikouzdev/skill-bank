import {
  Container,
  Paper,
  Box,
  TextField,
  Typography,
  Button,
  Link,
} from "@mui/material";

export const CustomerLoginPageForm = () => {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    alert("Not implemented");
    return;
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
            type="password"
            placeholder="Password"
            fullWidth
            required
            sx={{ mb: 2 }}
            name="password"
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

            <Link>Resend password?</Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};
