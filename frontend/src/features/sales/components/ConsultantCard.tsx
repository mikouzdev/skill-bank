import { Avatar, Box, Stack, Typography, Button, Paper } from "@mui/material";
import { useConsultantDetails } from "../../consultant/hooks/useConsultantDetails";
import SkillsBuilder from "./SkillsBuilder";

type Props = {
  consultantID: number;
};

export const ConsultantCard = ({ consultantID }: Props) => {
  const { consultant, skills, employments, projects, loading } =
    useConsultantDetails(consultantID);

  if (loading) return <Typography>Loading...</Typography>;
  if (!employments || !consultant || !projects || !skills)
    return <Typography>Error while fetching data.</Typography>;

  return (
    <>
      <Paper sx={{ p: 1 }}>
        <Stack direction="column" spacing={2}>
          <Stack direction="row" gap={4}>
            {/* picture, name, title */}
            <Stack direction={"row"} gap={2} alignItems={"center"}>
              <Avatar
                alt={consultant.user.name}
                src={consultant.profilePictureUrl}
              />
              <Stack direction={"column"}>
                <Typography>{consultant.user.name}</Typography>
                <Typography variant="body2">{consultant.roleTitle}</Typography>
              </Stack>
            </Stack>

            {/* professional exp */}
            <Stack direction={"column"} justifyContent={"center"}>
              <Typography>Professional Expereience</Typography>
              <Typography variant="body2">5+ years</Typography>
            </Stack>
            <SkillsBuilder data={skills} />
          </Stack>

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button size="small" type="submit">
              View profile
            </Button>
          </Box>
        </Stack>
      </Paper>
    </>
  );
};
