import { z } from "zod";

export const ConsultantIdParamsSchema = z.object({
  consultantId: z.coerce.number(),
});

export const ConsultantResponseSchema = z.object({
  consultantId: z.number(),
  userId: z.number(),
  description: z.string(),
  roleTitle: z.string(),
  profilePictureUrl: z.string(),
});

export type ConsultantIdParams = z.infer<typeof ConsultantIdParamsSchema>;
export type ConsultantResponse = z.infer<typeof ConsultantResponseSchema>;
