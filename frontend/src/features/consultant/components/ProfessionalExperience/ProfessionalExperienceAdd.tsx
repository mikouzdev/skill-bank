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
  FormControlLabel,
  Switch,
} from "@mui/material";

import { type FormedWorkData, type SkillsResponse } from "../../types/types";

interface Props {
  update: (formData: FormedWorkData) => void;
  skilldata: SkillsResponse;
}

export function AddNewExperience({ update, skilldata }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    description: "",
    start: "",
    end: "",
    jobTitle: "",
    visibility: "PUBLIC",
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

  const handleSubmit = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    event.preventDefault();
    update(formData);
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

      {/* Move to Professional exp edit file when ready */}
      <Dialog open={!!showForm}>
        <DialogTitle>Add professional experience</DialogTitle>
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
                  <b>Company name</b>
                  <TextField
                    label="Name"
                    name="companyName"
                    value={formData.companyName}
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
                    {skilldata.map((el) => {
                      return (
                        <Button
                          style={{
                            backgroundColor: "white",
                            color: "black",
                            borderRadius: 38,
                            height: 32,
                          }}
                        >
                          {el.skillName}
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
