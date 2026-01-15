import {
  Box,
  Typography,
  Stack,
  Chip,
  Paper,
  FormControlLabel,
  Switch,
} from "@mui/material";
import type { components } from "@api-types/openapi";
import dayjs from "dayjs";

type ConsultantEmploymentItem =
  components["schemas"]["EmploymentListResponse"][number];

type Props = {
  item: ConsultantEmploymentItem;
  editable: boolean;
};

const DATE_FORMAT = "MM/YYYY";

export default function ProfessionalExperienceItem({ item, editable }: Props) {
  const editOnlyButtons = editable && (
    <Stack direction={"row"} spacing={1}>
      <FormControlLabel
        control={<Switch defaultChecked />}
        label="Visible to others"
        labelPlacement="start"
      />
    </Stack>
  );

  //Edited out until employment skills have been sorted
  /*const skills = item.skills.map((skill, i) => (
    <Chip key={i} label={skill.skillTagName} color="primary" size="small" />
  ));*/

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
      <Stack direction={"row"} spacing={1}>
        {/*skills*/}
        <Stack direction={"row"} spacing={1}>
          {editOnlyButtons}
        </Stack>
      </Stack>
    </Paper>
  );
}
