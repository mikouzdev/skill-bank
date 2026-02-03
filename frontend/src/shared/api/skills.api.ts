import type { components } from "@api-types/openapi";
import { api } from "./api";

type SkillTagResponse = components["schemas"]["SkillTagList"];
type PatchSkillTagBody = components["schemas"]["PatchSkillTagBody"];
type SkillTag = components["schemas"]["SkillTag"];
type PostSkillTagBody = components["schemas"]["PostSkillTagBody"];

export const createSkillTag = (payload: PostSkillTagBody) => {
  return api.post<SkillTag>("/skills", payload);
};

export const getSkillTags = () => {
  return api.get<SkillTagResponse>("/skills");
};

export const updateSkillTag = (
  skillName: string,
  payload: PatchSkillTagBody
) => {
  return api.patch<SkillTag>(`/skills/${skillName}`, payload);
};

export const deleteSkillTag = (skillName: string) => {
  return api.delete(`/skills/${skillName}`);
};
