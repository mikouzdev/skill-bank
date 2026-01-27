import type { components } from "@api-types/openapi";
import { api } from "../../../shared/api/api";

type UserRequest = components["schemas"]["UserBody"];

type UserResponse = components["schemas"]["UserResponse"];
type UserListResponse = components["schemas"]["AllUsersResponse"];

export const getUsers = () => {
  return api.get<UserListResponse>("/admin/users");
};

export const createUser = (user: UserRequest) => {
  return api.post<UserResponse>("/admin/users", user);
};

export const deleteUser = (userId: number) => {
  return api.delete(`/admin/users/${userId}`);
};
