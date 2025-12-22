import { Box, Typography, Stack, Chip, Paper } from "@mui/material";
import type { components } from "@api-types/openapi";

type ConsultantEmploymentItem =
  components["schemas"]["EmploymentListResponse"][number];

type Props = {
  item: ConsultantEmploymentItem;
};

export default function ProfessionalExperienceItem({ item }: Props) {
  const skills = item.skills.map((skill, i) => (
    <Chip key={i} label={skill.name} color="primary" size="small" />
  ));

  return (
    <Paper
      elevation={1}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        p: 2,
      }}
    >
      <Stack direction={"row"} spacing={"auto"}>
        <Typography variant="h6">{`${item.employer}, ${item.jobTitle}`}</Typography>
        <Typography variant="h6">{`${item.start} - ${
          item.end ?? ""
        }`}</Typography>
      </Stack>
      <Box>
        <Typography>{item.description}</Typography>
      </Box>
      <Stack direction={"row"} spacing={1}>
        {skills}
      </Stack>
    </Paper>
  );
}
