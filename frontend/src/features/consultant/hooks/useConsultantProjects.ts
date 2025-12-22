import { useEffect, useState } from "react";
import { getProjects } from "../api/consultants.api";
import type { components } from "@api-types/openapi";

type ProjectsResponse = components["schemas"]["GetProjectsResponseSchema"];

export function useConsultantProjects(id: number) {
  const [data, setData] = useState<ProjectsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    if (!id) return;
    async function fetchProjects() {
      try {
        setLoading(true);
        setError(null);

        const response = await getProjects(id);
        setData(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }
    void fetchProjects();
  }, [id]);

  return {
    data,
    loading,
    error,
  };
}
