import { Op } from "sequelize";
import { sequelize } from "../config/database";
import { CheckIn, ClassReservation, UserSubscription, Payment } from "../models/index";
import { findSuscripcionVigente, clasesRestantes } from "./subscription.service";
import { hoyStr, sumarDias } from "../utils/date.handle";

export class StatsService {

    // Estadísticas personales del usuario
    async getMias(userId: number) {
        const hoy = hoyStr();
        const hace6Meses = new Date();
        hace6Meses.setMonth(hace6Meses.getMonth() - 5);
        hace6Meses.setDate(1);
        hace6Meses.setHours(0, 0, 0, 0);

        // Asistencias agrupadas por mes (últimos 6 meses)
        const asistenciasPorMes = await CheckIn.findAll({
            attributes: [
                [sequelize.fn('DATE_FORMAT', sequelize.col('check_in_time'), '%Y-%m'), 'mes'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'total']
            ],
            where: {
                user_id: userId,
                check_in_time: { [Op.gte]: hace6Meses }
            },
            group: ['mes'],
            order: [[sequelize.literal('mes'), 'ASC']],
            raw: true
        });

        const totalAsistencias = await CheckIn.count({ where: { user_id: userId } });
        const totalReservas = await ClassReservation.count({ where: { user_id: userId, status: { [Op.ne]: 'CANCELLED' } } });
        const reservasAsistidas = await ClassReservation.count({ where: { user_id: userId, status: 'ATTENDED' } });
        const reservasCanceladas = await ClassReservation.count({ where: { user_id: userId, status: 'CANCELLED' } });

        const suscripcion = await findSuscripcionVigente(userId);

        return {
            asistenciasPorMes,
            totalAsistencias,
            totalReservas,
            reservasAsistidas,
            reservasCanceladas,
            suscripcion: suscripcion ? {
                plan: suscripcion.plan?.name,
                fechaFin: suscripcion.end_date,
                clasesRestantes: clasesRestantes(suscripcion)
            } : null,
            fecha: hoy
        };
    }

    // Dashboard global del Admin
    async getDashboard() {
        const hoy = hoyStr();
        const inicioMes = `${hoy.slice(0, 7)}-01`;
        const en7Dias = sumarDias(hoy, 7);

        const sociosActivos = await UserSubscription.count({
            distinct: true,
            col: 'user_id',
            where: {
                payment_status: 'PAID',
                start_date: { [Op.lte]: hoy },
                end_date: { [Op.gte]: hoy }
            }
        });

        const pagosPendientes = await UserSubscription.count({
            where: {
                payment_status: 'PENDING',
                end_date: { [Op.gte]: hoy }
            }
        });

        const porVencer = await UserSubscription.count({
            where: {
                payment_status: 'PAID',
                end_date: { [Op.between]: [hoy, en7Dias] }
            }
        });

        const ingresosMes = await Payment.sum('amount', {
            where: { payment_date: { [Op.gte]: inicioMes } }
        });

        const checkinsHoy = await CheckIn.count({
            where: {
                check_in_time: {
                    [Op.gte]: new Date(`${hoy}T00:00:00`),
                    [Op.lt]: new Date(`${sumarDias(hoy, 1)}T00:00:00`)
                }
            }
        });

        const reservasHoy = await ClassReservation.count({
            where: {
                reservation_date: hoy,
                status: { [Op.in]: ['RESERVED', 'ATTENDED'] }
            }
        });

        return {
            sociosActivos,
            pagosPendientes,
            suscripcionesPorVencer: porVencer,
            ingresosMes: Number(ingresosMes) || 0,
            checkinsHoy,
            reservasHoy,
            fecha: hoy
        };
    }
}
