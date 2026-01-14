import { api } from "../../../shared/api/api";
import type { components } from "@api-types/openapi";

type ConsultantResponse = components["schemas"]["ConsultantResponse"];
type EmploymentListResponse = components["schemas"]["EmploymentListResponse"];
type ProjectListResponse = components["schemas"]["GetProjectsResponse"];
type ProjectRequest = Partial<components["schemas"]["Project"]>;
type SkillRequest = Pick<
  components["schemas"]["ConsultantSkill"],
  "proficiency"
>;

// type used for the updating of consultant profile details
export type UpdateConsultantData = Partial<ConsultantResponse>;

// temp workaround, todo: use shared type
import { type SkillsResponse } from "../types/types";

export const getConsultant = (id: number) => {
  return api.get<ConsultantResponse>(`/consultants/${id}`);
};

export const getConsultants = () => {
  return api.get<ConsultantResponse[]>(`/consultants/`);
};



export const getEmployments = (id: number) => {
  return api.get<EmploymentListResponse>(`/consultants/${id}/employments`);
};

export const getProjects = (id: number) => {
  return api.get<ProjectListResponse>(`/consultants/${id}/projects`);
};

export const updateProject = (projectData: ProjectRequest) => {
  return api.put<ProjectListResponse[number]>(
    `/consultants/me/projects/${projectData.id}`,
    projectData
  );
};

export const deleteProject = (id: number) => {
  return api.delete(`/consultants/me/projects/${id}`);
};

export const postProjects = (formData: ProjectListResponse) => {
  return api.post<ProjectListResponse>(`/consultants/me/projects`, formData);
};

export const postWorkExperience = (formData: EmploymentListResponse) => {
  return api.post<EmploymentListResponse>(
    `/consultants/me/employments`,
    formData
  );
};

export const getSkills = (id: number) => {
  return api.get<SkillsResponse>(`/consultants/skills/${id}`);
};

export const updateSkill = (id: number, profiency: SkillRequest) => {
  return api.put(`/consultants/skills/me/${id}`, profiency);
};

export const deleteSkill = (id: number) => {
  return api.delete(`/consultants/skills/me/${id}`);
};

export const updateProfile = (formData: UpdateConsultantData | FormData) => {
  return api.put("/consultants/me", formData);
};
