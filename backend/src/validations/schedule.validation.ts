import { z } from "zod";

const horaRegex = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;

export const createScheduleSchema = z.object({
    actividadId: z.number().int().positive("La actividad es obligatoria"),
    dia: z.enum(['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'], { message: "Día inválido" }),
    horaInicio: z.string().regex(horaRegex, "Formato de hora inválido (HH:MM)"),
    horaFin: z.string().regex(horaRegex, "Formato de hora inválido (HH:MM)"),
    profesorId: z.number().int().positive().nullable().optional(),
    sala: z.string().max(100).optional(),
    cupo: z.number().int().positive("El cupo debe ser mayor a 0").nullable().optional(),
    activo: z.boolean().optional()
}).refine(data => data.horaFin > data.horaInicio, {
    message: "La hora de fin debe ser posterior a la de inicio",
    path: ["horaFin"]
});

export const updateScheduleSchema = z.object({
    actividadId: z.number().int().positive().optional(),
    dia: z.enum(['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo']).optional(),
    horaInicio: z.string().regex(horaRegex, "Formato de hora inválido (HH:MM)").optional(),
    horaFin: z.string().regex(horaRegex, "Formato de hora inválido (HH:MM)").optional(),
    profesorId: z.number().int().positive().nullable().optional(),
    sala: z.string().max(100).optional(),
    cupo: z.number().int().positive("El cupo debe ser mayor a 0").nullable().optional(),
    activo: z.boolean().optional()
});

export type CreateScheduleType = z.infer<typeof createScheduleSchema>;
export type UpdateScheduleType = z.infer<typeof updateScheduleSchema>;
