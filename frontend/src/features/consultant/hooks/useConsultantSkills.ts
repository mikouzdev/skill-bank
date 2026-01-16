import { useEffect, useState } from "react";
import { getSkills } from "../api/consultants.api";
import type { components } from "@api-types/openapi";
type SkillsResponse = components["schemas"]["ConsultantSkill"][];

export function useConsultantSkills(id: number) {
  const [data, setData] = useState<SkillsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchConsultantSkills() {
      try {
        setLoading(true);
        setError(null);

        const response = await getSkills(id);
        setData(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    void fetchConsultantSkills();
  }, [id]);

  return {
    data,
    loading,
    error,
  };
}
