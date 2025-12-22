import { Box, Typography, Stack } from "@mui/material";
import ProfessionalExperienceItem from "./ProfessionalExperienceItem";
import type { components } from "@api-types/openapi";

type ConsultantEmploymentList = components["schemas"]["EmploymentListResponse"];

type Props = {
  data: ConsultantEmploymentList;
};

export default function ProfessionalExperience({ data }: Props) {
  return (
    <Box
      sx={{
        p: 2,
      }}
    >
      <Stack spacing={1} sx={{ maxWidth: 1200 }}>
        <Typography variant="h5">Professional Experience</Typography>
        <Stack spacing={1}>
          {data.map((item, i) => (
            <ProfessionalExperienceItem key={i} item={item} />
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}
