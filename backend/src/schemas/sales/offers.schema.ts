import { z } from "zod";

export const ConsultantPageSchema = z
  .object({
    id: z.number().meta({ example: "1" }),
    offerPageId: z.number().meta({ example: "1" }),
    consultantId: z.number().meta({ example: "1" }),
    showInfo: z.boolean().meta({ example: "true" }),
    isAccepted: z.boolean().meta({ example: "true" }),
    customerReview: z.string().nullable().meta({ example: "esimerkki teksti" }),
  })
  .meta({ id: "ConsultantPage" });

export const OfferPageSchema = z
  .object({
    id: z.number().meta({ example: "1" }),
    salespersonId: z.number().meta({ example: "1" }),
    customerId: z.number().meta({ example: "1" }),
    description: z.string().nullable().meta({ example: "esimerkki teksti" }),
    name: z.string().nullable().meta({ example: "esimerkki nimi" }),
    shortDescription: z
      .string()
      .nullable()
      .meta({ example: "esimerkki teksti" }),
    consultantPages: z.array(ConsultantPageSchema),
  })
  .meta({ id: "OfferPage" });

export const GetOfferPagesResponseSchema = z
  .array(OfferPageSchema)
  .meta({ id: "GetOfferPagesResponse" });

export const OfferPageBodySchema = OfferPageSchema.omit({
  id: true,
  salespersonId: true,
})
  .extend({
    password: z.string().meta({ example: "testpassword" }),
  })
  .meta({ id: "OfferPageBody" });

export const PutOfferPageParamsSchema = z.object({
  salesId: z.coerce.number().meta({ example: "1" }),
  offerPageId: z.coerce.number().meta({ example: "2" }),
});

export const ConsultantPagePartialSchema = ConsultantPageSchema.partial({
  id: true,
  offerPageId: true,
  showInfo: true,
  isAccepted: true,
  customerReview: true,
});

export const OfferPageBodyPartialSchema = OfferPageBodySchema.partial({
  password: true,
  customerId: true,
  description: true,
  shortDescription: true,
  name: true,
})
  .extend({
    consultantPages: z.array(ConsultantPagePartialSchema),
  })
  .meta({ id: "OfferPageBodyPartial" });

export const PatchConsultantPageParamsSchema = z.object({
  salesId: z.coerce.number().meta({ example: "1" }),
  offerPageId: z.coerce.number().meta({ example: "1" }),
  consultantPageId: z.coerce.number().meta({ example: "1" }),
});

export const PatchConsultantPageBodySchema = z
  .object({
    isAccepted: z.boolean().meta({ example: "true" }),
    customerReview: z.string().nullable().meta({ example: "esimerkki teksti" }),
  })
  .partial({
    customerReview: true,
  })
  .meta({ id: "PatchConsultantPageBody" });

export const OfferPagePasswordSchema = z
  .object({
    password: z.string().min(6).meta({ example: "Password" }),
  })
  .meta({ id: "OfferPagePassword" });

export const OfferPageLoginResponseSchema = z
  .object({
    token: z.string().meta({ example: "jwt.token" }),
    offerPage: OfferPageSchema,
  })
  .meta({ id: "OfferPageLoginResponseSchema" });
