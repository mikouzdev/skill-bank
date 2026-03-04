import { Box, Container, Paper, Stack, Typography } from "@mui/material";

import { useEffect, useState } from "react";
import {
  createSkillTag,
  deleteSkillTag,
  getSkillTags,
} from "../../api/skills.api";
import type { components } from "@api-types/openapi";
import SkillTagItem from "./components/SkillTagItem";
import SkillCreationDialog from "./components/SkillCreationDialog";
import { useAuth } from "../../../app/hooks/useAuth";
import {
  createCategory,
  deleteCategory,
  getCategories,
} from "../../api/categories.api";
import SkillCategoryItem from "./components/SkillCategoryItem";
import CategoryCreationDialog from "./components/CategoryCreationDialog";
import { useSnackbar } from "../../components/useSnackbar";

type PostSkillTagBody = components["schemas"]["PostSkillTagBody"];
type SkillTagResponse = components["schemas"]["SkillTagList"];

type SkillCategoryBody = components["schemas"]["skillCategoryBody"];
type SkillCategories = components["schemas"]["SkillCategories"];

export default function SkillEditingPage() {
  const { showError, showSuccess } = useSnackbar();
  const { currentUser } = useAuth();

  const [skillTags, setSkillTags] = useState<SkillTagResponse>([]);
  const [categories, setCategories] = useState<SkillCategories>([]);

  useEffect(() => {
    async function fetchSkillPool() {
      try {
        const response = await getSkillTags();
        setSkillTags(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    async function fetchSkillCategories() {
      try {
        const response = await getCategories();
        setCategories(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    void fetchSkillPool();
    void fetchSkillCategories();
  }, []);

  async function handleDeleteSkillTag(skillName: string) {
    try {
      await deleteSkillTag(skillName);
      setSkillTags(skillTags?.filter((skill) => skill.name !== skillName));
    } catch (error) {
      showError("Failed to delete skill. Skill is probably in use.");
      console.log(error);
    }
  }

  async function handleDeleteCategory(id: number) {
    try {
      await deleteCategory(id);
      setCategories(categories.filter((c) => c.id !== id));
    } catch (error) {
      showError("Failed to delete category.");
      console.log(error);
    }
  }

  async function handleCreateSkillTag(
    payload: PostSkillTagBody
  ): Promise<boolean> {
    try {
      // frontend validation if skill exists already
      if (skillTags.find((skill) => skill.name === payload.name)) {
        showError(`Skill ${payload.name} already exists.`);
        return false;
      }

      const response = await createSkillTag(payload);
      setSkillTags((prev) => [...prev, response.data]);
      showSuccess("New skill added: " + response.data.name);
      return true;
    } catch (error) {
      console.log("failed to create skill: ", error);
      showError("Failed to create new skill.");
      return false;
    }
  }

  async function handleCreateCategory(
    payload: SkillCategoryBody
  ): Promise<boolean> {
    try {
      if (categories.find((c) => c.name === payload.name)) {
        showError(`Category ${payload.name} already exists`);
        return false;
      }

      const response = await createCategory(payload);
      setCategories((prev) => [...prev, response.data]);
      showSuccess("New category added: " + response.data.name);
      return true;
    } catch (error) {
      console.log("failed to create category: ", error);
      showError("Failed to create category.");
      return false;
    }
  }

  const mappedSkillTags = skillTags?.map((skill) => (
    <SkillTagItem
      key={skill.id}
      skill={skill}
      onDelete={(skillName) => handleDeleteSkillTag(skillName)}
    />
  ));

  const mappedSkillCategories = categories?.map((category) => (
    <SkillCategoryItem
      key={category.id}
      category={category}
      onDelete={(id) => handleDeleteCategory(id)}
    />
  ));

  // simple role check, todo: use authenticated routes
  if (
    !currentUser?.roles.some(
      (role) => role === "ADMIN" || role === "SALESPERSON"
    )
  )
    return (
      <Typography>
        Unauthorized. Admin role needed to access this page.
      </Typography>
    );

  return (
    <Container>
      {/* todo: map categories */}
      <Stack direction={"row"} spacing={5} flex={1}>
        <Box display={"flex"} flexDirection={"column"} gap={1} flex={1}>
          <Stack direction={"row"} spacing={2} alignItems={"center"}>
            <Typography variant="h5">Category</Typography>
            <CategoryCreationDialog onCreate={handleCreateCategory} />
          </Stack>
          <Paper elevation={1}>
            <Stack
              direction={"column"}
              spacing={2}
              p={2}
              maxHeight={700}
              overflow={"scroll"}
            >
              {mappedSkillCategories}
            </Stack>
          </Paper>
        </Box>

        <Box display={"flex"} flexDirection={"column"} gap={1} flex={1}>
          <Stack direction={"row"} spacing={2} alignItems={"center"}>
            <Typography variant="h5">Skills</Typography>
            <SkillCreationDialog
              onCreate={handleCreateSkillTag}
              categories={categories}
            />
          </Stack>
          <Paper elevation={1}>
            <Stack
              direction={"column"}
              spacing={2}
              p={2}
              maxHeight={700}
              overflow={"scroll"}
            >
              {mappedSkillTags}
            </Stack>
          </Paper>
        </Box>
      </Stack>
    </Container>
  );
}
