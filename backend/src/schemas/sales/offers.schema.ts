import { z } from "zod";

export const ConsultantPageSchema = z
  .object({
    id: z.number().meta({ example: "1" }),
    offerPageId: z.number().meta({ example: "1" }),
    consultantId: z.number().meta({ example: "1" }),
    showInfo: z.boolean().meta({ example: "true" }),
  })
  .meta({ id: "ConsultantPage" });

export const OfferPageSchema = z
  .object({
    id: z.number().meta({ example: "1" }),
    salespersonId: z.number().meta({ example: "1" }),
    customerId: z.number().meta({ example: "1" }),
    description: z.string().nullable().meta({ example: "esimerkki teksti" }),
    name: z.string().nullable().meta({ example: "esimerkki nimi" }),
    shortDescription: z.string().nullable().meta({ example: "esimerkki teksti" }),
    consultantPages: z.array(ConsultantPageSchema),
  })
  .meta({ id: "OfferPage" });

export const GetOfferPagesResponseSchema = z
  .array(OfferPageSchema)
  .meta({ id: "GetOfferPagesResponse" });

export const OfferPageBodySchema = OfferPageSchema.omit({
  id: true,
  salespersonId: true,
}).extend({
  passwordHash: z.string().meta({ example: "hashedtestpassword" }),
}).meta({ id: "OfferPageBody" });