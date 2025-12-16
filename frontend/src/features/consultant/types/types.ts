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
