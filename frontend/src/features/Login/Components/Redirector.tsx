import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../app/hooks/useAuth";
import { useEffect } from "react";

export const Redirector = () => {
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

    //void navigate("/logout");
    return;
  };

  useEffect(() => {
    redirect();
  });

  return <></>;
};
