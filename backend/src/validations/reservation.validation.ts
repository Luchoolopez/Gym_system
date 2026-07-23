import { z } from "zod";

export const createReservationSchema = z.object({
    horarioId: z.number().int().positive("El horario es obligatorio"),
    fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)")
});

// Alta de reserva por parte del Admin/Profesor sobre un socio (asistencia presencial)
export const adminCreateReservationSchema = z.object({
    usuarioId: z.number().int().positive("El usuario es obligatorio"),
    horarioId: z.number().int().positive("El horario es obligatorio"),
    fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)")
});

export const attendanceSchema = z.object({
    estado: z.enum(['ATTENDED', 'NO_SHOW'], { message: "Estado inválido" })
});

export type CreateReservationType = z.infer<typeof createReservationSchema>;
export type AdminCreateReservationType = z.infer<typeof adminCreateReservationSchema>;
export type AttendanceType = z.infer<typeof attendanceSchema>;
