import { Divider, Typography, Container } from "@mui/material";
import ProfileHeader from "../components/ProfileHeader/ProfileHeader";
import Skills from "../components/Skills/SkillsSection";
import PersonalProjects from "../components/PersonalProjects/PersonalProjectsSection";
import ProfessionalExperience from "../components/ProfessionalExperience/ProfessionalExperienceSection";
import { useConsultantDetails } from "../hooks/useConsultantDetails";
import { useSkills } from "../hooks/useSkills";
import { useAuth } from "../../../app/hooks/useAuth";

export default function ConsultantProfilePage() {
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
      <ProfileHeader data={consultant} attributes={attributes} />
      <Divider />
      <Skills data={skills} skillData={skillPool} />
      <Divider />
      <ProfessionalExperience data={employments} skillData={skillPool} />
      <Divider />
      <PersonalProjects data={projects} skillData={skillPool} />
    </Container>
  );
}
