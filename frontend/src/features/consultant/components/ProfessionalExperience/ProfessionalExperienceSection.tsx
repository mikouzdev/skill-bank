import { Box, Typography, Stack } from "@mui/material";
import ProfessionalExperienceItem from "./ProfessionalExperienceItem";
import type { components } from "@api-types/openapi";
import AddNewExperience from "./ProfessionalExperienceAdd";
import { postWorkExperience } from "../../api/consultants.api";

type ConsultantEmploymentList = components["schemas"]["EmploymentListResponse"];
import { type SkillsResponse } from "../../types/types";

type Props = {
  data: ConsultantEmploymentList;
  skillData: SkillsResponse;
};

export interface FormedWorkData {
  companyName: string;
  description: string;
  start: string;
  end: string;
  visibility: string;
  jobTitle: string;
}

export default function ProfessionalExperience({ data, skillData }: Props) {
  async function AddNewWorkExperience(formData: FormedWorkData) {
    try {
      await postWorkExperience({
        description: formData.description,
        start: formData.start,
        end: formData.end,
        visibility: formData.visibility,
        projectLinks: [],
        employer: formData.companyName,
        jobTitle: formData.jobTitle,
        skills: ["testing"],
      });
    } catch {
      return;
    }
  }

  return (
    <Box
      sx={{
        p: 2,
      }}
    >
      <Stack spacing={1} sx={{ maxWidth: 1200 }}>
        <Typography variant="h5">Professional Experience</Typography>
        <AddNewExperience
          update={AddNewWorkExperience}
          skilldata={skillData}
        ></AddNewExperience>
        <Stack spacing={1}>
          {data.map((item, i) => (
            <ProfessionalExperienceItem key={i} item={item} />
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}
