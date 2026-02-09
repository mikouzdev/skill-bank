import { useEffect, useState } from "react";
import type { components } from "@api-types/openapi";
import { getOffers } from "../api/offers.api";

type GetOfferPagesResponse = components["schemas"]["GetOfferPagesResponse"];

export function useOffers(salesId: number | null) {
  const [data, setData] = useState<GetOfferPagesResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    async function fetchOffers() {
      try {
        if (salesId === null) return;
        setLoading(true);
        setError(null);

        const response = await getOffers(salesId);
        setData(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    void fetchOffers();
  }, [salesId]);

  return {
    offers: data,
    loading,
    error,
  };
}
