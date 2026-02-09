import { Container, Stack, Typography } from "@mui/material";
import { useAuth } from "../../../../app/hooks/useAuth";

import SalesOfferCard from "./SalesOfferCard";
import { useOffers } from "../../../../shared/hooks/useOffers";

export default function SalesOffersPage() {
  const { currentUser, isLoading: authLoading } = useAuth();
  const {
    offers,
    loading: offersLoading,
    error,
  } = useOffers(currentUser?.salespersonId ?? null);

  if (!currentUser?.salespersonId) return <Typography>Unauthorized</Typography>;

  if (offersLoading || authLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error while fetching offers.</Typography>;
  if (!offers || offers.length === 0)
    return <Typography>No offers found</Typography>;

  return (
    <Container>
      <Stack gap={2}>
        <Typography variant="h5">Offers</Typography>
        <Stack gap={2}>
          {offers.map((offer) => (
            <SalesOfferCard key={offer.id} offerData={offer} />
          ))}
        </Stack>
      </Stack>
    </Container>
  );
}
