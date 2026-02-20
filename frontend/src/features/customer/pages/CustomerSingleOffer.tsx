import type { components } from "@api-types/openapi";
import {
  Accordion,
  AccordionSummary,
  Box,
  Stack,
  Typography,
} from "@mui/material";
import { ConsultantCard } from "../../sales/components/ConsultantCard";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

type OfferPage = components["schemas"]["OfferPage"];

interface Props {
  offerData: OfferPage;
}

export default function CustomerSingleOffer({ offerData }: Props) {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>
          {offerData.name} - {offerData.shortDescription}
        </Typography>
      </AccordionSummary>
      <Box key={offerData.id} p={4} sx={{ bgcolor: "rgba(0, 0, 0, 0.075)" }}>
        <Box
          textAlign="center"
          sx={{ display: "flex", justifyContent: "center", mt: 2 }}
        >
          <Stack width="90%">
            <Typography variant="h5">{offerData.name}</Typography>
            <Typography variant="body2" gutterBottom>
              {offerData.description}
            </Typography>
          </Stack>
        </Box>
        <Stack gap={2}>
          {offerData.consultantPages?.map((consultant) => (
            <ConsultantCard
              key={consultant.id}
              consultantID={consultant.consultantId}
              offer={{
                id: offerData.id,
                salesId: offerData.salespersonId,
                consultantPageId: consultant.id,
                isAccepted: consultant.isAccepted,
              }}
            />
          ))}
        </Stack>
      </Box>
    </Accordion>
  );
}
