import z from "zod";

export const GetConsultantSchema = z.object({
  consultantId: z.number(),
});
