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
