import { z } from "zod";

export const createCheckInSchema = z.object({
    dni: z.string().min(6, "DNI inválido").optional(),
    usuarioId: z.number().int().positive().optional(),
    notas: z.string().max(255).optional()
}).refine(data => data.dni !== undefined || data.usuarioId !== undefined, {
    message: "Se requiere el DNI o el id del usuario"
});

export type CreateCheckInType = z.infer<typeof createCheckInSchema>;
