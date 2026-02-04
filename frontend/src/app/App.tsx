import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "../styles/theme";
import { Routes, Route } from "react-router-dom";

import LoginPage from "../features/Login/LoginPage";
import { LoginRolePage } from "../features/Login/LoginRolePage";
import ConsultantProfileSettings from "../features/consultant/pages/ConsultantProfileSettings";
import ConsultantProfilePage from "../features/consultant/pages/ConsultantProfilePage";
import { ConsultantListView } from "../features/sales/pages/ConsultantListView";
import { ManageUsersPage } from "../features/admin/pages/ManageUsersPage";
import { ConsultantListConsultants } from "../features/consultant/pages/ConsultantListConsultants";
import { SidebarLayout } from "./layout/SidebarLayout";
import SkillEditingPage from "../shared/pages/SkillEditing/SkillEditingPage";
import { SnackbarProvider } from "../shared/components/SnackbarProvider";
import CustomerLoginPage from "../features/customer/pages/CustromerLoginPage";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <SnackbarProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/customerlogin" element={<CustomerLoginPage />} />
          <Route path="/loginRole" element={<LoginRolePage />} />

          <Route element={<SidebarLayout />}>
            <Route path="/me" element={<ConsultantProfilePage />} />
            <Route path="/me/edit" element={<ConsultantProfileSettings />} />
            <Route path="/sales" element={<ConsultantListView />} />
            <Route path="/manage-users" element={<ManageUsersPage />} />
            <Route
              path="/listConsultants"
              element={<ConsultantListConsultants />}
            />
            <Route path="/editSkills" element={<SkillEditingPage />} />
          </Route>
        </Routes>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
