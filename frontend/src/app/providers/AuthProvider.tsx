import type { components } from "@api-types/openapi";
import { useEffect, useState } from "react";
import { Login } from "../../features/Login/api/login";
import { AuthContext } from "../hooks/useAuth";
import { getCurrentUser } from "../../features/Login/api/refresh";

type LoginRequest = components["schemas"]["LoginRequest"];
type MeResponse = components["schemas"]["MeResponse"];
export interface AuthContextType {
  currentUser: MeResponse | undefined;
  token: string | null;
  isLoading: boolean;
  login: (payload: LoginRequest) => Promise<boolean>;
  logout: () => void;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [currentUser, setCurrentUser] = useState<MeResponse | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user.data);
      } catch (error) {
        console.log("failed to fetch user:", error);
        //logout();
      } finally {
        setIsLoading(false);
      }
    }

    // fetch only if there is a token but no user
    if (token && !currentUser) {
      void fetchCurrentUser();
    } else if (!token) {
      setIsLoading(false);
    }
  }, [token, currentUser]);

  async function login(payload: LoginRequest) {
    logout();
    try {
      setIsLoading(true);
      const response = await Login(payload);
      const { token } = response.data;

      localStorage.setItem("token", token);
      setToken(token);

      return true;
    } catch (error) {
      console.log("error while loggin in", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setCurrentUser(undefined);
  }

  const value: AuthContextType = {
    currentUser,
    token,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
