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

type SalesList = components["schemas"]["SalesList"];

interface Props {
  salesListData: SalesList;
}

export default function SalesSingleList({ salesListData }: Props) {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>
          {salesListData.shortDescription} - {salesListData.shortDescription}
        </Typography>
      </AccordionSummary>
      <Box key={salesListData.id} p={4} sx={{ bgcolor: "rgba(0, 0, 0, 0.07)" }}>
        <Box
          textAlign="center"
          sx={{ display: "flex", justifyContent: "center", mt: 2 }}
        >
          <Stack width="90%">
            <Typography variant="h5">
              {salesListData.shortDescription}
            </Typography>
            <Typography variant="body2" gutterBottom>
              {salesListData.description}
            </Typography>
          </Stack>
        </Box>
        <Stack gap={2}>
          {salesListData.salesListItems.map((list) => (
            <ConsultantCard key={list.id} consultantID={list.consultantId} />
          ))}
        </Stack>
      </Box>
    </Accordion>
  );
}
