import type { components } from "@api-types/openapi";
import { api } from "../../../shared/api/api";

type PatchConsultantPageBody = components["schemas"]["PatchConsultantPageBody"];
type OfferPagePassword = components["schemas"]["OfferPagePassword"];
type OfferPageLoginResponseSchema =
  components["schemas"]["OfferPageLoginResponseSchema"];

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

export const customerOfferLogin = (
  salesId: number,
  offerPageId: number,
  password: OfferPagePassword
) => {
  return api.post<OfferPageLoginResponseSchema>(
    `/sales/${salesId}/offers/${offerPageId}`,
    password
  );
};
