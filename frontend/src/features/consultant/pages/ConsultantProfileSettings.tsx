import { Divider, Typography, Container } from "@mui/material";
import EditableProfileHeader from "../components/ProfileHeader/EditableProfileHeader";
import { useConsultantDetails } from "../hooks/useConsultantDetails";

export default function ConsultantProfileSettings() {
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
      <EditableProfileHeader data={consultant} />
      <Divider />
      {/* todo: editable skills section */}
      {/* todo: editable professional experience section */}
      {/* todo: editable personal projects section */}
    </Container>
  );
}
