import type { components } from "@api-types/openapi";
import { useEffect, useState } from "react";
import { getSkillTags } from "../api/consultants.api";

type SkillTagList = components["schemas"]["SkillTagList"];

export function useSkills() {
  const [data, setData] = useState<SkillTagList>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    async function fetchSkillTags() {
      try {
        setLoading(true);
        setError(false);

        const response = await getSkillTags();
        setData(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    void fetchSkillTags();
  }, []);

  return {
    skillPool: data,
    loading,
    error,
  };
}
