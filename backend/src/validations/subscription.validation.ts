import { z } from "zod";

const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;

export const createSubscriptionSchema = z.object({
    usuarioId: z.number().int().positive("El usuario es obligatorio"),
    planId: z.number().int().positive("El plan es obligatorio"),
    fechaInicio: z.string().regex(fechaRegex, "Formato de fecha inválido (YYYY-MM-DD)").optional()
});

export const renewSubscriptionSchema = z.object({
    planId: z.number().int().positive("Plan inválido").optional(),
    fechaInicio: z.string().regex(fechaRegex, "Formato de fecha inválido (YYYY-MM-DD)").optional()
});

export type CreateSubscriptionType = z.infer<typeof createSubscriptionSchema>;
export type RenewSubscriptionType = z.infer<typeof renewSubscriptionSchema>;
