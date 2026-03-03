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
import { deleteEmployment, updateEmployment } from "../../api/consultants.api";
import type { components } from "@api-types/openapi";

///
// component for the edit button and dialog window for editing professional experience.
///

type Employment = Partial<components["schemas"]["EmploymentResponse"]>;
type SkillsResponse = components["schemas"]["SkillTagList"];
type EmploymentSkill = components["schemas"]["EmploymentSkill"];

type Props = {
  employmentData: Employment;
  skillData: SkillsResponse;
  onDelete: (id: number) => void;
  onUpdate: (employment: Employment) => void;
};

export default function ProfessionalExperienceEdit({
  employmentData,
  skillData,
  onDelete,
  onUpdate,
}: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOngoing, setIsOngoing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<Employment>({
    id: employmentData.id,
    description: employmentData.description,
    employer: employmentData.employer,
    jobTitle: employmentData.jobTitle,
    start: employmentData.start,
    end: employmentData.end,
    visibility: employmentData.visibility,
    employmentSkills: employmentData.employmentSkills,
  });
  const [addedSkills, setAddedSkills] = useState<EmploymentSkill[]>(
    employmentData.employmentSkills || []
  );

  async function handleSubmitEdit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (employmentData.id === undefined) return;
    try {
      setLoading(true);

      const updatedEmployment = {
        id: formData.id,
        employer: formData.employer,
        jobTitle: formData.jobTitle,
        description: formData.description,
        start: formData.start,
        end: isOngoing ? null : formData.end,
        visibility: formData.visibility,
        employmentSkills: addedSkills || [],
      };

      const response = await updateEmployment(updatedEmployment);

      // just to see the loading icon :)
      await new Promise((res) => setTimeout(res, 500));

      // for local changes
      onUpdate({ ...response.data, employmentSkills: addedSkills });

      setIsOpen(false);
    } catch (error) {
      console.log("Failed to update employment", error);
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

  async function handleDeleteEmployment() {
    if (employmentData.id === undefined) return;
    try {
      await deleteEmployment(employmentData.id);
      onDelete(employmentData.id);
    } catch (error) {
      console.log("error while deleting employment", error);
    }
  }

  const handleAddSkill = (skillName: string) => {
    // check if skill already added
    if (addedSkills.some((skill) => skill.skillTagName === skillName)) return;

    if (employmentData.id === undefined) {
      console.log("employment id is undefined, unable to add skill");
      return;
    }

    const employmentId = employmentData.id;
    const skillTagName = skillName;

    setAddedSkills((prev) => [...prev, { skillTagName, employmentId }]);
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
      <Button
        size="small"
        variant="contained"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        Edit
      </Button>

      <Button
        size="small"
        variant="contained"
        color="error"
        onClick={() => void handleDeleteEmployment()}
        loading={loading}
      >
        Delete
      </Button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <DialogContent sx={{ p: 3 }}>
          <DialogTitle>Edit employment</DialogTitle>
          <Box
            component="form"
            onSubmit={(e) => {
              void handleSubmitEdit(e);
            }}
          >
            <Stack spacing={3}>
              <TextField
                label="Employer"
                name="employer"
                value={formData.employer}
                onChange={handleChange}
              />
              <TextField
                label="Job Title"
                name="jobTitle"
                value={formData.jobTitle}
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

              <Stack direction={"column"} spacing={3}>
                <TextField
                  size="small"
                  label="Start date"
                  type="date"
                  name="start"
                  value={formData.start}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
                {!isOngoing && (
                  <TextField
                    size="small"
                    label="End date"
                    type="date"
                    name="end"
                    value={formData.end}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              </Stack>

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
