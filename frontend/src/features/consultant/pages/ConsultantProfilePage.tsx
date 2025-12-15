import { Box } from "@mui/material";
import ProfileHeader from "../components/ProfileHeader";
import Skills from "../components/Skills/SkillsSection";
import PersonalProjects from "../components/PersonalProjects/PersonalProjectsSection";
import ProfessionalExperience from "../components/ProfessionalExperience/ProfessionalExperienceSection";

export default function ConsultantProfilePage() {
  return (
    <Box
      sx={{ p: 2, border: 1, display: "flex", flexDirection: "column", gap: 1 }}
    >
      <ProfileHeader />
      <Skills />
      <ProfessionalExperience />
      <PersonalProjects />
    </Box>
  );
}
