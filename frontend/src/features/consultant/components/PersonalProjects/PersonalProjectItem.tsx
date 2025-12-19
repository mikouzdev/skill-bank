import { Box, Typography, Stack, Chip, Paper } from "@mui/material";
import type { ConsultantProfileProjectItem } from "../../types/types";

type Props = {
  item: ConsultantProfileProjectItem;
};

export default function PersonalProjectItem({ item }: Props) {
  const skills = item.projectSkills.map((skill, i) => (
    <Chip key={i} label={skill} color="primary" size="small" />
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
        <Typography variant="h6">{`${item.name}`}</Typography>
        <Typography variant="h6">{`${item.start} - ${
          item.end ?? ""
        }`}</Typography>
      </Stack>
      <Box>
        <Typography>{item.description}</Typography>
      </Box>
      <Stack direction={"row"} spacing={1}>
        {skills}
      </Stack>
    </Paper>
  );
}
