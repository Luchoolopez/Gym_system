import { z } from "zod";

export const createActivitySchema = z.object({
    nombre: z.string().min(2, "El nombre de la actividad es obligatorio"),
    descripcion: z.string().optional(),
    activo: z.boolean().optional()
});

export const updateActivitySchema = createActivitySchema.partial();

export type CreateActivityType = z.infer<typeof createActivitySchema>;
export type UpdateActivityType = z.infer<typeof updateActivitySchema>;
