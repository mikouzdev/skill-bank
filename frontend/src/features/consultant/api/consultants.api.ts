import { api } from "../../../shared/api/api";
import type { components } from "@api-types/openapi";

type ConsultantResponse = components["schemas"]["ConsultantResponse"];
type EmploymentListResponse = components["schemas"]["EmploymentListResponse"];
type ProjectListResponse = components["schemas"]["GetProjectsResponse"];
type ProjectRequest = Partial<
  components["schemas"]["GetProjectsResponse"][number]
>;
type ProjectSkillResponse = components["schemas"]["ProjectSkillOutput"];
type SkillRequest = Partial<components["schemas"]["ConsultantSkill"]>;
type SkillResponse = components["schemas"]["ConsultantSkill"];
type SkillTagResponse = components["schemas"]["SkillTagList"];
type Employment = Partial<EmploymentListResponse[number]>;

// type used for the updating of consultant profile details
export type UpdateConsultantData = Partial<ConsultantResponse>;

export const getConsultant = (id: number) => {
  return api.get<ConsultantResponse>(`/consultants/${id}`);
};

export const getConsultants = () => {
  return api.get<ConsultantResponse[]>(`/consultants/`);
};

export const searchConsultants = (consultantName: string) => {
  return api.get<ConsultantResponse[]>(
    `/consultants/search?consultantName=${consultantName}`
  );
};

export const filterConsultants = (freeText: string) => {
  return api.get<ConsultantResponse[]>(
    `/consultants/filter?freeText=${freeText}`
  );
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

export const postProjects = (formData: ProjectRequest) => {
  return api.post<ProjectListResponse[number]>(
    `/consultants/me/projects`,
    formData
  );
};

export const addProjectSkill = (id: number, skill: string) => {
  return api.post<ProjectSkillResponse>(
    `/consultants/me/projects/${id}/skills`,
    {
      skillTagName: skill,
    }
  );
};

export const postWorkExperience = (formData: Employment) => {
  return api.post<Employment>(`/consultants/me/employments`, formData);
};

export const updateEmployment = (employmentData: Employment) => {
  return api.put<EmploymentListResponse[number]>(
    `/consultants/me/employments/${employmentData.id}`,
    employmentData
  );
};

export const deleteEmployment = (id: number) => {
  return api.delete(`/consultants/me/employments/${id}`);
};

export const addEmploymentSkill = (id: number, skillName: string) => {
  return api.post(`/consultants/me/employments/${id}/skills`, {
    skillTagName: skillName,
  });
};

export const deleteEmploymentSkill = (
  employmentId: number,
  employmentSkillId: number
) => {
  return api.delete(
    `/consultants/me/employments/${employmentId}/skills/${employmentSkillId}`
  );
};

// all available skills for consultant to use
export const getSkillTags = () => {
  return api.get<SkillTagResponse>("/consultants/skills/all");
};

export const getSkills = (id: number) => {
  return api.get<SkillResponse[]>(`/consultants/skills/${id}`);
};

export const addSkill = (skill: SkillRequest) => {
  return api.post<SkillResponse>(`/consultants/skills/me`, skill);
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

type AttributeResponse = components["schemas"]["GetAttributesResponse"];

export const getAttributes = (id: number) => {
  return api.get<AttributeResponse>(`/consultants/${id}/attributes`);
};
