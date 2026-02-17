import type { components } from "@api-types/openapi";
import { api } from "./api";

type GetOfferPagesResponse = components["schemas"]["GetOfferPagesResponse"];
type OfferPage = components["schemas"]["OfferPage"];
type OfferPageBody = components["schemas"]["OfferPageBody"];
type SalesList = components["schemas"]["GetSalesListsResponse"];

export const getOffers = (salesId: number) => {
  return api.get<GetOfferPagesResponse>(`/sales/${salesId}/offers`);
};

export const createOffer = (salesId: number, payload: OfferPageBody) => {
  return api.post<OfferPage>(`/sales/${salesId}/offers`, payload);
};

export const getSalesList = (salesId: number) => {
  return api.get<SalesList>(`/sales/${salesId}/lists`);
};
