import { Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getSalesList } from "../../../shared/api/offers.api";
import type { components } from "@api-types/openapi";
import SalesSingleList from "../components/SalesSingleList";

type SalesList = components["schemas"]["GetSalesListsResponse"];

export default function SalesConsultantsLists() {
  const [lists, setLists] = useState<SalesList>([]);

  useEffect(() => {
    async function fetchLists(salesId: number) {
      try {
        const response = await getSalesList(salesId);
        setLists(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    void fetchLists(1); // 1 placeholder of salesId
  }, []);

  const mappedOffers = lists.map((list) => (
    <SalesSingleList key={list.id} salesListData={list} />
  ));

  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        Consultant lists
      </Typography>

      {lists.length > 0 ? (
        mappedOffers
      ) : (
        <Typography>No offers available. :::</Typography>
      )}
    </Container>
  );
}
