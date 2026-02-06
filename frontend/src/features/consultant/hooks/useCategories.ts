import type { components } from "@api-types/openapi";
import { useEffect, useState } from "react";
import { getCategories } from "../../../shared/api/categories.api";

type SkillCategories = components["schemas"]["SkillCategories"];

export function useCategories() {
  const [data, setData] = useState<SkillCategories>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    async function fetchSkillCategories() {
      try {
        setLoading(true);
        setError(false);

        const response = await getCategories();
        setData(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    void fetchSkillCategories();
  }, []);

  return {
    skillCategories: data,
    loading,
    error,
  };
}
