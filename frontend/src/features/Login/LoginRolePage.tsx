import { LoginRolePageForm } from "./Components/LoginRolePageForm";
import { CenterFloatingForm } from "../../styles/formsTheme";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../app/hooks/useAuth";
import { useEffect } from "react";

export const LoginRolePage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const redirect = () => {
    if (currentUser?.roles.includes("CONSULTANT")) {
      void navigate("/consultant/me");
      return;
    }
    if (currentUser?.roles.includes("SALESPERSON")) {
      void navigate("/sales");
      return;
    }
    if (currentUser?.roles.includes("ADMIN")) {
      void navigate("/manage-users");
      return;
    }
    if (currentUser?.roles.includes("CUSTOMER")) {
      void navigate("/offers");
      return;
    }

    void navigate("/logout");
    return;
  };

  useEffect(() => {
    if (currentUser?.roles.length === 1) {
      redirect();
      return;
    }

    //this should never happen.
    if (currentUser?.roles.length === 0) {
      void navigate("/");
      return;
    }
  });

  return (
    <CenterFloatingForm>
      <LoginRolePageForm />
    </CenterFloatingForm>
  );
};
