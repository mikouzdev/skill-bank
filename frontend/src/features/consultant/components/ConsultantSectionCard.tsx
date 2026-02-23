import dayjs from "dayjs";
import type { components } from "@api-types/openapi";
import { Box, Button, Chip, Paper, Stack, Typography } from "@mui/material";

type Section = components["schemas"]["GetPageSectionsResponse"][number];

type Props = {
  section: Section;
  replyAllowed?: boolean;
};

const DATE_FORMAT = "DD/MM/YY HH:MM";

export default function ConsultantSectionCard({
  section,
  replyAllowed,
}: Props) {
  if (!section) return <Typography>Section data failed to load.</Typography>;

  return (
    <Stack spacing={2}>
      {section.comments.map((c) => (
        // comment card
        <Paper key={c.id}>
          <Box p={2}>
            <Stack direction={"row"} justifyContent={"space-between"}>
              <Typography gutterBottom>
                {c.userRole} {c.userId} commented:
              </Typography>
              <Typography>{dayjs(c.updatedAt).format(DATE_FORMAT)}</Typography>
            </Stack>

            <Box>
              <Typography gutterBottom>{c.content}</Typography>
            </Box>

            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Chip label={section.name} size="small" color="primary" />
              {replyAllowed && <Button size="small">Reply (WIP)</Button>}
            </Stack>
          </Box>
        </Paper>
      ))}
    </Stack>
  );
}
