import { z } from "zod";

export const AttributeSchema = z
  .object({
    id: z.number().meta({ example: "1" }),
    consultantId: z.number().meta({ example: "1" }),
    createdAt: z.date().meta({ example: "2025-12-19T14:01:24.308Z" }),
    value: z.string().meta({ example: "Example value" }),
    label: z.string().meta({ example: "Example value" }),
    type: z.enum(["TEXT", "LINK"]).meta({ example: "TEXT" }),
    visibility: z.enum(["LIMITED", "PUBLIC"]).meta({ example: "PUBLIC" }),
  })
  .meta({ id: "Attribute" });

export const GetAttributesResponseSchema = z
  .array(AttributeSchema)
  .meta({ id: "GetAttributesResponse" });

export const AttributeBodySchema = AttributeSchema.omit({
  id: true,
  consultantId: true,
  createdAt: true,
}).meta({ id: "AttributeBody" });

export const AttributeIdParamsSchema = z.object({
  attributeId: z.coerce.number().meta({ example: "1" }),
}).meta({ id: "AttributeIdParams" });