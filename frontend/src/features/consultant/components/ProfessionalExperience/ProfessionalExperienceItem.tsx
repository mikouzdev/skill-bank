import {
  Box,
  Typography,
  Stack,
  Chip,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import type { components } from "@api-types/openapi";
import dayjs from "dayjs";
import ProfessionalExperienceEdit from "./ProfessionalExperienceEdit";

type ConsultantEmploymentItem =
  components["schemas"]["EmploymentListResponse"][number];
type Employment = Partial<components["schemas"]["EmploymentResponse"]>;
type SkillsResponse = components["schemas"]["SkillTagList"];

type Props = {
  item: ConsultantEmploymentItem;
  editable?: boolean;
  skillData?: SkillsResponse;
  onDelete: (id: number) => void;
  onUpdate: (employment: Employment) => void;
};

const DATE_FORMAT = "MM/YYYY";

export default function ProfessionalExperienceItem({
  item,
  skillData,
  editable,
  onDelete,
  onUpdate,
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const editOnlyButtons = editable && skillData && (
    <Stack direction={"row"} spacing={1}>
      <ProfessionalExperienceEdit
        employmentData={item}
        skillData={skillData}
        onDelete={onDelete}
        onUpdate={onUpdate}
      />
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
      <Box sx={{ wordBreak: "break-all" }}>
        <Typography>{item.description}</Typography>
      </Box>
      <Stack
        direction={isMobile ? "column" : "row"}
        width={"100%"}
        flexWrap={"wrap"}
        border={1}
      >
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
