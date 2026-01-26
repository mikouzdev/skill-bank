import type { components } from "@api-types/openapi";
import { api } from "../../../shared/api/api";

type UserRequest = components["schemas"]["UserBody"];
type UserResponse = components["schemas"]["UserResponse"];

export const createUser = (user: UserRequest) => {
  return api.post<UserResponse>("/admin/users", user);
};
