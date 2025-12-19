import { Container, Divider } from "@mui/material";
import ProfileHeader from "../components/ProfileHeader/ProfileHeader";
import Skills from "../components/Skills/SkillsSection";
import PersonalProjects from "../components/PersonalProjects/PersonalProjectsSection";
import ProfessionalExperience from "../components/ProfessionalExperience/ProfessionalExperienceSection";
import type { ConsultantProfileHeader } from "../types/types";

export default function ConsultantProfilePage() {
  const mockupData: ConsultantProfileHeader = {
    profilePictureUrl: "https://placehold.co/320x320",
    name: "John Doe",
    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
    attributes: [
      { id: 1, value: "1234567890", label: "phone", type: "TEXT" },
      {
        id: 2,
        value: "https://www.linkedin.com/",
        label: "linkedin",
        type: "LINK",
      },
      { id: 3, value: "https://github.com/", label: "github", type: "LINK" },
      { id: 4, value: "https://gitlab.com/", label: "gitlab", type: "LINK" },
      {
        id: 5,
        value: "john.doe@gmail.com",
        label: "email",
        type: "LINK",
      },
    ],
  };

  return (
    <Container
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      <ProfileHeader data={mockupData} />
      <Divider />
      <Skills />
      <Divider />
      <ProfessionalExperience />
      <Divider />
      <PersonalProjects />
    </Container>
  );
}
