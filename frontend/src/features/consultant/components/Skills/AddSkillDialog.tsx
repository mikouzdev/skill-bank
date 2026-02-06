import type { components } from "@api-types/openapi";
import {
  Button,
  Dialog,
  DialogTitle,
  MenuItem,
  Rating,
  Select,
  Stack,
  Typography,
  type SelectChangeEvent,
} from "@mui/material";
import { useState } from "react";
import { Circle } from "@mui/icons-material";
import CircleIcon from "@mui/icons-material/Circle";

type SkillTagList = components["schemas"]["SkillTagList"];
type SkillTag = components["schemas"]["SkillTag"];

type SkillCategories = components["schemas"]["SkillCategories"];
type SkillCategory = components["schemas"]["skillCategory"];

type Props = {
  skillData: SkillTagList;
  categoryData: SkillCategories;
  onSubmit: (skill: SkillTag, profiency: number) => Promise<boolean>;
};

export default function AddSkillDialog({
  skillData,
  categoryData,
  onSubmit,
}: Props) {
  const [skills, setSkills] = useState<SkillTagList>(skillData || []);
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory>();
  const [selectedSkill, setSelectedSkill] = useState<SkillTag>();
  const [profiency, setProfiency] = useState<number>(3);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  function handleChange(e: SelectChangeEvent) {
    const newSelected = skillData.find(
      (skill) => skill.name === e.target.value
    );
    setSelectedSkill(newSelected);
  }

  function handleCategoryChange(e: SelectChangeEvent) {
    const newSelectedCategory = categoryData.find(
      (category) => category.name === e.target.value
    );
    setSelectedCategory(newSelectedCategory);

    if (newSelectedCategory) {
      const filteredSkills = skillData.filter(
        (skill) => skill.categoryId === newSelectedCategory.id
      );
      setSkills(filteredSkills);
    } else {
      setSkills(skillData);
    }

    setSelectedSkill(undefined);
  }

  function handleProfiencyChange(
    _e: React.SyntheticEvent,
    newValue: number | null
  ) {
    if (newValue === null) return;
    setProfiency(newValue);
  }

  async function handleAddSkill() {
    if (selectedSkill?.id === undefined) return;
    setLoading(true);
    const success = await onSubmit(selectedSkill, profiency);
    setLoading(false);
    if (success) setIsOpen(false);
  }

  return (
    <>
      <Button
        style={{
          backgroundColor: "white",
          color: "black",
          borderRadius: 38,
          height: 32,
        }}
        onClick={() => setIsOpen(true)}
      >
        Add Skill
      </Button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <DialogTitle>Add skill</DialogTitle>
        <Stack padding={2} spacing={2} minWidth={300}>
          <Typography>Category</Typography>
          <Select
            value={selectedCategory?.name ?? ""}
            onChange={handleCategoryChange}
          >
            <MenuItem value="">None</MenuItem>
            {categoryData.map((category) => (
              <MenuItem value={category.name} key={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
          <Typography>Skill</Typography>
          <Select value={selectedSkill?.name ?? ""} onChange={handleChange}>
            {skills.map((skill) => (
              <MenuItem value={skill.name} key={skill.id}>
                {skill.name}
              </MenuItem>
            ))}
          </Select>

          <Typography>Profiency</Typography>
          <Rating
            value={profiency}
            onChange={handleProfiencyChange}
            name="hover-feedback"
            precision={1}
            icon={<CircleIcon fontSize="inherit" />}
            sx={{
              color: "rgba(34, 130, 255, 1)",
            }}
            emptyIcon={<Circle style={{ opacity: 0.55 }} fontSize="inherit" />}
          />
          <Button
            variant="contained"
            onClick={() => void handleAddSkill()}
            loading={loading}
          >
            Add skill
          </Button>
        </Stack>
      </Dialog>
    </>
  );
}
