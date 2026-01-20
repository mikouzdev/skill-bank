import { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  Box,
  TextField,
  MenuItem,
  Stack,
  Chip,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import type { components } from "@api-types/openapi";
type Project = Partial<components["schemas"]["Project"]>;
type SkillsResponse = components["schemas"]["SkillTagList"];
type ProjectSkill = Pick<components["schemas"]["ProjectSkill"], "skillTagName">;

interface Props {
  update: (formData: Project, skills: ProjectSkill[]) => void;
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

    update(formPayload, addedSkills);
    setShowForm(false);
  };

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
        {
          <div className="overlay">
            <div className="form-container">
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                  maxWidth: 9000,
                  minWidth: 500,
                  mx: "auto",
                  p: 3,
                  borderRadius: 2,
                  boxShadow: 3,
                  bgcolor: "background.paper",
                }}
              >
                <Stack spacing={2}>
                  <b>Name</b>
                  <TextField
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    fullWidth
                  />
                  <b>Short Description</b>
                  <TextField
                    label=""
                    name="Shortdescription"
                    value="NOT IMPLEMENTED"
                    multiline
                    rows={2}
                    fullWidth
                  />
                  <b>Description</b>
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
                  <Typography>Skills</Typography>
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
                  <Typography>Added Skills</Typography>
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
                  <b>Project length:</b>
                  <div>
                    <TextField
                      label="Start Date"
                      type="date"
                      name="start"
                      value={formData.start}
                      onChange={handleChange}
                      required
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      label="End Date"
                      type="date"
                      name="end"
                      value={formData.end}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{ mt: 2 }}
                  >
                    Submit
                  </Button>
                  <Button onClick={handleClose}>Cancel</Button>
                </Stack>
              </Box>
            </div>
          </div>
        }
      </Dialog>
    </div>
  );
}

export default AddNewProject;
