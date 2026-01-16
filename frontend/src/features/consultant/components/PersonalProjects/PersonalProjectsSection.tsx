import {
  Box,
  Typography,
  Stack,
  FormControlLabel,
  Switch,
} from "@mui/material";
import PersonalProjectItem from "./PersonalProjectItem";
import { postProjects } from "../../api/consultants.api";
import { AddNewProject } from "./PersonalProjectAdd";

import type { components } from "@api-types/openapi";

type ConsultantProjectList = components["schemas"]["GetProjectsResponse"];
type Project = Partial<components["schemas"]["Project"]>;
type SkillsResponse = components["schemas"]["ConsultantSkill"];

type Props = {
  data: ConsultantProjectList;
  skillData: SkillsResponse[];
  editable?: boolean;
};

export default function PersonalProjects({ data, skillData, editable }: Props) {
  async function addProject(formData: Project) {
    try {
      await postProjects(formData);
    } catch {
      return;
    }
  }

  const defaultSection = (
    <>
      <Stack direction={"row"} gap={2}>
        <Typography variant="h5">Personal Projects</Typography>
        <AddNewProject
          update={(formData) => {
            void addProject(formData);
          }}
          skillData={skillData}
        ></AddNewProject>
      </Stack>
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
          update={(formData) => {
            void addProject(formData);
          }}
          skillData={skillData}
        ></AddNewProject>
        <FormControlLabel
          control={<Switch defaultChecked />}
          label="Section is visible to ohter consultants"
        />
      </Stack>
      <Stack spacing={1}>
        {data.map((item) => (
          <>
            <PersonalProjectItem key={item.id} item={item} editable />
          </>
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
