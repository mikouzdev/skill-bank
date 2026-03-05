import { z } from "zod";

export const ConsultantIdParamsSchema = z.object({
  consultantId: z.coerce.number().meta({ example: "1" }),
});

export const ConsultantResponseSchema = z
  .object({
    id: z.number().meta({ example: "1" }),
    userId: z.number().meta({ example: "1" }),
    description: z
      .string()
      .meta({ example: "I'm something of a fullstack developer myself." }),
    roleTitle: z.string().meta({ example: "Fullstack Developer" }),
    profilePictureUrl: z
      .string()
      .meta({ example: "/static/1_profile_picture.jpg" }),
    user: z.object({
      name: z.string().meta({ example: "John Lee" }),
    }),
  })
  .meta({ id: "ConsultantResponse" });

export const AllConsultantsResponseSchema = z
  .array(ConsultantResponseSchema)
  .meta({ id: "AllConsultantsResponse" });

export const UpdateConsultantSchema = ConsultantResponseSchema.omit({
  id: true,
  userId: true,
  profilePictureUrl: true,
})
  .extend({
    profilePicture: z.any(),
  })
  .partial();

export type ConsultantIdParams = z.infer<typeof ConsultantIdParamsSchema>;
export type ConsultantResponse = z.infer<typeof ConsultantResponseSchema>;
export type AllConsultantsResponse = z.infer<
  typeof AllConsultantsResponseSchema
>;
export type UpdateConsultant = z.infer<typeof UpdateConsultantSchema>;
