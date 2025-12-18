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
    user: z.object({
      name: z.string().meta({ example: "John Lee" }),
    }),
  })
  .meta({ id: "ConsultantResponse" });

export const AllConsultantsResponseSchema = z
  .array(ConsultantResponseSchema)
  .meta({ id: "AllConsultantsResponse" });

export const UserSkill = z.object({
  SkillName: z.string().meta({ example: "Java" }),
});

export const UpdateConsultantSchema = ConsultantResponseSchema.omit({
  consultantId: true,
  userId: true,
  profilePictureUrl: true,
})
  .extend({
    profilePicture: z.any(),
    user: z
      .string()
      .transform((value, ctx) => {
        try {
          return JSON.parse(value) as unknown;
        } catch {
          ctx.issues.push({
            code: "custom",
            message: "Invalid JSON string",
            input: value,
          });
          return z.NEVER;
        }
      })
      .pipe(z.object({ name: z.string().meta({ example: "John Lee" }) })),
  })
  .partial();

export type ConsultantIdParams = z.infer<typeof ConsultantIdParamsSchema>;
export type ConsultantResponse = z.infer<typeof ConsultantResponseSchema>;
export type AllConsultantsResponse = z.infer<
  typeof AllConsultantsResponseSchema
>;
export type UpdateConsultant = z.infer<typeof UpdateConsultantSchema>;
