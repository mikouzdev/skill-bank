import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  Box,
  TextField,
  MenuItem,
  Stack,
  Chip,
  Divider,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import type { components } from "@api-types/openapi";

type Project = Partial<components["schemas"]["Project"]>;
type SkillsResponse = components["schemas"]["SkillTagList"];
type ProjectSkill = Pick<components["schemas"]["ProjectSkill"], "skillTagName">;
type ProjectLink = Partial<components["schemas"]["ProjectLink"]>;

interface Props {
  update: (
    formData: Project,
    skills: ProjectSkill[],
    links: ProjectLink
  ) => void;
  skillData: SkillsResponse;
}

export function AddNewProject({ update, skillData }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    start: "",
    end: "",
    visibility: "PUBLIC" as "PUBLIC" | "LIMITED",
  });
  const [addedSkills, setAddedSkills] = useState<ProjectSkill[]>([]);

  const [addLabel, setAddLabel] = useState<string>("");
  const [addUrl, setAddUrl] = useState<string>("");

  const handleOpen = () => setShowForm(true);
  const handleClose = () => setShowForm(false);
  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProjectLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddLabel(e.target.value);
  };

  const handleProjectUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddUrl(e.target.value);
  };

  const handleAddSkill = (skillName: string) => {
    // check if skill already added
    if (addedSkills.some((skill) => skill.skillTagName === skillName)) return;

    setAddedSkills((prev) => [...prev, { skillTagName: skillName }]);
  };

  const handleRemoveSkill = (skillName: string) => {
    setAddedSkills(
      addedSkills.filter((skill) => skill.skillTagName !== skillName)
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // set end date to NULL if its not set
    const formPayload: Project = {
      ...formData,
      end: formData.end ? formData.end : null,
    };

    update(formPayload, addedSkills, { url: addUrl, label: addLabel });
    setShowForm(false);
  };

  const isValidUrl = (value: string): boolean => {
    try {
      const url = new URL(value);
      return url.protocol === "https:" || url.protocol === "http:";
    } catch {
      return false;
    }
  };

  const isUrlInvalid = addUrl.trim() !== "" && !isValidUrl(addUrl);
  const isTitleDisabled = addUrl.trim() === "" || !isValidUrl(addUrl);
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
    <div>
      <Button
        style={{
          backgroundColor: "white",
          color: "black",
          borderRadius: 38,
          height: 32,
        }}
        onClick={handleOpen}
      >
        Add project
      </Button>
      <Dialog open={!!showForm}>
        <DialogTitle>Add a new project</DialogTitle>

        <div className="overlay">
          <div className="form-container">
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                maxWidth: 9000,
                mx: "auto",
                p: 3,
                borderRadius: 2,
                boxShadow: 3,
                bgcolor: "background.paper",
              }}
            >
              <Stack spacing={2}>
                <TextField
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  fullWidth
                />

                <TextField
                  label=""
                  name="Shortdescription"
                  value="NOT IMPLEMENTED"
                  multiline
                  rows={2}
                  fullWidth
                />

                <TextField
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  multiline
                  rows={4}
                  fullWidth
                />

                <TextField
                  select
                  label="Visibility"
                  name="visibility"
                  value={formData.visibility}
                  onChange={handleChange}
                  fullWidth
                >
                  <MenuItem value="PUBLIC">Public</MenuItem>
                  <MenuItem value="LIMITED">Limited</MenuItem>
                </TextField>

                <Divider textAlign="left">Select skills</Divider>
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

                <Divider textAlign="left">Project length</Divider>
                <Stack direction={"column"} spacing={3}>
                  <TextField
                    size="small"
                    label="Start Date"
                    type="date"
                    name="start"
                    value={formData.start}
                    onChange={handleChange}
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    size="small"
                    label="End Date"
                    type="date"
                    name="end"
                    value={formData.end}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Stack>

                <Divider textAlign="left">Project link</Divider>
                <Stack direction={"column"} spacing={3}>
                  <TextField
                    size="small"
                    label="Project URL"
                    name="url"
                    value={addUrl}
                    onChange={handleProjectUrlChange}
                    error={isUrlInvalid}
                    fullWidth
                  />
                  <TextField
                    size="small"
                    label="Project name"
                    name="label"
                    value={addLabel}
                    onChange={handleProjectLabelChange}
                    disabled={isTitleDisabled}
                    fullWidth
                  />
                </Stack>
                <Stack direction={"row"} spacing={2} justifyContent={"center"}>
                  <Button size="small" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button size="small" type="submit">
                    Submit
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default AddNewProject;
