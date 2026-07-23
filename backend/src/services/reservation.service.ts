import { AppError } from "../utils/app.error";
import { Op } from "sequelize";
import { sequelize } from "../config/database";
import { ClassReservation, Schedule, Activity, User } from "../models/index";
import { CreateReservationType, AdminCreateReservationType, AttendanceType } from "../validations/reservation.validation";
import { findSuscripcionVigente, clasesRestantes } from "./subscription.service";
import { hoyStr, diaDeLaSemana, combinarFechaHora } from "../utils/date.handle";
import config from "../config/config";

// Estados calculados de una clase para una fecha (como en el sitio de referencia)
type EstadoClase = 'DISPONIBLE' | 'COMPLETA' | 'CERRADA' | 'EN_CURSO' | 'FINALIZADA';

export class ReservationService {

    async getClasesDelDia(fecha?: string, actividadId?: number) {
        const fechaConsulta = fecha ?? hoyStr();
        const dia = diaDeLaSemana(fechaConsulta);

        const where: any = { is_active: true, day_of_week: dia };
        if (actividadId) {
            where.activity_id = actividadId;
        }

        const horarios = await Schedule.findAll({
            where,
            include: [
                { model: Activity, as: 'actividad', where: { is_active: true } },
                { model: User, as: 'profesor' }
            ],
            order: [['start_time', 'ASC']]
        });

        // Una sola query agrupada para los cupos de todos los horarios del día (evita N+1)
        const reservasPorHorario = await this.contarReservasDelDia(horarios.map(h => h.id), fechaConsulta);

        const clases = [];
        for (const horario of horarios) {
            const reservados = reservasPorHorario.get(horario.id) ?? 0;
            clases.push({
                horarioId: horario.id,
                fecha: fechaConsulta,
                actividad: horario.actividad ? { id: horario.actividad.id, nombre: horario.actividad.name } : undefined,
                profesor: horario.profesor ? {
                    id: horario.profesor.id,
                    nombre: horario.profesor.first_name,
                    apellido: horario.profesor.last_name
                } : null,
                sala: horario.room,
                horaInicio: horario.start_time,
                horaFin: horario.end_time,
                cupo: horario.capacity,
                reservados,
                cuposDisponibles: horario.capacity == null ? null : Math.max(0, horario.capacity - reservados),
                estado: this.calcularEstado(horario, fechaConsulta, reservados)
            });
        }

        return clases;
    }

    async createReserva(userId: number, createData: CreateReservationType) {
        const horario = await Schedule.findByPk(createData.horarioId, {
            include: [{ model: Activity, as: 'actividad' }]
        });
        if (!horario || !horario.is_active) {
            throw new AppError("Horario no encontrado", 404);
        }

        if (diaDeLaSemana(createData.fecha) !== horario.day_of_week) {
            throw new AppError(`La fecha no corresponde al día de la clase (${horario.day_of_week})`, 400);
        }

        // Validar suscripción vigente y paga
        const suscripcion = await findSuscripcionVigente(userId);
        if (!suscripcion) {
            throw new AppError("No tenés una suscripción vigente", 400);
        }
        if (suscripcion.payment_status !== 'PAID') {
            throw new AppError("Tu suscripción tiene el pago pendiente", 400);
        }

        const restantes = clasesRestantes(suscripcion);
        if (restantes !== null && restantes <= 0) {
            throw new AppError("No te quedan clases disponibles en tu plan", 400);
        }

        // Validar estado de la clase (ventana de reserva y cupo)
        const reservados = await this.contarReservas(horario.id, createData.fecha);
        const estado = this.calcularEstado(horario, createData.fecha, reservados);
        if (estado === 'COMPLETA') {
            throw new AppError("La clase está completa", 400);
        }
        if (estado === 'CERRADA') {
            throw new AppError("La clase ya cerró sus reservas", 400);
        }
        if (estado === 'EN_CURSO' || estado === 'FINALIZADA') {
            throw new AppError("La clase ya empezó", 400);
        }

        // Si existe una reserva cancelada para la misma clase, se reactiva
        const existente = await ClassReservation.findOne({
            where: {
                user_id: userId,
                schedule_id: horario.id,
                reservation_date: createData.fecha
            }
        });

        if (existente) {
            if (existente.status !== 'CANCELLED') {
                throw new AppError("Ya tenés una reserva para esta clase", 409);
            }
            existente.status = 'RESERVED';
            await existente.save();
            return this.getReservaById(existente.id);
        }

        const nueva = await ClassReservation.create({
            user_id: userId,
            schedule_id: horario.id,
            reservation_date: createData.fecha
        });

        return this.getReservaById(nueva.id);
    }

