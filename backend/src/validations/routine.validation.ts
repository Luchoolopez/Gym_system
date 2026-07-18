import { z } from "zod";

export const createRoutineSchema = z.object({
    usuarioId: z.number().int().positive("El usuario es obligatorio"),
    titulo: z.string().min(2, "El título es obligatorio").max(150),
    contenido: z.string().min(1, "El contenido es obligatorio")
});

export const updateRoutineSchema = z.object({
    titulo: z.string().min(2, "El título es obligatorio").max(150).optional(),
    contenido: z.string().min(1, "El contenido es obligatorio").optional()
});

export type CreateRoutineType = z.infer<typeof createRoutineSchema>;
export type UpdateRoutineType = z.infer<typeof updateRoutineSchema>;
