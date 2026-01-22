import {
  Dialog,
  Button,
  DialogContent,
  DialogTitle,
  TextField,
  Stack,
  Select,
  MenuItem,
  InputLabel,
  Box,
  FormControl,
  type SelectChangeEvent,
  Switch,
  FormGroup,
  FormControlLabel,
  Chip,
  Divider,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import { useState } from "react";
import { deleteProject, updateProject } from "../../api/consultants.api";
import type { components } from "@api-types/openapi";

///
// component for the edit button and dialog window for editing a personal project.
///

type Project = Partial<components["schemas"]["GetProjectsResponse"][number]>;
type SkillsResponse = components["schemas"]["SkillTagList"];
type ProjectSkill = components["schemas"]["ProjectSkill"];

type Props = {
  projectData: Project;
  skillData: SkillsResponse;
};

export default function PersonalProjectEdit({ projectData, skillData }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOngoing, setIsOngoing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<Project>({
    id: projectData.id,
    description: projectData.description,
    name: projectData.name,
    start: projectData.start,
    end: projectData.end,
    visibility: projectData.visibility,
    projectSkills: projectData.projectSkills,
  });
  const [addedSkills, setAddedSkills] = useState<ProjectSkill[]>(
    projectData.projectSkills || []
  );

  async function handleSubmitEdit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (projectData.id === undefined) return;
    try {
      setLoading(true);

      const updatedProject: Project = {
        ...formData,
        end: isOngoing ? null : formData.end,
        projectSkills: addedSkills,
      };

      await updateProject(updatedProject);
      // just to see the loading icon :)
      await new Promise((res) => setTimeout(res, 500));

      setIsOpen(false);
    } catch (error) {
      console.log("Failed to update project", error);
      return;
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSelectChange(event: SelectChangeEvent<string>) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleDeleteProject() {
    if (projectData.id === undefined) return;
    try {
      await deleteProject(projectData.id);
      alert("project deleted succesfully, refresh page.");
    } catch (error) {
      console.log("error while deleting project", error);
    }
  }

  const handleAddSkill = (skillName: string) => {
    // check if skill already added
    if (addedSkills.some((skill) => skill.skillTagName === skillName)) return;

    if (projectData.id === undefined) {
      console.log("project id is undefined, unable to add skill");
      return;
    }

    const projectId = projectData.id;
    const skillTagName = skillName;

    setAddedSkills((prev) => [...prev, { id: 0, skillTagName, projectId }]);
  };

  const handleRemoveSkill = (skillName: string) => {
    setAddedSkills(
      addedSkills.filter((skill) => skill.skillTagName !== skillName)
    );
  };

  const ongoingSwitch = (
    <FormGroup>
      <FormControlLabel
        control={
          <Switch
            checked={isOngoing}
            onChange={() => setIsOngoing((prev) => !prev)}
          />
        }
        label="Ongoing?"
      />
    </FormGroup>
  );

  const availableSkillChips = skillData.map((skill) => {
    return (
      <Chip
        icon={<AddIcon />}
        key={skill.id}
        color="primary"
        onClick={() => handleAddSkill(skill.name)}
        label={skill.name}
      />
    );
  });

  const addedSkillChips = addedSkills.map((skill) => {
    return (
      <Chip
        key={skill.skillTagName}
        color="secondary"
        onDelete={() => handleRemoveSkill(skill.skillTagName)}
        label={skill.skillTagName}
      />
    );
  });

  return (
    <>
      <Button variant="contained" onClick={() => setIsOpen((prev) => !prev)}>
        Edit
      </Button>

      <Button
        variant="contained"
        color="error"
        onClick={() => void handleDeleteProject()}
      >
        Delete
      </Button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <DialogContent sx={{ p: 3, minWidth: 500 }}>
          <DialogTitle>Edit project</DialogTitle>
          <Box
            component="form"
            onSubmit={(e) => {
              void handleSubmitEdit(e);
            }}
          >
            <Stack spacing={3}>
              <TextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                minRows={3}
              />

              <FormControl>
                <InputLabel id="visibility-label">Visibility</InputLabel>
                <Select
                  label="Visibility"
                  labelId="visibility-label"
                  name="visibility"
                  value={formData.visibility}
                  onChange={handleSelectChange}
                >
                  <MenuItem value="PUBLIC">Public</MenuItem>
                  <MenuItem value="LIMITED">Limited</MenuItem>
                </Select>
              </FormControl>
              {ongoingSwitch}
              <Stack direction={"row"} spacing={2}>
                <TextField
                  label="Start date"
                  type="date"
                  name="start"
                  value={formData.start}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
                {!isOngoing && (
                  <TextField
                    label="End date"
                    type="date"
                    name="end"
                    value={formData.end}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              </Stack>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Stack direction="column">
                  <Divider textAlign="left">Select Skills</Divider>
                  <Stack
                    direction="row"
                    flexWrap="wrap"
                    rowGap={1}
                    columnGap={1}
                    sx={{
                      p: 1,
                      maxHeight: 150,
                      overflowY: "scroll",
                    }}
                  >
                    {availableSkillChips}
                  </Stack>
                </Stack>

                <Stack direction="column">
                  <Divider textAlign="left">Added Skills</Divider>
                  <Stack
                    direction="row"
                    flexWrap="wrap"
                    rowGap={1}
                    columnGap={1}
                    sx={{
                      p: 1,
                      maxHeight: 150,
                      overflowY: "scroll",
                    }}
                  >
                    {addedSkillChips}
                  </Stack>
                </Stack>
              </Box>

              <Stack direction={"row"} spacing={2}>
                <Button
                  size="small"
                  variant="contained"
                  loading={loading}
                  type="submit"
                >
                  Apply edits
                </Button>
                <Button variant="outlined" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
