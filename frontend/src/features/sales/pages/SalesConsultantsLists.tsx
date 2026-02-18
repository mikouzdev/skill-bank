import { Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getSalesList } from "../../../shared/api/offers.api";
import type { components } from "@api-types/openapi";
import SalesSingleList from "../components/SalesSingleList";
import { useAuth } from "../../../app/hooks/useAuth";

type SalesList = components["schemas"]["GetSalesListsResponse"];

export default function SalesConsultantsLists() {
  const { isLoading, currentUser } = useAuth();

  const [lists, setLists] = useState<SalesList>([]);

  useEffect(() => {
    if (isLoading) return;
    if (!currentUser?.salespersonId) return;
    async function fetchLists(salesId: number) {
      try {
        const response = await getSalesList(salesId);
        setLists(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    void fetchLists(currentUser?.salespersonId);
  }, [isLoading, currentUser?.salespersonId]);

  // updates local state of lists on delete.
  function handleOnDelete(salesListId: number) {
    setLists((prev) => prev.filter((l) => l.id !== salesListId));
  }

  const mappedLists = lists.map((list) => (
    <SalesSingleList
      key={list.id}
      salesListData={list}
      onDelete={handleOnDelete}
    />
  ));

  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        Consultant lists
      </Typography>

      {lists.length > 0 ? (
        mappedLists
      ) : (
        <Typography>No lists available.</Typography>
      )}
    </Container>
  );
}
