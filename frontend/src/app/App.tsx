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
//import { SalesConsultantsList } from "../features/sales/pages/SalesConsultantsLists";
import SalesConsultantsLists from "../features/sales/pages/SalesConsultantsLists";
import OfferCreationPage from "../features/sales/pages/OfferCreationPage/OfferCreationPage";
import ConsultantProfileForOthers from "../shared/pages/ConsultantProfileForOthers";
import ListCreationPage from "../features/sales/pages/ListCreationPage/ListCreationPage";
import ConsultantCommentsPage from "../features/consultant/pages/ConsultantCommentsPage";
import OfferEditingPage from "../features/sales/pages/OfferEditingPage/OfferEditingPage";

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
            <Route path="consultant/me" element={<ConsultantProfilePage />} />
            <Route
              path="consultant/me/edit"
              element={<ConsultantProfileSettings />}
            />
            <Route
              path="consultant/me/comments"
              element={<ConsultantCommentsPage />}
            />

            <Route
              path="/consultant/:id"
              element={<ConsultantProfileForOthers />}
            />
            <Route
              path="/consultant/:id/comments"
              element={<ConsultantCommentsPage />}
            />
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
            <Route
              path="/manage-offers/create"
              element={<OfferCreationPage />}
            />
            <Route
              path="/manage-offers/edit/:id"
              element={<OfferEditingPage />}
            />
            <Route path="/sales" element={<ConsultantListView />} />
            <Route
              path="/salesConsultantsList"
              element={<SalesConsultantsLists />}
            />
            <Route
              path="/salesConsultantsList/create"
              element={<ListCreationPage />}
            />

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
