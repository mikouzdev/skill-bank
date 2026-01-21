import {
  Box,
  Typography,
  Stack,
  FormControlLabel,
  Switch,
} from "@mui/material";
import ProfessionalExperienceItem from "./ProfessionalExperienceItem";
import AddNewExperience from "./ProfessionalExperienceAdd";
import {
  postWorkExperience,
  addEmploymentSkill,
} from "../../api/consultants.api";

import type { components } from "@api-types/openapi";
type ConsultantEmploymentList = components["schemas"]["EmploymentListResponse"];
type SkillsResponse = components["schemas"]["SkillTagList"];
type Employment = Partial<components["schemas"]["EmploymentResponse"]>;

type Props = {
  data: ConsultantEmploymentList;
  skillData: SkillsResponse;
  editable?: boolean;
};

export default function ProfessionalExperience({
  data,
  skillData,
  editable,
}: Props) {
  // posts employment without skills first to get the needed employmentId
  // after that is done, it posts the skills to the employment one by one.
  async function AddNewWorkExperience(formData: Employment) {
    try {
      // post employment first
      const response = await postWorkExperience({
        description: formData.description,
        start: formData.start,
        end: formData.end,
        visibility: formData.visibility,
        employer: formData.employer,
        jobTitle: formData.jobTitle,
        employmentSkills: [],
      });

      // take id from posted employment response -> post skills to employment one by one
      if (
        formData.employmentSkills &&
        formData.employmentSkills.length > 0 &&
        response.data?.id
      ) {
        const employmentId = response.data.id;
        for (const skill of formData.employmentSkills) {
          await addEmploymentSkill(employmentId, skill.skillTagName);
        }
      }
    } catch (error) {
      console.error("Failed to add work experience:", error);
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
          <ProfessionalExperienceItem
            key={i}
            item={item}
            skillData={skillData}
          />
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
          <ProfessionalExperienceItem
            key={i}
            item={item}
            skillData={skillData}
            editable={editable}
          />
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
