import type { components } from "@api-types/openapi";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";

import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { useNavigate } from "react-router-dom";
type Offer = components["schemas"]["OfferPage"];

interface Props {
  offerData: Offer;
}

export default function SalesOfferCard({ offerData }: Props) {
  const navigate = useNavigate();

  if (!offerData) return <Typography>No offer data available.</Typography>;

  return (
    <Paper key={offerData.id} sx={{ p: 1 }}>
      <Stack direction={"row"} alignItems={"center"} gap={2}>
        <Box>
          <DescriptionOutlinedIcon fontSize="large" />
        </Box>
        <Stack>
          <Typography variant="h6">{offerData.name}</Typography>
          <Typography>{offerData.shortDescription}</Typography>
        </Stack>
      </Stack>
      <Box display={"flex"} justifyContent={"flex-end"}>
        <Button
          size="small"
          onClick={() => void navigate(`/manage-offers/${offerData.id}`)}
        >
          View project
        </Button>
      </Box>
    </Paper>
  );
}
