import { createContext, useContext } from "react";
import { type AuthContextType } from "../providers/AuthProvider";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
