import { z } from "zod";

export const SalesListItemSchema = z
  .object({
    id: z.number().meta({ example: "1" }),
    salesListId: z.number().meta({ example: "1" }),
    consultantId: z.number().meta({ example: "1" }),
    listPosition: z.number().meta({ example: "1" }),
    isAccepted: z.boolean().meta({ example: "true" }),
    isHidden: z.boolean().meta({ example: "true" }),
    salesNote: z.string().meta({ example: "esimerkki teksti" }),
  })
  .meta({ id: "SalesListItem" });

export const SalesListItemBodySchema = SalesListItemSchema.omit({
  id: true,
  listPosition: true,
  salesListId: true,
}).meta({ id: "SalesListItemBody" });

export const SalesListSchema = z
  .object({
    id: z.number().meta({ example: "1" }),
    salespersonId: z.number().meta({ example: "1" }),
    customerId: z.number().meta({ example: "1" }),
    listPosition: z.number().meta({ example: "1" }),
    description: z.string().meta({ example: "esimerkki teksti" }),
    shortDescription: z.string().meta({ example: "esimerkki teksti" }),
    isReviewDone: z.boolean().meta({ example: "true" }),
    salesListItems: z.array(SalesListItemSchema),
  })
  .meta({ id: "SalesList" });

export const GetSalesListsResponseSchema = z
  .array(SalesListSchema)
  .meta({ id: "GetSalesListsResponse" });

export const SalesListBodySchema = SalesListSchema.omit({
  id: true,
  salespersonId: true,
  listPosition: true,
  salesListItems: true,
}).extend({
  salesListItems: z.array(SalesListItemBodySchema),
}).meta({ id: "SalesListBody" });

export const PutSalesListParamsSchema = z.object({
  salesId: z.coerce.number().meta({ example: "1" }),
  salesListId: z.coerce.number().meta({ example: "2" }),
});

export const SalesListItemPartialSchema = SalesListItemBodySchema.partial({
  isAccepted: true,
  isHidden: true,
  salesNote: true
});

export const SalesListBodyPartialSchema = SalesListBodySchema.partial({
  customerId: true,
  description: true,
  shortDescription: true,
  isReviewDone: true,
})
  .extend({
    salesListItems: z.array(SalesListItemPartialSchema),
  })
  .meta({ id: "SalesListBodyPartial" });