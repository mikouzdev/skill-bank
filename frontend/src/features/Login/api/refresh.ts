import { type AuthResponse } from "../../../app/providers/AuthProvider";
import { api } from "../../../shared/api/api";

export const getCurrentUser = () => {
  return api.get<AuthResponse>("/auth/me");
};
