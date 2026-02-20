import type { components } from "@api-types/openapi";
import { api } from "../../../shared/api/api";

type PatchConsultantPageBody = components["schemas"]["PatchConsultantPageBody"];

export const setAccepted = (
  salesId: number,
  offerPageId: number,
  consultantPageId: number,
  payload: PatchConsultantPageBody
) => {
  return api.patch<PatchConsultantPageBody>(
    `/sales/${salesId}/offers/${offerPageId}/consultants/${consultantPageId}`,
    payload
  );
};
