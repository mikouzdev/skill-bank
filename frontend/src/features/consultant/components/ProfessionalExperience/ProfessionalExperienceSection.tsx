import {
  Box,
  Typography,
  Stack,
  FormControlLabel,
  Switch,
} from "@mui/material";
import ProfessionalExperienceItem from "./ProfessionalExperienceItem";
import AddNewExperience from "./ProfessionalExperienceAdd";
import { postWorkExperience } from "../../api/consultants.api";

import type { components } from "@api-types/openapi";
type ConsultantEmploymentList = components["schemas"]["EmploymentListResponse"];
type SkillsResponse = components["schemas"]["ConsultantSkill"];
type Employment = Partial<components["schemas"]["EmploymentResponse"]>;

type Props = {
  data: ConsultantEmploymentList;
  skillData: SkillsResponse[];
  editable?: boolean;
};

export default function ProfessionalExperience({
  data,
  skillData,
  editable,
}: Props) {
  async function AddNewWorkExperience(formData: Employment) {
    try {
      await postWorkExperience({
        description: formData.description,
        start: formData.start,
        end: formData.end,
        visibility: formData.visibility,
        employer: formData.employer,
        jobTitle: formData.jobTitle,
        skills: [],
      });
    } catch {
      return;
    }
  }

  const defaultSection = (
    <Stack spacing={1} sx={{ maxWidth: 1200 }}>
      <Stack direction={"row"} spacing={2}>
        <Typography variant="h5">Professional Experience</Typography>
        <AddNewExperience
          update={(formData) => void AddNewWorkExperience(formData)}
          skillData={skillData}
        ></AddNewExperience>
      </Stack>

      <Stack spacing={1}>
        {data.map((item, i) => (
          <ProfessionalExperienceItem key={i} item={item} />
        ))}
      </Stack>
    </Stack>
  );

  const editableSection = (
    <Stack spacing={1} sx={{ maxWidth: 1200 }}>
      <Stack direction={"row"} spacing={2}>
        <Typography variant="h5">Professional Experience</Typography>
        <AddNewExperience
          update={(formData) => void AddNewWorkExperience(formData)}
          skillData={skillData}
        ></AddNewExperience>
        <FormControlLabel
          control={<Switch defaultChecked />}
          label="Visible to others"
          labelPlacement="start"
        />
      </Stack>

      <Stack spacing={1}>
        {data.map((item, i) => (
          <ProfessionalExperienceItem key={i} item={item} editable={editable} />
        ))}
      </Stack>
    </Stack>
  );

  return (
    <Box
      sx={{
        p: 2,
      }}
    >
      {editable ? editableSection : defaultSection}
    </Box>
  );
}
