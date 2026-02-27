import type { components } from "@api-types/openapi";
import { api } from "../../../shared/api/api";

type FullUserResponse = components["schemas"]["FullUserResponse"];

//payload here is the roletype, for now it's ok to be a type string
export const updateRole = (role: string) => {
  return api.patch<FullUserResponse>(`/auth/role`, { role });
};
