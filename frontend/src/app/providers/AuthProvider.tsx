import type { components } from "@api-types/openapi";
import { useEffect, useState } from "react";
import { Login } from "../../features/Login/api/login";
import { AuthContext } from "../hooks/useAuth";

type LoginRequest = components["schemas"]["LoginRequest"];

export interface AuthContextType {
  token: string | null;
  isLoading: boolean;
  login: (payload: LoginRequest) => Promise<boolean>;
  logout: () => void;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    //todo: fetch user if no user
  }, []);

  async function login(payload: LoginRequest) {
    try {
      setIsLoading(true);
      const response = await Login(payload);
      const { token } = response.data;

      localStorage.setItem("token", token);
      setToken(token);

      // todo: call fetch current user

      return true;
    } catch (error) {
      console.log("error while loggin in", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  function fetchCurrentUser() {
    // todo: async fetch current user based on the available token
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
  }

  const value: AuthContextType = {
    token,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
