import { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  Box,
  TextField,
  MenuItem,
  Stack,
  ButtonGroup,
} from "@mui/material";

import type { components } from "@api-types/openapi";
type Employment = Partial<components["schemas"]["EmploymentResponse"]>;
type SkillsResponse = components["schemas"]["ConsultantSkill"];

interface Props {
  update: (formData: Employment) => void;
  skillData: SkillsResponse[];
}

export function AddNewExperience({ update, skillData }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Employment>({
    employer: "",
    description: "",
    start: "",
    end: "",
    jobTitle: "",
    visibility: "PUBLIC",
    skills: [],
  });

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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // set end date to NULL if its not set
    const formPayload: Employment = {
      ...formData,
      end: formData.end ? formData.end : null,
    };

    update(formPayload);
    setShowForm(false);
  };

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
        Add professional experience
      </Button>

      <Dialog open={showForm}>
        <DialogTitle>Add professional experience</DialogTitle>
        {
          <div className="overlay">
            <div className="form-container">
              <Box
                component="form"
                onSubmit={(e) => handleSubmit(e)}
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
                  <b>Company name</b>
                  <TextField
                    label="Name"
                    name="employer"
                    value={formData.employer}
                    onChange={handleChange}
                    required
                    fullWidth
                  />
                  <b>Job Title</b>
                  <TextField
                    label="Job Title"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    required
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
                  </TextField>{" "}
                  <b>Skills</b>
                  <ButtonGroup
                    orientation="horizontal"
                    sx={{
                      "& .MuiButtonGroup-grouped": {
                        marginRight: "4px",
                        borderRadius: 1,
                        border: "1px solid",
                      },
                    }}
                  >
                    {skillData.map((skill) => {
                      return (
                        <Button
                          key={skill.id}
                          style={{
                            backgroundColor: "white",
                            color: "black",
                            borderRadius: 38,
                            height: 32,
                          }}
                        >
                          {skill.skillName}
                        </Button>
                      );
                    })}{" "}
                    <Button
                      style={{
                        backgroundColor: "cream",
                        color: "navy",
                        borderRadius: 38,
                        height: 32,
                      }}
                    >
                      + Add skill
                    </Button>
                  </ButtonGroup>
                  <b>Added Skills</b>
                  <div>Not yet implemented</div>
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
        }{" "}
      </Dialog>
    </div>
  );
}

export default AddNewExperience;
