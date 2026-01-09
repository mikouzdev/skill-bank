import { Box, Typography, Stack } from "@mui/material";
import PersonalProjectItem from "./PersonalProjectItem";
import { postProjects } from "../../api/consultants.api";
import { AddNewProject } from "./PersonalProjectAdd";

import type { components } from "@api-types/openapi";

type ConsultantProjectList = components["schemas"]["GetProjectsResponseSchema"];
import { type SkillsResponse } from "../../types/types";

type Props = {
  data: ConsultantProjectList;
  skillData: SkillsResponse;
};

export interface FormedData {
  name: string;
  description: string;
  start: string;
  end: string;
  visibility: string;
}

export default function PersonalProjects({ data, skillData }: Props) {
  async function addProject(formData: FormedData) {
    try {
      await postProjects({
        name: formData.name,
        description: formData.description,
        start: formData.start,
        end: formData.end,
        visibility: formData.visibility,
        projectLinks: [],
      });
    } catch {
      return;
    }
  }

  return (
    <Box
      sx={{
        p: 2,
      }}
    >
      <Stack spacing={1} sx={{ maxWidth: 1200 }}>
        <Typography variant="h5">
          Personal Projects{" "}
          <AddNewProject
            update={addProject}
            skilldata={skillData}
          ></AddNewProject>
        </Typography>
        <Stack spacing={1}>
          {data.map((item) => (
            <PersonalProjectItem key={item.id} item={item} />
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}
