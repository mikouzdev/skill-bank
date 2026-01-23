import { z } from "zod";

export const UserResponseSchema = z
  .object({
    id: z.coerce.number().meta({ example: "1" }),
    name: z.string().meta({ example: "John Lee" }),
    email: z.string().meta({ example: "testi@hotmail.com" }),
    createdAt: z.date().meta({ example: "2025-12-19T14:01:24.308Z"}),
    updatedAt: z.date().meta({ example: "2025-12-19T14:01:24.308Z"}),
    roles: z.array(
      z.object({
        role: z.enum(["CONSULTANT", "SALESPERSON", "CUSTOMER", "ADMIN"]).meta({ example: "CONSULTANT" }),
    })).min(1)
    .meta({
      example: [
        { role: "CONSULTANT" },
        { role: "SALESPERSON" },
      ],
    }),
  })
  .meta({ id: "UserResponse" });

export const AllUsersResponseSchema = z
  .array(UserResponseSchema)
  .meta({ id: "AllUsersResponse" });

export const UserBodySchema = UserResponseSchema.omit({
  updatedAt: true,
  createdAt: true,
  id: true,
}).extend({
  passwordHash: z.string().meta({ example: "hashedtestpassword" }),
}).meta({ id: "UserBody" });

export const FullUserResponseSchema = UserResponseSchema.extend({
  passwordHash: z.string().meta({ example: "hashedtestpassword" }),
}).meta({ id: "FullUserResponse" });

export const UserIdParamsSchema = z.object({
  userId: z.coerce.number().meta({ example: "1" }),
});