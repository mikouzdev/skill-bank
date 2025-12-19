import { z } from "zod";

export const ConsultantIdParamsSchema = z
  .object({
    consultantId: z.coerce.number().meta({ example: "1" }),
  })
  .meta({ id: "ConsultantIdParams" });

export const ConsultantResponseSchema = z
  .object({
    consultantId: z.number().meta({ example: "1" }),
    userId: z.number().meta({ example: "1" }),
    description: z
      .string()
      .meta({ example: "I'm something of a fullstack developer myself." }),
    roleTitle: z.string().meta({ example: "Fullstack Developer" }),
    profilePictureUrl: z
      .string()
      .meta({ example: "/static/1_profile_picture.jpg" }),
  })
  .meta({ id: "ConsultantResponse" });

export const AllConsultantsResponseSchema = z
  .array(ConsultantResponseSchema)
  .meta({ id: "AllConsultantsResponse" });

export type ConsultantIdParams = z.infer<typeof ConsultantIdParamsSchema>;
export type ConsultantResponse = z.infer<typeof ConsultantResponseSchema>;
export type AllConsultantsResponse = z.infer<
  typeof AllConsultantsResponseSchema
>;
