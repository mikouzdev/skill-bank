import type { components } from "@api-types/openapi";
import {
  Accordion,
  AccordionSummary,
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import { ConsultantCard } from "../../sales/components/ConsultantCard";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { deleteSalesList } from "../../../shared/api/offers.api";
import { useSnackbar } from "../../../shared/components/useSnackbar";
import { useState } from "react";

type SalesList = components["schemas"]["SalesList"];

interface Props {
  salesListData: SalesList;
  onDelete: (salesListId: number) => void;
}

export default function SalesSingleList({ salesListData, onDelete }: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const { showSuccess, showError } = useSnackbar();

  async function handleDeleteList() {
    try {
      setLoading(true);
      await deleteSalesList(salesListData.salespersonId, salesListData.id);
      showSuccess("List deleted succesfully.");
      onDelete(salesListData.id);
    } catch (error) {
      console.log(error);
      showError("Failed to delete list.");
    } finally {
      setLoading(false);
    }
  }

  const listHeaderButtons = (
    <Stack direction={"row"} spacing={1} justifyContent={"flex-end"}>
      <Button
        size="small"
        loading={loading}
        onClick={() => void handleDeleteList()}
      >
        Delete list
      </Button>
    </Stack>
  );

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>
          {salesListData.shortDescription} - {salesListData.shortDescription}
        </Typography>
      </AccordionSummary>
      <Box key={salesListData.id} p={4} sx={{ bgcolor: "rgba(0, 0, 0, 0.07)" }}>
        {listHeaderButtons}
        <Box
          textAlign="center"
          sx={{ display: "flex", justifyContent: "center" }}
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
            <ConsultantCard
              key={list.id}
              consultantID={list.consultantId}
              salesNote={list.salesNote}
            />
          ))}
        </Stack>
      </Box>
    </Accordion>
  );
}
