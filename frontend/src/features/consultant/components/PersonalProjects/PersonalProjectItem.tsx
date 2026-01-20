import { Box, Typography, Stack, Chip, Paper } from "@mui/material";
import dayjs from "dayjs";

import type { components } from "@api-types/openapi";
import PersonalProjectEdit from "./PersonalProjectEdit";

type ConsultantProject = components["schemas"]["GetProjectsResponse"][number];

type Props = {
  item: ConsultantProject;
  editable?: boolean;
};

// in what format are the start and end times shown
const DATE_FORMAT = "MM/YYYY";

export default function PersonalProjectItem({ item, editable }: Props) {
  const projectLinks = item.projectLinks.map((link, i) => (
    <Chip
      key={i}
      label={link.label}
      color="secondary"
      size="small"
      clickable
      component="a"
      href={link.url}
      target="_blank"
      variant="outlined"
    />
  ));

  const projectSkills = item.projectSkills.map((skill, i) => (
    <Chip
      key={i}
      label={skill.skillTagName}
      color="primary"
      variant="outlined"
      size="small"
    />
  ));

  const editOnlyButtons = editable && (
    <Stack direction={"row"} spacing={1}>
      <PersonalProjectEdit projectData={item} />
    </Stack>
  );

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
      <Stack direction="row">
        {/* bottom left container */}
        <Stack
          direction="column"
          width="100%"
          alignItems="flex-start"
          spacing={1}
        >
          <Stack
            spacing={1}
            direction="row"
            flex={1}
            justifyContent="flex-start"
            alignItems="flex-end"
          >
            {projectLinks}
          </Stack>

          <Stack
            spacing={1}
            direction="row"
            flex={1}
            justifyContent="flex-start"
            alignItems="flex-end"
          >
            {projectSkills}
          </Stack>
        </Stack>
        {/* bottom right container */}
        <Stack
          flex={1}
          direction="row"
          justifyContent="flex-end"
          alignItems="flex-start"
        >
          {editOnlyButtons}
        </Stack>
      </Stack>
    </Paper>
  );
}
