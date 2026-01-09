import { Box } from "@mui/material";

export const CenterFloatingForm = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2, // prevents edge collisions on mobile
      }}
    >
      {children}
    </Box>
  );
}