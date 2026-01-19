import { useConsultantDetails } from "../hooks/useConsultantDetails";
import { Divider, Typography, Container } from "@mui/material";
import EditableProfileHeader from "../components/ProfileHeader/EditableProfileHeader";
import PersonalProjects from "../components/PersonalProjects/PersonalProjectsSection";
import Skills from "../components/Skills/SkillsSection";
import EditableExternalLinks from "../components/ExternalLinks/EditableExternalLinks";
import ProfessionalExperience from "../components/ProfessionalExperience/ProfessionalExperienceSection";
import { useSkills } from "../hooks/useSkills";

export default function ConsultantProfileSettings() {
  const { consultant, skills, employments, projects, loading } =
    useConsultantDetails(1);

  const { skillPool } = useSkills();

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
      <EditableProfileHeader data={consultant} />
      <Divider />
      {/* todo: external links */}
      {/* Consultant has no external links yet. */}
      {/* Placeholder. */}
      <EditableExternalLinks links={[""]}></EditableExternalLinks>
      <Divider />
      <Skills data={skills} editable />
      <ProfessionalExperience
        data={employments}
        skillData={skillPool}
        editable
      />
      <PersonalProjects skillData={skills} data={projects} editable />
    </Container>
  );
}
