import type { components } from "@api-types/openapi";
import { api } from "../../../shared/api/api";

type LoginRequest = components["schemas"]["LoginRequest"];
type AuthResponse = components["schemas"]["AuthResponse"];

export const Login = (payload: LoginRequest) => {
  return api.post<AuthResponse>(`/auth/login`, payload);
};
