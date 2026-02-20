import type { components } from "@api-types/openapi";
import { api } from "./api";

type GetOfferPagesResponse = components["schemas"]["GetOfferPagesResponse"];
type OfferPage = components["schemas"]["OfferPage"];
type OfferPageBody = components["schemas"]["OfferPageBody"];

type GetSalesListsResponse = components["schemas"]["GetSalesListsResponse"];
type SalesList = components["schemas"]["SalesList"];
type SalesListBody = components["schemas"]["SalesListBody"];

export const getOffers = (salesId: number) => {
  return api.get<GetOfferPagesResponse>(`/sales/${salesId}/offers`);
};

export const createOffer = (salesId: number, payload: OfferPageBody) => {
  return api.post<OfferPage>(`/sales/${salesId}/offers`, payload);
};

export const deleteOffer = (salesId: number, offerPageId: number) => {
  return api.delete(`/sales/${salesId}/offers/${offerPageId}`);
};

export const getSalesList = (salesId: number) => {
  return api.get<GetSalesListsResponse>(`/sales/${salesId}/lists`);
};

export const createSalesList = (salesId: number, payload: SalesListBody) => {
  return api.post<SalesList>(`/sales/${salesId}/lists`, payload);
};

export const deleteSalesList = (salesId: number, salesListId: number) => {
  return api.delete(`/sales/${salesId}/lists/${salesListId}`);
};
