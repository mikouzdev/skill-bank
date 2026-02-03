import { Box, Typography, Stack } from "@mui/material";
import PersonalProjectItem from "./PersonalProjectItem";
import { addProjectSkill, postProjects } from "../../api/consultants.api";
import { AddNewProject } from "./PersonalProjectAdd";

import type { components } from "@api-types/openapi";
import { useState } from "react";
import SectionVisibilitySwitch from "../../../../shared/components/SectionVisibilitySwitch";

type ConsultantProjectList = components["schemas"]["GetProjectsResponse"];
type Project = Partial<components["schemas"]["GetProjectsResponse"][number]>;

type SkillsResponse = components["schemas"]["SkillTagList"];
type ProjectSkill = Pick<components["schemas"]["ProjectSkill"], "skillTagName">;

type Props = {
  data: ConsultantProjectList;
  skillData: SkillsResponse;
  editable?: boolean;
};

export default function PersonalProjects({ data, skillData, editable }: Props) {
  const [projects, setProjects] = useState<ConsultantProjectList>(data || []);

  async function addProject(formData: Project, skills: ProjectSkill[]) {
    try {
      // post project first
      const response = await postProjects({ ...formData, projectSkills: [] });

      // used for local state
      const addedProject: ConsultantProjectList[number] = {
        ...response.data,
        projectSkills: [],
        projectLinks: [],
      };

      // after project is posted, post skills to it one by one.
      if (skills && skills.length > 0 && response.data?.id) {
        const projectId = response.data.id;

        for (const skill of skills) {
          const skillResponse = await addProjectSkill(
            projectId,
            skill.skillTagName
          );

          // add skill to addedProject (for local state)
          addedProject.projectSkills.push(skillResponse.data);
        }
      }
      // update local state
      setProjects((prev) => [...prev, addedProject]);
    } catch (error) {
      console.log("Failed to add personal project:", error);
      return;
    }
  }

  function handleDelete(id: number) {
    setProjects((prev) => prev.filter((proj) => proj.id !== id));
  }

  function handleUpdate(project: Project) {
    setProjects((prev) =>
      prev.map((proj) =>
        proj.id === project.id ? { ...proj, ...project } : proj
      )
    );
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
        />
      </Stack>
      <Stack spacing={1}>
        {projects.map((item) => (
          <PersonalProjectItem
            key={item.id}
            item={item}
            skillData={skillData}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
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
        />
        <SectionVisibilitySwitch
          sectionData={{ name: "PROJECTS", visibility: "PUBLIC" }}
        />
      </Stack>
      <Stack spacing={1}>
        {projects.map((item) => (
          <>
            <PersonalProjectItem
              key={item.id}
              item={item}
              skillData={skillData}
              editable
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
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
