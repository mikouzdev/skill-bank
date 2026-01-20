import { Box, Typography, Stack, Chip, Paper } from "@mui/material";
import type { components } from "@api-types/openapi";
import dayjs from "dayjs";
import ProfessionalExperienceEdit from "./ProfessionalExperienceEdit";

type ConsultantEmploymentItem =
  components["schemas"]["EmploymentListResponse"][number];

type Props = {
  item: ConsultantEmploymentItem;
  editable?: boolean;
};

const DATE_FORMAT = "MM/YYYY";

export default function ProfessionalExperienceItem({ item, editable }: Props) {
  const editOnlyButtons = editable && (
    <Stack direction={"row"} spacing={1}>
      <ProfessionalExperienceEdit employmentData={item} />
    </Stack>
  );

  const skills = item.employmentSkills.map((skill, i) => (
    <Chip
      variant="outlined"
      key={i}
      label={skill.skillTagName}
      color="primary"
      size="small"
    />
  ));

  return (
    <Paper
      elevation={1}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        p: 2,
      }}
    >
      <Stack direction={"row"} spacing={"auto"}>
        <Typography variant="h6">{`${item.employer}, ${item.jobTitle}`}</Typography>
        <Typography variant="h6">{`${dayjs(item.start).format(DATE_FORMAT)} - ${
          item.end ? dayjs(item.end).format(DATE_FORMAT) : ""
        }`}</Typography>
      </Stack>
      <Box>
        <Typography>{item.description}</Typography>
      </Box>
      <Stack direction={"row"} width={"100%"}>
        {/* bottom left container */}
        <Stack
          flex={1}
          direction={"row"}
          justifyContent={"flex-start"}
          alignItems={"flex-end"}
          flexWrap={"wrap"}
          rowGap={1}
          columnGap={1}
        >
          {skills}
        </Stack>
        {/* bottom right container */}
        <Stack
          flex={1}
          direction={"row"}
          justifyContent={"flex-end"}
          alignItems={"flex-end"}
        >
          {editOnlyButtons}
        </Stack>
      </Stack>
    </Paper>
  );
}
