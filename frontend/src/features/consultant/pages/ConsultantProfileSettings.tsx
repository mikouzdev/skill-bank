import { Divider, Typography, Container } from "@mui/material";
import EditableProfileHeader from "../components/ProfileHeader/EditableProfileHeader";
import { useConsultantDetails } from "../hooks/useConsultantDetails";
import PersonalProjects from "../components/PersonalProjects/PersonalProjectsSection";
import Skills from "../components/Skills/SkillsSection";

export default function ConsultantProfileSettings() {
  const { consultant, skills, employments, projects, loading } =
    useConsultantDetails(1);

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
      {/* todo: editable skills section */}
      <Skills data={skills} editable />
      {/* todo: editable professional experience section */}
      <PersonalProjects skillData={skills} data={projects} editable />
    </Container>
  );
}
