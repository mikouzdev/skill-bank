import {
  Box,
  Button,
  Container,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
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

type PostSkillTagBody = components["schemas"]["PostSkillTagBody"];
type SkillTagResponse = components["schemas"]["SkillTagList"];

const categoryItem = (
  <Stack direction={"row"} alignItems={"center"} spacing={1}>
    <IconButton>
      <DeleteIcon color="error" />
    </IconButton>
    <Typography>Category 1</Typography>
  </Stack>
);

export default function SkillEditingPage() {
  const { currentUser } = useAuth();

  const [skillTags, setSkillTags] = useState<SkillTagResponse>([]);

  useEffect(() => {
    async function fetchSkillPool() {
      try {
        const response = await getSkillTags();
        setSkillTags(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    void fetchSkillPool();
  }, []);

  async function handleDeleteSkillTag(skillName: string) {
    try {
      await deleteSkillTag(skillName);
      setSkillTags(skillTags?.filter((skill) => skill.name !== skillName));
    } catch (error) {
      alert("Failed to delete skill. Skill is probably in use.");
      console.log(error);
    }
  }

  async function handleCreateSkillTag(
    payload: PostSkillTagBody
  ): Promise<boolean> {
    try {
      // frontend validation if skill exists already
      if (skillTags.find((skill) => skill.name === payload.name)) {
        alert(`skill ${payload.name} already exists.`);
        return false;
      }

      const response = await createSkillTag(payload);
      setSkillTags((prev) => [...prev, response.data]);
      alert("new skill added: " + response.data.name);
      return true;
    } catch (error) {
      console.log("failed to create skill: ", error);
      alert("failed to create new skill.");
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
            <Button size="small">Add category</Button>
          </Stack>
          <Paper elevation={1}>
            <Stack
              direction={"column"}
              spacing={2}
              p={2}
              maxHeight={700}
              overflow={"scroll"}
            >
              {categoryItem}
              {categoryItem}
              {categoryItem}
              {categoryItem}
              {categoryItem}
            </Stack>
          </Paper>
        </Box>

        <Box display={"flex"} flexDirection={"column"} gap={1} flex={1}>
          <Stack direction={"row"} spacing={2} alignItems={"center"}>
            <Typography variant="h5">Skills - Category Name</Typography>
            <SkillCreationDialog onCreate={handleCreateSkillTag} />
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
