import { Box, Typography, Stack } from "@mui/material";
import ProfessionalExperienceItem from "./ProfessionalExperienceItem";
import AddNewExperience from "./ProfessionalExperienceAdd";
import {
  postWorkExperience,
  addEmploymentSkill,
} from "../../api/consultants.api";

import type { components } from "@api-types/openapi";
import { useState } from "react";
import SectionVisibilitySwitch from "../../../../shared/components/SectionVisibilitySwitch";
import AddCommentButton from "../../../sales/components/AddCommentButton";
type ConsultantEmploymentList = components["schemas"]["EmploymentListResponse"];
type SkillsResponse = components["schemas"]["SkillTagList"];
type Employment = Partial<components["schemas"]["EmploymentResponse"]>;

type Props = {
  data: ConsultantEmploymentList;
  skillData?: SkillsResponse;
  editable?: boolean;
};

export default function ProfessionalExperience({
  data,
  skillData,
  editable,
}: Props) {
  const [employments, setEmployments] = useState<Employment[]>(data || []);

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

      // update local state on success
      const addedEmployment: Employment = {
        ...response.data,
        employmentSkills: formData.employmentSkills,
      };

      setEmployments((prev) => [...prev, addedEmployment]);
    } catch (error) {
      console.error("Failed to add work experience:", error);
      return;
    }
  }

  function handleDelete(id: number) {
    setEmployments((prev) => prev.filter((emp) => emp.id !== id));
  }

  function handleUpdate(employment: Employment) {
    setEmployments((prev) =>
      prev.map((emp) => (emp.id === employment.id ? employment : emp))
    );
  }

  const defaultSection = (
    <Stack spacing={1} sx={{ maxWidth: 1200 }}>
      <Stack direction={"row"} spacing={2}>
        <Typography variant="h5">Professional Experience</Typography>
        <AddCommentButton label="Add comment" section="EMPLOYMENTS" />
      </Stack>

      <Stack spacing={1}>
        {employments.map((item) => (
          <ProfessionalExperienceItem
            key={item.id}
            item={item as components["schemas"]["EmploymentResponse"]}
            skillData={skillData}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        ))}
      </Stack>
    </Stack>
  );

  const editableSection = (
    <Stack spacing={1} sx={{ maxWidth: 1200 }}>
      <Stack direction={"row"} spacing={2}>
        <Typography variant="h5">Professional Experience</Typography>
        {skillData && (
          <AddNewExperience
            update={(formData) => void AddNewWorkExperience(formData)}
            skillData={skillData}
          />
        )}
        <SectionVisibilitySwitch
          sectionData={{ name: "EMPLOYMENTS", visibility: "PUBLIC" }}
        />
      </Stack>

      <Stack spacing={1}>
        {employments.map((item) => (
          <ProfessionalExperienceItem
            key={item.id}
            item={item as components["schemas"]["EmploymentResponse"]}
            skillData={skillData}
            editable={editable}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
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
