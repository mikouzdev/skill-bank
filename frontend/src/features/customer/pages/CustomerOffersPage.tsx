import { Box, Container, Stack, Typography } from "@mui/material";
import { ConsultantCard } from "../../sales/components/ConsultantCard";

export default function CustomerOffersPage() {
  const offeredConsultants = (
    <Stack gap={2}>
      <ConsultantCard consultantID={1} />
      <ConsultantCard consultantID={1} />
      <ConsultantCard consultantID={1} />
    </Stack>
  );

  return (
    <Container>
      <Box
        textAlign="center"
        sx={{ display: "flex", justifyContent: "center", mt: 2 }}
      >
        <Stack width="90%">
          <Typography variant="h5">Project A (placeholder)</Typography>
          <Typography variant="body2" gutterBottom>
            Offer page for Project A. You were looking for a consultant with at
            least 10 years of experience of frontend technology. Here are three
            professional choices.
          </Typography>
        </Stack>
      </Box>
      {offeredConsultants}
    </Container>
  );
}
