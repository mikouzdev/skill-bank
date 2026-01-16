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
type Project = Partial<components["schemas"]["Project"]>;
type SkillsResponse = components["schemas"]["ConsultantSkill"];

interface Props {
  update: (formData: Project) => void;
  skillData: SkillsResponse[];
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
    const formPayload: Project = {
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
                    {skillData.map((el) => {
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

export default AddNewProject;
