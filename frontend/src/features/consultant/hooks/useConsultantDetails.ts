import { useConsultant } from "./useConsultant";
import { useConsultantEmployments } from "./useConsultantEmployments";

export function useConsultantDetails(id: number) {
  const consultant = useConsultant(id);
  const employments = useConsultantEmployments(id);

  return {
    consultant: consultant.data,
    employments: employments.data,
    loading: consultant.loading || employments.loading,
    error: consultant.error || employments.error,
  };
}
