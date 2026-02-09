import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../app/hooks/useAuth";

export const Logout = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  if (!auth) {
    throw new Error("AuthContext not found");
  }

  useEffect(() => {
    auth.logout();
    void navigate("/login", { replace: true });
  }, [auth, navigate]);

  return null;
};
