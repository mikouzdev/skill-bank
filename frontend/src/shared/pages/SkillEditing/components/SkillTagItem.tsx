import type { components } from "@api-types/openapi";
import { IconButton, Stack, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

type SkillTag = components["schemas"]["SkillTag"];

interface Props {
  skill: SkillTag;
  onDelete: (skillName: string) => Promise<void>;
}

export default function SkillTagItem({ skill, onDelete }: Props) {
  if (skill.id === undefined)
    return <Typography>Failed to display skill</Typography>;

  return (
    <Stack direction={"row"} alignItems={"center"} spacing={1}>
      <IconButton onClick={() => void onDelete(skill.name)}>
        <DeleteIcon color="error" />
      </IconButton>
      <Typography>{skill.name}</Typography>
    </Stack>
  );
}
