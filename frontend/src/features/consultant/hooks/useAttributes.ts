import { useEffect, useState } from "react";
import { getAttributes } from "../api/consultants.api";
import type { components } from "@api-types/openapi";
type AttributeResponse = components["schemas"]["GetAttributesResponse"];

export function useConsultantAttributes(id: number) {
  const [data, setData] = useState<AttributeResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchConsultantAttributes() {
      try {
        setLoading(true);
        setError(null);

        const response = await getAttributes(id);
        setData(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    void fetchConsultantAttributes();
  }, [id]);

  return {
    data,
    loading,
    error,
  };
}
