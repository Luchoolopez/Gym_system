import { z } from "zod";

export const createPaymentSchema = z.object({
    suscripcionId: z.number().int().positive("La suscripción es obligatoria"),
    monto: z.number().positive("El monto debe ser mayor a 0"),
    metodo: z.enum(['CASH', 'TRANSFER', 'CARD', 'MERCADOPAGO'], { message: "Método de pago inválido" }),
    fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)").optional(),
    notas: z.string().max(255).optional()
});

export const updatePaymentSchema = z.object({
    monto: z.number().positive("El monto debe ser mayor a 0").optional(),
    metodo: z.enum(['CASH', 'TRANSFER', 'CARD', 'MERCADOPAGO'], { message: "Método de pago inválido" }).optional(),
    fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)").optional(),
    notas: z.string().max(255).optional()
});

export type CreatePaymentType = z.infer<typeof createPaymentSchema>;
export type UpdatePaymentType = z.infer<typeof updatePaymentSchema>;
