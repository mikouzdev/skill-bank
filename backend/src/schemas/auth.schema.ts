import z from "zod";


//REQ Schemas
export const LoginSchema = z.object({
    email: z.email().meta({ example: "user@example.com" }),
    password: z.string().min(6).meta({ example: "Password"}),
}).meta({ id: "LoginRequest"});

//RES Schemas
export const AuthResponseSchema = z.object({
    token: z.string().meta({ example: "jwt.token"}),
    success: z.boolean().meta({ example: "true"}),
}).meta({ id: "AuthResponse"});

export const LogoutResponseSchema = z.object({
    success: z.boolean().meta({ example: true }), 
    message: z.string().meta({ example: "Logged out successfully"})
}).meta({ id: "LogoutResponse"})



export type LoginInput = z.infer<typeof LoginSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
export type LogoutResponse = z.infer<typeof LogoutResponseSchema>;