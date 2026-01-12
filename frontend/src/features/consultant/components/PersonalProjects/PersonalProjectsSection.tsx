import { Box, Typography, Stack } from "@mui/material";
import PersonalProjectItem from "./PersonalProjectItem";
import { postProjects } from "../../api/consultants.api";
import { AddNewProject } from "./PersonalProjectAdd";

import type { components } from "@api-types/openapi";

type ConsultantProjectList = components["schemas"]["GetProjectsResponse"];
import { type SkillsResponse } from "../../types/types";

type Props = {
  data: ConsultantProjectList;
  skillData: SkillsResponse;
  editable?: boolean;
};

export interface FormedData {
  name: string;
  description: string;
  start: string;
  end: string;
  visibility: string;
}

export default function PersonalProjects({ data, skillData, editable }: Props) {
  async function addProject(formData: FormedData) {
    try {
      await postProjects({
        name: formData.name,
        description: formData.description,
        start: formData.start,
        end: formData.end,
        visibility: formData.visibility,
      });
    } catch {
      return;
    }
  }

  const defaultSection = (
    <>
      <Typography variant="h5">Personal Projects</Typography>
      <Stack spacing={1}>
        {data.map((item) => (
          <PersonalProjectItem key={item.id} item={item} />
        ))}
      </Stack>
    </>
  );

  const editableSection = (
    <>
      <Stack direction={"row"} gap={2}>
        <Typography variant="h5">Personal Projects</Typography>
        <AddNewProject
          update={addProject}
          skilldata={skillData}
        ></AddNewProject>
      </Stack>
      <Stack spacing={1}>
        {data.map((item) => (
          <PersonalProjectItem key={item.id} item={item} editable />
        ))}
      </Stack>
    </>
  );

  return (
    <Box
      sx={{
        p: 2,
      }}
    >
      {editable ? editableSection : defaultSection}
    </Box>
  );
}
