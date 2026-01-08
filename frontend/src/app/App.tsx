import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "../styles/theme";

//import ConsultantProfilePage from "../features/consultant/pages/ConsultantProfilePage";
import LoginPage from "../features/Login/LoginPage";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LoginPage />
    </ThemeProvider>
  );
}

export default App;
