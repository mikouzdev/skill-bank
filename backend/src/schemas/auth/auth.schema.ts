import z from "zod";

//REQ Schemas
export const LoginSchema = z
  .object({
    email: z.email().meta({ example: "user@example.com" }),
    password: z.string().min(6).meta({ example: "Password" }),
  })
  .meta({ id: "LoginRequest" });

//RES Schemas
export const AuthResponseSchema = z
  .object({
    token: z.string().meta({ example: "jwt.token" }),
    success: z.boolean().meta({ example: "true" }),
  })
  .meta({ id: "AuthResponse" });

export const LogoutResponseSchema = z
  .object({
    success: z.boolean().meta({ example: true }),
    message: z.string().meta({ example: "Logged out successfully" }),
  })
  .meta({ id: "LogoutResponse" });

export const MeResponseSchema = z
  .object({
    id: z.number().int().meta({ example: 1 }),
    email: z.email().meta({ example: "user@example.com" }),
    name: z.string().meta({ example: "Alice Consult" }),
    roles: z
      .array(z.enum(["CONSULTANT", "SALESPERSON", "CUSTOMER", "ADMIN"]))
      .meta({ example: ["CONSULTANT"] }),
    consultantId: z.number().int().nullable().meta({ example: 12 }),
    salespersonId: z.number().int().nullable().meta({ example: null }),
    customerId: z.number().int().nullable().meta({ example: null }),
  })
  .meta({ id: "MeResponse" });

export const TokenPayloadSchema = z.object({
  userId: z.number().int(),
  email: z.email().optional(),
});

export const RoleBodySchema = z.object({
  role: z.enum(["CONSULTANT", "SALESPERSON", "CUSTOMER", "ADMIN"]),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
export type LogoutResponse = z.infer<typeof LogoutResponseSchema>;
export type MeResponse = z.infer<typeof MeResponseSchema>;
export type TokenPayload = z.infer<typeof TokenPayloadSchema>;
