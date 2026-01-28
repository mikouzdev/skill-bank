type MeResponse = components["schemas"]["MeResponse"];
import type { components } from "@api-types/openapi";
import { api } from "../../../shared/api/api";

export const getCurrentUser = () => {
  return api.get<MeResponse>("/auth/me");
};
