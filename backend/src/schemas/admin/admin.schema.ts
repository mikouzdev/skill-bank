import { z } from "zod";

export const UserResponseSchema = z
  .object({
    name: z.string().meta({ example: "John Lee" }),
    email: z.string().meta({ example: "testi@hotmail.com" }),
    createdAt: z.date().meta({ example: "2025-12-19T14:01:24.308Z"}),
    updatedAt: z.date().meta({ example: "2025-12-19T14:01:24.308Z"}),
  })
  .meta({ id: "UserResponse" });

export const AllUsersResponseSchema = z
  .array(UserResponseSchema)
  .meta({ id: "AllUsersResponse" });