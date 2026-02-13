import { Divider, Typography, Container } from "@mui/material";
import { useConsultantDetails } from "../../features/consultant/hooks/useConsultantDetails";
import ProfileHeader from "../../features/consultant/components/ProfileHeader/ProfileHeader";
import Skills from "../../features/consultant/components/Skills/SkillsSection";
import ProfessionalExperience from "../../features/consultant/components/ProfessionalExperience/ProfessionalExperienceSection";
import PersonalProjects from "../../features/consultant/components/PersonalProjects/PersonalProjectsSection";
import { useParams } from "react-router-dom";

export default function ConsultantProfileForOthers() {
  const { id } = useParams();
  const consultantId = Number(id);

  const { consultant, skills, employments, projects, attributes, loading } =
    useConsultantDetails(consultantId);

  if (loading) return <Typography>Loading...</Typography>;

  if (!consultant) return <Typography>Consultant not found</Typography>;

  if (!attributes || !skills || !employments || !projects)
    return <Typography>Error fetching consultant data</Typography>;

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
      <Skills data={skills} />
      <Divider />
      <ProfessionalExperience data={employments} />
      <Divider />
      <PersonalProjects data={projects} />
    </Container>
  );
}
