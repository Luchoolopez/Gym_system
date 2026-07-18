import { Op } from "sequelize";
import { ClassReservation, Schedule, Activity, User } from "../models/index";
import { CreateReservationType, AttendanceType } from "../validations/reservation.validation";
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

        const clases = [];
        for (const horario of horarios) {
            const reservados = await this.contarReservas(horario.id, fechaConsulta);
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
            throw new Error("Horario no encontrado");
        }

        if (diaDeLaSemana(createData.fecha) !== horario.day_of_week) {
            throw new Error(`La fecha no corresponde al día de la clase (${horario.day_of_week})`);
        }

        // Validar suscripción vigente y paga
        const suscripcion = await findSuscripcionVigente(userId);
        if (!suscripcion) {
            throw new Error("No tenés una suscripción vigente");
        }
        if (suscripcion.payment_status !== 'PAID') {
            throw new Error("Tu suscripción tiene el pago pendiente");
        }

        const restantes = clasesRestantes(suscripcion);
        if (restantes !== null && restantes <= 0) {
            throw new Error("No te quedan clases disponibles en tu plan");
        }

        // Validar estado de la clase (ventana de reserva y cupo)
        const reservados = await this.contarReservas(horario.id, createData.fecha);
        const estado = this.calcularEstado(horario, createData.fecha, reservados);
        if (estado === 'COMPLETA') {
            throw new Error("La clase está completa");
        }
        if (estado === 'CERRADA') {
            throw new Error("La clase ya cerró sus reservas");
        }
        if (estado === 'EN_CURSO' || estado === 'FINALIZADA') {
            throw new Error("La clase ya empezó");
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
                throw new Error("Ya tenés una reserva para esta clase");
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

    async cancelarReserva(userId: number, reservaId: number) {
        const reserva = await ClassReservation.findByPk(reservaId, {
            include: [{ model: Schedule, as: 'horario' }]
        });
        if (!reserva || reserva.user_id !== userId) {
            throw new Error("Reserva no encontrada");
        }
        if (reserva.status !== 'RESERVED') {
            throw new Error("La reserva no se puede cancelar");
        }

        const inicio = combinarFechaHora(reserva.reservation_date, reserva.horario!.start_time);
        const cierre = new Date(inicio.getTime() - config.reservationCloseMinutes * 60000);
        if (new Date() >= cierre) {
            throw new Error("Ya no se puede cancelar la reserva (la clase está por empezar)");
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
            throw new Error("Horario no encontrado");
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
            throw new Error("Reserva no encontrada");
        }
        if (reserva.status !== 'RESERVED') {
            throw new Error("La reserva ya fue procesada o está cancelada");
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
            throw new Error("Reserva no encontrada");
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
