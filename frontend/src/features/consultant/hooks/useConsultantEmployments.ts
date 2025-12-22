import { useEffect, useState } from "react";

import type { components } from "../../../../../shared/generated/api-types/openapi";
import { getEmployments } from "../api/consultants.api";

type ConsultantEmploymentsResponse =
  components["schemas"]["EmploymentListResponse"];

export function useConsultantEmployments(id: number) {
  const [data, setData] = useState<ConsultantEmploymentsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchConsultantEmployments() {
      try {
        setLoading(true);
        setError(null);

        const response = await getEmployments(id);
        setData(response.data);
      } catch (error) {
        console.log(error);
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    void fetchConsultantEmployments();
  }, [id]);

  return {
    data,
    loading,
    error,
  };
}
