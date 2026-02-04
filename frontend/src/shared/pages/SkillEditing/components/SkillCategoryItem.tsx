import type { components } from "@api-types/openapi";
import { IconButton, Stack, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

type SkillCategory = components["schemas"]["skillCategory"];

interface Props {
  category: SkillCategory;
  onDelete: (skillName: number) => Promise<void>;
}

export default function SkillCategoryItem({ category, onDelete }: Props) {
  if (category.id === undefined)
    return <Typography>Failed to display category</Typography>;

  return (
    <Stack direction={"row"} alignItems={"center"} spacing={1}>
      <IconButton onClick={() => void onDelete(category.id)}>
        <DeleteIcon color="error" />
      </IconButton>
      <Typography>{category.name}</Typography>
    </Stack>
  );
}
