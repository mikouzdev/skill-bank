import type { components } from "@api-types/openapi";
import { useEffect, useState } from "react";
import { Login } from "../../features/Login/api/login";
import { AuthContext } from "../hooks/useAuth";
import { getCurrentUser } from "../../features/Login/api/refresh";
import { customerOfferLogin } from "../../features/customer/api/customer.api";

type LoginRequest = components["schemas"]["LoginRequest"];
type MeResponse = components["schemas"]["MeResponse"];

type OfferPagePassword = components["schemas"]["OfferPagePassword"];
type OfferPage = components["schemas"]["OfferPage"];

export interface AuthContextType {
  currentUser: MeResponse | undefined;
  token: string | null;
  isLoading: boolean;
  login: (payload: LoginRequest) => Promise<boolean>;
  offerLogin: (
    salesId: number,
    offerPageId: number,
    password: OfferPagePassword
  ) => Promise<OfferPage | undefined>;
  logout: () => void;
  refreshCurrentUser: () => Promise<void>;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [currentUser, setCurrentUser] = useState<MeResponse | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  async function refreshCurrentUser() {
    if (!token) return;

    try {
      const user = await getCurrentUser();
      setCurrentUser(user.data);
    } catch (error) {
      console.log("failed to refresh user:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // fetch only if there is a token but no user
    if (token && !currentUser) {
      void refreshCurrentUser();
    } else if (!token) {
      // setIsLoading(false);
    }
  });

  async function login(payload: LoginRequest) {
    logout();
    try {
      setIsLoading(true);
      const response = await Login(payload);
      const { token } = response.data;

      localStorage.setItem("token", token);
      setToken(token);

      await refreshCurrentUser();
      return true;
    } catch (error) {
      console.log("error while loggin in", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  async function offerLogin(
    salesId: number,
    offerPageId: number,
    password: OfferPagePassword
  ): Promise<OfferPage | undefined> {
    logout();
    try {
      setIsLoading(true);
      const response = await customerOfferLogin(salesId, offerPageId, password);
      const { token, offerPage } = response.data;

      localStorage.setItem("token", token);
      setToken(token);

      return offerPage;
    } catch (error) {
      console.log("error while loggin in to offer", error);
      return undefined;
    } finally {
      setIsLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    sessionStorage.removeItem("customerOffer");
    setToken(null);
    setCurrentUser(undefined);
  }

  const value: AuthContextType = {
    currentUser,
    token,
    isLoading,
    login,
    offerLogin,
    logout,
    refreshCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
