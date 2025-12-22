import { useEffect, useState } from "react";
import { getConsultant } from "../api/consultants.api";
import type { components } from "../../../../../shared/generated/api-types/openapi";

type ConsultantResponse = components["schemas"]["ConsultantResponse"];

export function useConsultant(id: number) {
  const [data, setData] = useState<ConsultantResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchConsultant() {
      try {
        setLoading(true);
        setError(null);

        const response = await getConsultant(id);
        setData(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    void fetchConsultant();
  }, [id]);

  return {
    data,
    loading,
    error,
  };
}
