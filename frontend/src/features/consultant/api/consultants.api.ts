import { api } from "../../../shared/api/api";
import type { components } from "../../../../../shared/generated/api-types/openapi";

type ConsultantResponse = components["schemas"]["ConsultantResponse"];
type EmploymentListResponse = components["schemas"]["EmploymentListResponse"];

export const getConsultant = (id: number) => {
  return api.get<ConsultantResponse>(`/consultants/${id}`);
};

export const getEmployments = (id: number) => {
  return api.get<EmploymentListResponse>(`/consultants/${id}/employments`);
};
