import { z } from "zod";

export const registerUserSchema = z.object({
    nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    apellido: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    dni: z.string().min(6, "DNI inválido").optional(),
    telefono: z.string().optional()
});

export const loginUserSchema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(1, "La contraseña es obligatoria")
});

export const forgotPasswordSchema = z.object({
    email: z.string().email("Email inválido")
});

export const resetPasswordSchema = z.object({
    token: z.string().min(1, "El token es obligatorio"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres")
});

export const createUserSchema = z.object({
    nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    apellido: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    rol: z.enum(['Admin', 'Profesor', 'User']).optional(),
    dni: z.string().min(6, "DNI inválido").optional(),
    telefono: z.string().optional(),
    activo: z.boolean().optional()
});

export const updateUserSchema = createUserSchema.partial();

export const updateProfileSchema = z.object({
    nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres").optional(),
    apellido: z.string().min(2, "El apellido debe tener al menos 2 caracteres").optional(),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres").optional(),
    dni: z.string().min(6, "DNI inválido").optional(),
    telefono: z.string().optional()
});

export type RegisterUserType = z.infer<typeof registerUserSchema>;
export type LoginUserType = z.infer<typeof loginUserSchema>;
export type ForgotPasswordType = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordType = z.infer<typeof resetPasswordSchema>;
export type CreateUserType = z.infer<typeof createUserSchema>;
export type UpdateUserType = z.infer<typeof updateUserSchema>;
export type UpdateProfileType = z.infer<typeof updateProfileSchema>;
