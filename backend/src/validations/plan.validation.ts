import { z } from "zod";

export const createPlanSchema = z.object({
    nombre: z.string().min(2, "El nombre del plan es obligatorio"),
    descripcion: z.string().optional(),
    precio: z.number().positive("El precio debe ser mayor a 0"),
    duracionDias: z.number().int().positive("La duración debe ser mayor a 0"),
    limiteClases: z.number().int().positive("El límite de clases debe ser mayor a 0").nullable().optional(),
    activo: z.boolean().optional()
});

export const updatePlanSchema = createPlanSchema.partial();

export type CreatePlanType = z.infer<typeof createPlanSchema>;
export type UpdatePlanType = z.infer<typeof updatePlanSchema>;
