import type { components } from "@api-types/openapi";
import { Box, Container, Stack, Typography } from "@mui/material";
import { ConsultantCard } from "../../sales/components/ConsultantCard";

type OfferPage = components["schemas"]["OfferPage"];

export default function CustomerSingleOffer() {
  const offerFromStorage = () => {
    const stored = sessionStorage.getItem("customerOffer");
    return stored ? (JSON.parse(stored) as OfferPage) : undefined;
  };

  const offer: OfferPage | undefined = offerFromStorage();

  if (!offer) return <Typography>Failed to load offer.</Typography>;

  return (
    <Container>
      <Box key={offer.id} p={4} sx={{ bgcolor: "rgba(0, 0, 0, 0.075)" }}>
        <Box
          textAlign="center"
          sx={{ display: "flex", justifyContent: "center", mt: 2 }}
        >
          <Stack width="90%">
            <Typography variant="h5">{offer.name}</Typography>
            <Typography variant="body2" gutterBottom>
              {offer.description}
            </Typography>
          </Stack>
        </Box>
        <Stack gap={2}>
          {offer.consultantPages?.map((consultant) => (
            <ConsultantCard
              key={consultant.id}
              consultantID={consultant.consultantId}
              offer={{
                id: offer.id,
                salesId: offer.salespersonId,
                consultantPageId: consultant.id,
                isAccepted: consultant.isAccepted,
              }}
            />
          ))}
        </Stack>
      </Box>
    </Container>
  );
}
