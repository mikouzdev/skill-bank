import { api } from "../../../shared/api/api";
import type { components } from "@api-types/openapi";

type ConsultantResponse = components["schemas"]["ConsultantResponse"];
type EmploymentListResponse = components["schemas"]["EmploymentListResponse"];
type ProjectListResponse = components["schemas"]["GetProjectsResponseSchema"];

// temp workaround, todo: use shared type
import { type SkillsResponse } from "../types/types";

export const getConsultant = (id: number) => {
  return api.get<ConsultantResponse>(`/consultants/${id}`);
};

export const getEmployments = (id: number) => {
  return api.get<EmploymentListResponse>(`/consultants/${id}/employments`);
};

export const getProjects = (id: number) => {
  return api.get<ProjectListResponse>(`/consultants/${id}/projects`);
};

export const getSkills = (id: number) => {
  return api.get<SkillsResponse>(`/skill/${id}`);
};
