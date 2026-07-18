import { Op } from "sequelize";
import { CheckIn, ClassReservation, User } from "../models/index";
import { CreateCheckInType } from "../validations/checkin.validation";
import { findSuscripcionVigente, clasesRestantes } from "./subscription.service";
import { hoyStr } from "../utils/date.handle";

export class CheckInService {

    async getCheckIns(fecha?: string, page: number = 1, limit: number = 50) {
        const fechaConsulta = fecha ?? hoyStr();
        const offset = (page - 1) * limit;

        const { count: totalItems, rows: checkIns } = await CheckIn.findAndCountAll({
            where: {
                check_in_time: {
                    [Op.gte]: new Date(`${fechaConsulta}T00:00:00`),
                    [Op.lt]: new Date(`${fechaConsulta}T23:59:59.999`)
                }
            },
            include: [
                { model: User, as: 'usuario' },
                { model: User, as: 'registradoPor' }
            ],
            offset,
            limit,
            order: [['check_in_time', 'DESC']]
        });

        return {
            items: checkIns.map(c => this.mapToDto(c)),
            totalItems,
            page,
            limit
        };
    }

    async getMisCheckIns(userId: number, page: number = 1, limit: number = 50) {
        const offset = (page - 1) * limit;

        const { count: totalItems, rows: checkIns } = await CheckIn.findAndCountAll({
            where: { user_id: userId },
            offset,
            limit,
            order: [['check_in_time', 'DESC']]
        });

        return {
            items: checkIns.map(c => this.mapToDto(c)),
            totalItems,
            page,
            limit
        };
    }

    async createCheckIn(adminId: number, createData: CreateCheckInType) {
        // Buscar al usuario por DNI (credencial) o por id
        const user = createData.dni
            ? await User.findOne({ where: { dni: createData.dni } })
            : await User.findByPk(createData.usuarioId!);

        if (!user || !user.is_active) {
            throw new Error("Usuario no encontrado");
        }

        // Validar acceso: suscripción vigente y paga
        const suscripcion = await findSuscripcionVigente(user.id);
        if (!suscripcion) {
            throw new Error("El usuario no tiene una suscripción vigente");
        }
        if (suscripcion.payment_status !== 'PAID') {
            throw new Error("La suscripción tiene el pago pendiente");
        }

        const restantes = clasesRestantes(suscripcion);
        if (restantes !== null && restantes <= 0) {
            throw new Error("El usuario no tiene clases disponibles en su plan");
        }

        // Si tiene una reserva para hoy, el check-in la marca como asistida
        const reservaHoy = await ClassReservation.findOne({
            where: {
                user_id: user.id,
                reservation_date: hoyStr(),
                status: 'RESERVED'
            }
        });
        if (reservaHoy) {
            reservaHoy.status = 'ATTENDED';
            await reservaHoy.save();
        }

        // Plan limitado: se descuenta una clase (una sola vez, con o sin reserva)
        if (suscripcion.plan?.class_limit != null) {
            suscripcion.classes_used += 1;
            await suscripcion.save();
        }

        const nuevo = await CheckIn.create({
            user_id: user.id,
            registered_by: adminId,
            notes: createData.notas
        });

        const checkIn = await CheckIn.findByPk(nuevo.id, {
            include: [{ model: User, as: 'usuario' }]
        });

        return {
            ...this.mapToDto(checkIn!),
            reservaAsistida: reservaHoy ? reservaHoy.id : null,
            clasesRestantes: clasesRestantes(suscripcion)
        };
    }

    private mapToDto(c: CheckIn) {
        return {
            id: c.id,
            usuario: c.usuario ? {
                id: c.usuario.id,
                nombre: c.usuario.first_name,
                apellido: c.usuario.last_name,
                dni: c.usuario.dni
            } : undefined,
            fechaHora: c.check_in_time,
            registradoPor: c.registradoPor ? {
                id: c.registradoPor.id,
                nombre: c.registradoPor.first_name,
                apellido: c.registradoPor.last_name
            } : null,
            notas: c.notes
        };
    }
}
