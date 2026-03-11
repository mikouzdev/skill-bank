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
type Employment = Partial<components["schemas"]["EmploymentResponse"]>;
type SkillsResponse = components["schemas"]["SkillTagList"];
type EmploymentSkill = components["schemas"]["EmploymentSkill"];

interface Props {
  update: (formData: Employment) => void;
  skillData: SkillsResponse;
}

export function AddNewExperience({ update, skillData }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Employment>({
    employer: "",
    description: "",
    start: "",
    end: "",
    jobTitle: "",
    employmentSkills: [],
    visibility: "PUBLIC",
  });
  const [addedSkills, setAddedSkills] = useState<EmploymentSkill[]>([]);

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

    setAddedSkills((prev) => [
      ...prev,
      { skillTagName: skillName, employmentId: 0 }, // 0 used as placeholder
    ]);
  };

  const handleRemoveSkill = (skillName: string) => {
    setAddedSkills(
      addedSkills.filter((skill) => skill.skillTagName !== skillName)
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formPayload: Employment = {
      ...formData,
      employmentSkills: addedSkills,
      end: formData.end ? formData.end : null, // set end date to NULL if its not set
    };

    update(formPayload);
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
    <>
      <Button
        data-cy="add-position-button"
        style={{
          backgroundColor: "white",
          color: "black",
          borderRadius: 38,
          height: 32,
        }}
        onClick={handleOpen}
      >
        Add position
      </Button>

      <Dialog open={showForm}>
        <DialogTitle>Add position</DialogTitle>
        {
          <Box className="overlay">
            <Box className="form-container">
              <Box
                data-cy="add-employment-form"
                component="form"
                onSubmit={(e) => handleSubmit(e)}
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
                    name="employer"
                    value={formData.employer}
                    onChange={handleChange}
                    required
                    fullWidth
                  />

                  <TextField
                    label="Job Title"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    required
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

                  <Stack
                    data-cy="available-skill-chips"
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
                    data-cy="added-skill-chips"
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
                  <Button
                    data-cy="employment-submit-button"
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
            </Box>
          </Box>
        }
      </Dialog>
    </>
  );
}

export default AddNewExperience;
