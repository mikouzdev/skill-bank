import type { components } from "@api-types/openapi";
import { api } from "./api";

type SkillCategories = components["schemas"]["SkillCategories"];
type SkillCategoryBody = components["schemas"]["skillCategoryBody"];
type SkillCategory = components["schemas"]["skillCategory"];

export const createCategory = (payload: SkillCategoryBody) => {
  return api.post<SkillCategory>("/skills/categories", payload);
};

export const getCategories = () => {
  return api.get<SkillCategories>("/skills/categories");
};

export const updateCategory = (id: number, payload: SkillCategoryBody) => {
  return api.put<SkillCategory>(`/skills/categories/${id}`, payload);
};

export const deleteCategory = (id: number) => {
  return api.delete(`/skills/categories/${id}`);
};