    // Alta presencial por Admin/Profesor: anota a un socio en la clase.
    // A diferencia de createReserva, no valida la ventana de reserva ni la suscripción
    // (el staff tiene contexto del socio que está físicamente en el club), pero sí respeta el cupo.
    async adminCreateReserva(createData: AdminCreateReservationType) {
        const usuario = await User.findByPk(createData.usuarioId);
        if (!usuario || !usuario.is_active) {
            throw new AppError("Usuario no encontrado", 404);
        }

        const horario = await Schedule.findByPk(createData.horarioId);
        if (!horario || !horario.is_active) {
            throw new AppError("Horario no encontrado", 404);
        }

        if (diaDeLaSemana(createData.fecha) !== horario.day_of_week) {
            throw new AppError(`La fecha no corresponde al día de la clase (${horario.day_of_week})`, 400);
        }

        const existente = await ClassReservation.findOne({
            where: {
                user_id: createData.usuarioId,
                schedule_id: horario.id,
                reservation_date: createData.fecha
            }
        });

        if (existente && existente.status !== 'CANCELLED') {
            throw new AppError("El socio ya está anotado en esta clase", 409);
        }

        // Respetar el cupo (no sobrevender)
        const reservados = await this.contarReservas(horario.id, createData.fecha);
        if (horario.capacity != null && reservados >= horario.capacity) {
            throw new AppError("La clase está completa", 400);
        }

        if (existente) {
            existente.status = 'RESERVED';
            await existente.save();
            return this.getReservaById(existente.id);
        }

        const nueva = await ClassReservation.create({
            user_id: createData.usuarioId,
            schedule_id: horario.id,
            reservation_date: createData.fecha
        });

        return this.getReservaById(nueva.id);
    }

    // Baja por Admin/Profesor: quita a un socio de la clase sin importar el dueño ni la ventana.
    async adminCancelReserva(reservaId: number) {
        const reserva = await ClassReservation.findByPk(reservaId);
        if (!reserva) {
            throw new AppError("Reserva no encontrada", 404);
        }
        if (reserva.status === 'CANCELLED') {
            throw new AppError("La reserva ya está cancelada", 400);
        }

        // Si ya había asistido con un plan limitado, se le devuelve la clase consumida
        if (reserva.status === 'ATTENDED') {
            const suscripcion = await findSuscripcionVigente(reserva.user_id);
            if (suscripcion && suscripcion.plan?.class_limit != null && suscripcion.classes_used > 0) {
                suscripcion.classes_used -= 1;
                await suscripcion.save();
            }
        }

        reserva.status = 'CANCELLED';
        await reserva.save();

        return this.getReservaById(reserva.id);
    }

    async cancelarReserva(userId: number, reservaId: number) {
        const reserva = await ClassReservation.findByPk(reservaId, {
            include: [{ model: Schedule, as: 'horario' }]
        });
        if (!reserva || reserva.user_id !== userId) {
            throw new AppError("Reserva no encontrada", 404);
        }
        if (reserva.status !== 'RESERVED') {
            throw new AppError("La reserva no se puede cancelar", 400);
        }

        const inicio = combinarFechaHora(reserva.reservation_date, reserva.horario!.start_time);
        const cierre = new Date(inicio.getTime() - config.reservationCloseMinutes * 60000);
        if (new Date() >= cierre) {
            throw new AppError("Ya no se puede cancelar la reserva (la clase está por empezar)", 400);
        }

        reserva.status = 'CANCELLED';
        await reserva.save();

        return this.getReservaById(reserva.id);
    }

    async getMisReservas(userId: number) {
        const reservas = await ClassReservation.findAll({
            where: { user_id: userId },
            include: [{
                model: Schedule,
                as: 'horario',
                include: [{ model: Activity, as: 'actividad' }]
            }],
            order: [['reservation_date', 'DESC'], ['id', 'DESC']]
        });

        return reservas.map(r => this.mapToDto(r));
    }

