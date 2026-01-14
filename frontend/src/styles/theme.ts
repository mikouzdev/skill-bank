import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    background: {
      default: "#DDDDDD",
      paper: "#EEEEEE",
    },
  },
  
  //
  components: {
    MuiButton: {
    styleOverrides: {
        root: {
          borderRadius: "999px",
          backgroundColor: "#0079c4",
          width: "fit-content",
          color: "white", //"text.primary",
          variant: "contained",
          "&:hover": {
            backgroundColor: "#006aa9",
          },
        },
      },
    },
  },
  //
});
