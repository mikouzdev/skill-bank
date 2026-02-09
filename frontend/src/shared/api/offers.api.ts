import type { components } from "@api-types/openapi";
import { api } from "./api";

type GetOfferPagesResponse = components["schemas"]["GetOfferPagesResponse"];

export const getOffers = (salesId: number) => {
  return api.get<GetOfferPagesResponse>(`/sales/${salesId}/offers`);
};
