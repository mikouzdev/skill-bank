import {
  Box,
  Typography,
  Stack,
  FormControlLabel,
  Switch,
} from "@mui/material";
import PersonalProjectItem from "./PersonalProjectItem";
import { addProjectSkill, postProjects } from "../../api/consultants.api";
import { AddNewProject } from "./PersonalProjectAdd";

import type { components } from "@api-types/openapi";

type ConsultantProjectList = components["schemas"]["GetProjectsResponse"];
type Project = Partial<components["schemas"]["Project"]>;
type SkillsResponse = components["schemas"]["SkillTagList"];
type ProjectSkill = Pick<components["schemas"]["ProjectSkill"], "skillTagName">;

type Props = {
  data: ConsultantProjectList;
  skillData: SkillsResponse;
  editable?: boolean;
};

export default function PersonalProjects({ data, skillData, editable }: Props) {
  async function addProject(formData: Project, skills: ProjectSkill[]) {
    try {
      // post project first
      const response = await postProjects(formData);

      // after project is posted, post skills to it one by one.
      if (skills && skills.length > 0 && response.data?.id) {
        const projectId = response.data.id;
        for (const skill of skills) {
          await addProjectSkill(projectId, skill.skillTagName);
        }
      }
    } catch (error) {
      console.log("Failed to add personal project:", error);
      return;
    }
  }

  const defaultSection = (
    <>
      <Stack direction={"row"} gap={2}>
        <Typography variant="h5">Personal Projects</Typography>
        <AddNewProject
          update={(formData, skills) => {
            void addProject(formData, skills);
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
          update={(formData, skills) => {
            void addProject(formData, skills);
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
