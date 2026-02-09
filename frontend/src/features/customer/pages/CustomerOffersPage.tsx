import { Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getOffers } from "../../../shared/api/offers.api";
import type { components } from "@api-types/openapi";
import CustomerSingleOffer from "./CustomerSingleOffer";

type GetOfferPagesResponse = components["schemas"]["GetOfferPagesResponse"];

export default function CustomerOffersPage() {
  const [offers, setOffers] = useState<GetOfferPagesResponse>([]);

  useEffect(() => {
    async function fetchOffers(salesId: number) {
      try {
        const response = await getOffers(salesId);
        setOffers(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    void fetchOffers(1); // 1 placeholder of salesId
  }, []);

  const mappedOffers = offers.map((offer) => (
    <CustomerSingleOffer key={offer.id} offerData={offer} />
  ));

  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        Offers
      </Typography>
      {offers.length > 0 ? (
        mappedOffers
      ) : (
        <Typography>No offers available.</Typography>
      )}
    </Container>
  );
}
