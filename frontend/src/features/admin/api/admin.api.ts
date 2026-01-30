import type { components } from "@api-types/openapi";
import { api } from "../../../shared/api/api";

type UserRequest = components["schemas"]["UserBody"];

type UserResponse = components["schemas"]["FullUserResponse"];
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

export const updateUser = (userId: number, payload: UserRequest) => {
  return api.put<UserResponse>(`/admin/users/${userId}`, payload);
};
