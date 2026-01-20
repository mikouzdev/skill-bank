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
} from "@mui/material";
import { useState } from "react";
import { deleteEmployment, updateEmployment } from "../../api/consultants.api";
import type { components } from "@api-types/openapi";

///
// component for the edit button and dialog window for editing professional experience.
///

type Employment = Partial<components["schemas"]["EmploymentResponse"]>;

type Props = {
  employmentData: Employment;
};

export default function ProfessionalExperienceEdit({ employmentData }: Props) {
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
        employmentSkills: formData.employmentSkills || [],
      };

      await updateEmployment(updatedEmployment);
      // just to see the loading icon :)
      await new Promise((res) => setTimeout(res, 500));

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
      alert("Employment deleted successfully, refresh page.");
    } catch (error) {
      console.log("error while deleting employment", error);
    }
  }

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

  return (
    <>
      <Button variant="contained" onClick={() => setIsOpen((prev) => !prev)}>
        Edit
      </Button>

      <Button
        variant="contained"
        color="error"
        onClick={() => void handleDeleteEmployment()}
      >
        Delete
      </Button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <DialogContent sx={{ p: 3, minWidth: 500 }}>
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
