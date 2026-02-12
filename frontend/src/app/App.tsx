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
import CustomerOffersPage from "../features/customer/pages/CustomerOffersPage";
import { SnackbarProvider } from "../shared/components/SnackbarProvider";
import CustomerLoginPage from "../features/customer/pages/CustomerLoginPage";
import { Logout } from "../features/Logout/Logout";
import SalesOffersPage from "../features/sales/pages/SalesOffersPage/SalesOffersPage";
import SalesSingleOfferPage from "../features/sales/pages/SalesOffersPage/SalesSingleOfferPage";
import { Redirector } from "../features/Login/Components/Redirector";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <SnackbarProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/customerlogin" element={<CustomerLoginPage />} />
          <Route path="/loginRole" element={<LoginRolePage />} />
          <Route path="/redirector" element={<Redirector />} />

          <Route element={<SidebarLayout />}>
            {/* consultant */}
            <Route path="/me" element={<ConsultantProfilePage />} />
            <Route path="/me/edit" element={<ConsultantProfileSettings />} />
            <Route
              path="/listConsultants"
              element={<ConsultantListConsultants />}
            />

            {/* admin */}
            <Route path="/manage-users" element={<ManageUsersPage />} />

            {/* admin & salesperson */}
            <Route path="/editSkills" element={<SkillEditingPage />} />

            {/* salesperson */}
            <Route path="/manage-offers" element={<SalesOffersPage />} />
            <Route
              path="manage-offers/:id"
              element={<SalesSingleOfferPage />}
            />
            <Route path="/sales" element={<ConsultantListView />} />

            {/* customer */}
            <Route path="/offers" element={<CustomerOffersPage />} />
          </Route>
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
