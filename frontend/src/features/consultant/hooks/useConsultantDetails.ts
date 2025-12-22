import { useConsultant } from "./useConsultant";
import { useConsultantEmployments } from "./useConsultantEmployments";
import { useConsultantProjects } from "./useConsultantProjects";

export function useConsultantDetails(id: number) {
  const consultant = useConsultant(id);
  const employments = useConsultantEmployments(id);
  const projects = useConsultantProjects(id);

  return {
    consultant: consultant.data,
    employments: employments.data,
    projects: projects.data,
    loading: consultant.loading || employments.loading || projects.loading,
    error: consultant.error || employments.error || projects.error,
  };
}
