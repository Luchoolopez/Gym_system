import { z } from "zod";

export const createClosureSchema = z.object({
    fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)").optional(),
    notas: z.string().max(255).optional()
});

export type CreateClosureType = z.infer<typeof createClosureSchema>;
