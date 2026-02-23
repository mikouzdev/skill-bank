import { Box, Typography, Rating, IconButton, Stack } from "@mui/material";
import Circle from "@mui/icons-material/Circle";
import CircleIcon from "@mui/icons-material/Circle";
import DeleteIcon from "@mui/icons-material/Delete";

import type { components } from "@api-types/openapi";
import { addSkill, deleteSkill, updateSkill } from "../../api/consultants.api";
import { useSnackbar } from "../../../../shared/components/useSnackbar";
import { useState } from "react";
import AddSkillDialog from "./AddSkillDialog";
import AddCommentButton from "../../../sales/components/AddCommentButton";

type ConsultantSkill = components["schemas"]["ConsultantSkill"];
type SkillsResponse = components["schemas"]["SkillTagList"];
type SkillCategories = components["schemas"]["SkillCategories"];

type SkillTag = components["schemas"]["SkillTag"];
type SkillRequest = Partial<components["schemas"]["ConsultantSkill"]>;

type Props = {
  skillData?: SkillsResponse; // all skills
  categoryData?: SkillCategories; // skill categories
  data: ConsultantSkill[]; // skills used by the consultant
  editable?: boolean;
};

export default function Skills({
  skillData,
  categoryData,
  data,
  editable,
}: Props) {
  const { showError, showSuccess } = useSnackbar();
  const [skills, setSkills] = useState<ConsultantSkill[]>(data); // consultant skills

  async function handleAddSkill(
    selectedSkill: SkillTag,
    profiency: number
  ): Promise<boolean> {
    try {
      // skill payload
      const newSkill: SkillRequest = {
        skillName: selectedSkill.name,
        proficiency: profiency,
      };

      // just to see the loading icon :)
      await new Promise((res) => setTimeout(res, 250));

      const response = await addSkill(newSkill);
      setSkills((prev) => [...prev, response.data]);
      showSuccess("Skill added to profile.");
      return true;
    } catch (error) {
      console.log(error);
      showError("Failed to add skill. Skill is probably already added.");
      return false;
    }
  }

  async function handleUpdateSkill(id: number, newProficiency: number | null) {
    if (newProficiency === null) return;
    try {
      const payload = {
        proficiency: newProficiency,
      };

      await updateSkill(id, payload);

      // update local state as well
      setSkills((prev) =>
        prev.map((skill) =>
          skill.id === id ? { ...skill, proficiency: newProficiency } : skill
        )
      );
    } catch (error) {
      console.log("error while updating skill: ", error);
      showError("Failed to update skill.");
    }
  }

  async function handleDeleteSkill(id: number) {
    try {
      await deleteSkill(id);
      setSkills((prev) => prev.filter((skill) => skill.id !== id)); // updates local state aswell
    } catch (error) {
      console.log("error while deleting skill: ", error);
      showError("Failed to delete skill.");
    }
  }

  const deleteButton = (id: number) => (
    <IconButton
      sx={{ border: 1, borderColor: "rgba(0,0,0,0.2)" }}
      size="small"
      onClick={() => void handleDeleteSkill(id)}
    >
      <DeleteIcon color="error" />
    </IconButton>
  );

  return (
    <Box sx={{ p: 2 }}>
      <Stack direction={"row"} spacing={2} mb={1}>
        <Typography variant="h5">Skills</Typography>
        {editable && skillData && categoryData && (
          <AddSkillDialog
            skillData={skillData}
            categoryData={categoryData}
            onSubmit={handleAddSkill}
          />
        )}
        <AddCommentButton label="Add comment" section="SKILLS" />
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateRows: "repeat(3, 1fr)",
          gridAutoFlow: "column",
          gridAutoColumns: "max-content",
          columnGap: 4,
          rowGap: 1,
        }}
      >
        {skills.map((skill) => {
          return (
            <Stack
              key={skill.id}
              direction="row"
              alignItems="center"
              minWidth={275}
              spacing="auto"
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                {editable && deleteButton(skill.id)}
                <Typography>{skill.skillName}</Typography>
              </Stack>
              <Rating
                name="hover-feedback"
                value={skill.proficiency}
                precision={1}
                icon={<CircleIcon fontSize="inherit" />}
                sx={{
                  color: "rgba(34, 130, 255, 1)",
                }}
                emptyIcon={
                  <Circle style={{ opacity: 0.55 }} fontSize="inherit" />
                }
                onChange={(_event, value) => {
                  void handleUpdateSkill(skill.id, value);
                }}
                readOnly={!editable}
              />
            </Stack>
          );
        })}
      </Box>
    </Box>
  );
}
