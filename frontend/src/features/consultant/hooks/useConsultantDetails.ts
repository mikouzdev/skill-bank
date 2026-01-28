import { useConsultantAttributes } from "./useAttributes";
import { useConsultant } from "./useConsultant";
import { useConsultantEmployments } from "./useConsultantEmployments";
import { useConsultantProjects } from "./useConsultantProjects";
import { useConsultantSkills } from "./useConsultantSkills";

export function useConsultantDetails(id: number) {
  const consultant = useConsultant(id);
  const employments = useConsultantEmployments(id);
  const projects = useConsultantProjects(id);
  const skills = useConsultantSkills(id);
  const attributes = useConsultantAttributes(id);

  return {
    consultant: consultant.data,
    employments: employments.data,
    projects: projects.data,
    skills: skills.data,
    attributes: attributes.data,
    loading: consultant.loading || employments.loading || projects.loading,
    error: consultant.error || employments.error || projects.error,
  };
}
