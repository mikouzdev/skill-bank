import { createTheme, Box } from "@mui/material";
import { theme } from "./theme";


export const formsTheme = createTheme(theme, {
  components: {
    MuiButton: {
       
      styleOverrides: {
        root: {
          borderRadius: "999px",
          backgroundColor: "white",
          width: "fit-content",
          color: "black", //"text.primary",
          variant: "contained",
          "&:hover": {
            backgroundColor: "#f5f5f5",
          },
        },
      },
    },
  },
});

export const CenterFloatingForm = ({ children }: { children: React.ReactNode })  => {
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
