import { z } from "zod";

export const OfferPageSchema = z
  .object({
    id: z.number().meta({ example: "1" }),
    
  })
  .meta({ id: "OfferPage" });

export const GetOfferPagesResponseSchema = z
  .array(OfferPageSchema)
  .meta({ id: "GetOfferPagesResponse" });