import { Divider, Typography, Container } from "@mui/material";
import ProfileHeader from "../components/ProfileHeader/ProfileHeader";
import Skills from "../components/Skills/SkillsSection";
import PersonalProjects from "../components/PersonalProjects/PersonalProjectsSection";
import ProfessionalExperience from "../components/ProfessionalExperience/ProfessionalExperienceSection";
import { useConsultantDetails } from "../hooks/useConsultantDetails";

export default function ConsultantProfilePage() {
  const { consultant, skills, employments, projects, loading } =
    useConsultantDetails(7);

  if (loading) return <Typography>Loading...</Typography>;
  if (!employments || !consultant || !projects || !skills)
    return <Typography>Error while fetching data.</Typography>;

  return (
    <Container
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      <ProfileHeader data={consultant} />
      <Divider />
      <Skills data={skills} />
      <Divider />
      <ProfessionalExperience data={employments} />
      <Divider />
      <PersonalProjects data={projects} skillData={skills} />
    </Container>
  );
}
