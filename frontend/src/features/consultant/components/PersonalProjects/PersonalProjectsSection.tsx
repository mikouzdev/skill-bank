import { Box, Typography, Stack } from "@mui/material";
import PersonalProjectItem from "./PersonalProjectItem";

import type { components } from "@api-types/openapi";

type ConsultantProjectList = components["schemas"]["GetProjectsResponseSchema"];

type Props = {
  data: ConsultantProjectList;
};

export default function PersonalProjects({ data }: Props) {
  return (
    <Box
      sx={{
        p: 2,
      }}
    >
      <Stack spacing={1} sx={{ maxWidth: 1200 }}>
        <Typography variant="h5">Personal Projects</Typography>
        <Stack spacing={1}>
          {data.map((item) => (
            <PersonalProjectItem key={item.id} item={item} />
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}
