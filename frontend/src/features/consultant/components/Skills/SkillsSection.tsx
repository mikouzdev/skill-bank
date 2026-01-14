import {
  Box,
  Typography,
  Rating,
  Button,
  IconButton,
  Stack,
} from "@mui/material";
import Circle from "@mui/icons-material/Circle";
import CircleIcon from "@mui/icons-material/Circle";
import DeleteIcon from "@mui/icons-material/Delete";

import { type SkillsResponse } from "../../types/types";
import { useState } from "react";
import { deleteSkill, updateSkill } from "../../api/consultants.api";
import type { components } from "@api-types/openapi";

type SkillRequest = Pick<
  components["schemas"]["ConsultantSkill"],
  "proficiency"
>;

type Props = {
  data: SkillsResponse;
  editable?: boolean;
};

export default function Skills({ data, editable }: Props) {
  const [skills, setSkills] = useState<SkillsResponse>(data);

  async function handleUpdateSkill(id: number, newProficiency: number | null) {
    if (newProficiency === null) return;
    try {
      const payload: SkillRequest = {
        proficiency: newProficiency,
      };

      await updateSkill(id, payload);

      // update local state aswell
      setSkills((prev) =>
        prev.map((skill) =>
          skill.id === id ? { ...skill, proficiency: newProficiency } : skill
        )
      );
    } catch (error) {
      console.log("error while updating skill: ", error);
    }
  }

  async function handleDeleteSkill(id: number) {
    try {
      await deleteSkill(id);
      setSkills((prev) => prev.filter((skill) => skill.id !== id)); // updates local state aswell
    } catch (error) {
      console.log("error while deleting skill: ", error);
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
      <Typography variant="h5">
        Skills
        <Button>Add new Skill</Button>
      </Typography>

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
