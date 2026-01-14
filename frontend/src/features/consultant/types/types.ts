// TODO: change to use shared types

export interface ConsultantProfileHeader {
  name: string;
  description: string;
  profilePictureUrl: string;
  attributes: UserAttribute[]; // phone, linkedin, github, gitlab
}

export interface UserAttribute {
  id: number;
  value: string;
  label: string;
  type: "TEXT" | "LINK";
}

export interface ConsultantProfessionalExperienceItem {
  id: number;
  employer: string;
  jobTitle: string;
  description: string;
  start: string;
  end?: string;
  employmentSkills: string[];
}

export interface ConsultantProfileProjectItem {
  id: number;
  name: string;
  description: string;
  start: string;
  end?: string;
  projectSkills: string[];
  projectLinks?: ProjectLink[];
}

export interface ProjectLink {
  id: number;
  url: string;
  label: string;
}

export type SkillsResponse = {
  id: number;
  consultantId: number;
  createdAt: string;
  skillName: string;
  proficiency: number;
  listPosition: number;
}[];

export interface FormedProjectData {
  name: string;
  description: string;
  start: string;
  end: string;
  visibility: string;
}

export interface FormedWorkData {
  companyName: string;
  description: string;
  start: string;
  end: string;
  visibility: string;
  jobTitle: string;
}