    async getInscriptos(scheduleId: number, fecha: string) {
        const horario = await Schedule.findByPk(scheduleId, {
            include: [{ model: Activity, as: 'actividad' }]
        });
        if (!horario) {
            throw new AppError("Horario no encontrado", 404);
        }

        const reservas = await ClassReservation.findAll({
            where: {
                schedule_id: scheduleId,
                reservation_date: fecha,
                status: { [Op.ne]: 'CANCELLED' }
            },
            include: [{ model: User, as: 'usuario' }],
            order: [['created_at', 'ASC']]
        });

        return {
            horarioId: horario.id,
            actividad: horario.actividad?.name,
            fecha,
            cupo: horario.capacity,
            reservados: reservas.length,
            inscriptos: reservas.map(r => ({
                reservaId: r.id,
                estado: r.status,
                usuario: r.usuario ? {
                    id: r.usuario.id,
                    nombre: r.usuario.first_name,
                    apellido: r.usuario.last_name,
                    dni: r.usuario.dni
                } : undefined
            }))
        };
    }

    async marcarAsistencia(reservaId: number, data: AttendanceType) {
        const reserva = await ClassReservation.findByPk(reservaId);
        if (!reserva) {
            throw new AppError("Reserva no encontrada", 404);
        }
        if (reserva.status !== 'RESERVED') {
            throw new AppError("La reserva ya fue procesada o está cancelada", 400);
        }

        reserva.status = data.estado;
        await reserva.save();

        // Si asistió y su plan es limitado, se descuenta una clase
        if (data.estado === 'ATTENDED') {
            const suscripcion = await findSuscripcionVigente(reserva.user_id);
            if (suscripcion && suscripcion.plan?.class_limit != null) {
                suscripcion.classes_used += 1;
                await suscripcion.save();
            }
        }

        return this.getReservaById(reserva.id);
    }

    // --- Helpers ---

    // Cupos ocupados de varios horarios en una fecha, en una sola query (GROUP BY)
    private async contarReservasDelDia(scheduleIds: number[], fecha: string): Promise<Map<number, number>> {
        if (scheduleIds.length === 0) {
            return new Map();
        }

        const conteos = await ClassReservation.findAll({
            attributes: [
                'schedule_id',
                [sequelize.fn('COUNT', sequelize.col('id')), 'total']
            ],
            where: {
                schedule_id: { [Op.in]: scheduleIds },
                reservation_date: fecha,
                status: { [Op.in]: ['RESERVED', 'ATTENDED'] }
            },
            group: ['schedule_id'],
            raw: true
        }) as unknown as { schedule_id: number; total: number }[];

        return new Map(conteos.map(c => [Number(c.schedule_id), Number(c.total)]));
    }

    // Cuenta reservas que ocupan cupo (reservadas o asistidas)
    private async contarReservas(scheduleId: number, fecha: string) {
        return ClassReservation.count({
            where: {
                schedule_id: scheduleId,
                reservation_date: fecha,
                status: { [Op.in]: ['RESERVED', 'ATTENDED'] }
            }
        });
    }

    private calcularEstado(horario: Schedule, fecha: string, reservados: number): EstadoClase {
        const ahora = new Date();
        const inicio = combinarFechaHora(fecha, horario.start_time);
        const fin = combinarFechaHora(fecha, horario.end_time);
        const cierre = new Date(inicio.getTime() - config.reservationCloseMinutes * 60000);

        if (ahora > fin) {
            return 'FINALIZADA';
        }
        if (ahora >= inicio) {
            return 'EN_CURSO';
        }
        if (horario.capacity != null && reservados >= horario.capacity) {
            return 'COMPLETA';
        }
        if (ahora >= cierre) {
            return 'CERRADA';
        }
        return 'DISPONIBLE';
    }

    private async getReservaById(reservaId: number) {
        const reserva = await ClassReservation.findByPk(reservaId, {
            include: [{
                model: Schedule,
                as: 'horario',
                include: [{ model: Activity, as: 'actividad' }]
            }]
        });
        if (!reserva) {
            throw new AppError("Reserva no encontrada", 404);
        }
        return this.mapToDto(reserva);
    }

    private mapToDto(r: ClassReservation) {
        return {
            id: r.id,
            usuarioId: r.user_id,
            horarioId: r.schedule_id,
            actividad: r.horario?.actividad?.name,
            dia: r.horario?.day_of_week,
            horaInicio: r.horario?.start_time,
            horaFin: r.horario?.end_time,
            sala: r.horario?.room,
            fecha: r.reservation_date,
            estado: r.status,
            fechaCreacion: r.created_at
        };
    }
}
