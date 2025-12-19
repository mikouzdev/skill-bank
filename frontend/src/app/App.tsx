import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "../styles/theme";

import ConsultantProfilePage from "../features/consultant/pages/ConsultantProfilePage";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ConsultantProfilePage />
    </ThemeProvider>
  );
}

export default App;
