import { z } from "zod";

export const SalesIdParamsSchema = z.object({
  salesId: z.coerce.number().meta({ example: "1" }),
});
