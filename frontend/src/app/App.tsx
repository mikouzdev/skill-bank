import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "../styles/theme";
import { Routes, Route } from "react-router-dom";

//import ConsultantProfilePage from "../features/consultant/pages/ConsultantProfilePage";
import LoginPage from "../features/Login/LoginPage";
import ConsultantProfileSettings from "../features/consultant/pages/ConsultantProfileSettings";
import ConsultantProfilePage from "../features/consultant/pages/ConsultantProfilePage";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      <Routes>
        <Route path="/me" element={<ConsultantProfilePage />} />
        <Route path="/me/edit" element={<ConsultantProfileSettings />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
