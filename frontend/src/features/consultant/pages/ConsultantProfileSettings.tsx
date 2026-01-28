import { useConsultantDetails } from "../hooks/useConsultantDetails";
import { Divider, Typography, Container } from "@mui/material";
import EditableProfileHeader from "../components/ProfileHeader/EditableProfileHeader";
import PersonalProjects from "../components/PersonalProjects/PersonalProjectsSection";
import Skills from "../components/Skills/SkillsSection";
import EditableExternalLinks from "../components/ExternalLinks/EditableExternalLinks";
import ProfessionalExperience from "../components/ProfessionalExperience/ProfessionalExperienceSection";
import { useSkills } from "../hooks/useSkills";
import { useAuth } from "../../../app/hooks/useAuth";

export default function ConsultantProfileSettings() {
  const { currentUser, isLoading } = useAuth();
  const consultantId = currentUser?.consultantId || 0;
  const { skillPool } = useSkills();
  const { consultant, skills, employments, projects, attributes, loading } =
    useConsultantDetails(consultantId);

  if (isLoading) return <Typography>Loading user</Typography>;

  if (!consultantId) return <Typography>Profile not found</Typography>;

  if (loading) return <Typography>Loading...</Typography>;

  if (!consultant || !attributes || !skills || !employments || !projects)
    return <Typography>Error fetching data</Typography>;

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
      <Skills data={skills} skillData={skillPool} editable />
      <ProfessionalExperience
        data={employments}
        skillData={skillPool}
        editable
      />
      <PersonalProjects skillData={skillPool} data={projects} editable />
    </Container>
  );
}
