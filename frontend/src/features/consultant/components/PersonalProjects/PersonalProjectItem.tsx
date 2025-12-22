import { Box, Typography, Stack, Chip, Paper } from "@mui/material";
import dayjs from "dayjs";

import type { components } from "@api-types/openapi";

type ConsultantProject =
  components["schemas"]["GetProjectsResponseSchema"][number];

type Props = {
  item: ConsultantProject;
};

// in what format are the start and end times shown
const DATE_FORMAT = "MM/YYYY";

export default function PersonalProjectItem({ item }: Props) {
  const projectLinks = item.projectLinks.map((link, i) => (
    <Chip
      key={i}
      label={link.label}
      color="primary"
      size="small"
      clickable
      component="a"
      href={link.url}
      target="_blank"
    />
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
        <Typography variant="h6">{`${item.name}`}</Typography>
        <Typography variant="h6">{`${dayjs(item.start).format(DATE_FORMAT)} - ${
          item.end ? dayjs(item.end).format(DATE_FORMAT) : ""
        }`}</Typography>
      </Stack>
      <Box>
        <Typography>{item.description}</Typography>
      </Box>
      <Stack direction={"row"} spacing={1}>
        {projectLinks}
      </Stack>
    </Paper>
  );
}
