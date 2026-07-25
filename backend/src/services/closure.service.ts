import { AppError } from "../utils/app.error";
import { Op } from "sequelize";
import { DayClosure, CheckIn, Payment, User } from "../models/index";
import { CreateClosureType } from "../validations/closure.validation";
import { hoyStr, sumarDias } from "../utils/date.handle";

export class ClosureService {

    // Totales de un día (check-ins registrados + dinero cobrado)
    private async totalesDelDia(fecha: string) {
        const totalCheckins = await CheckIn.count({
            where: {
                check_in_time: {
                    [Op.gte]: new Date(`${fecha}T00:00:00`),
                    [Op.lt]: new Date(`${sumarDias(fecha, 1)}T00:00:00`)
                }
            }
        });

        const totalIngresos = await Payment.sum('amount', {
            where: { payment_date: fecha }
        });

        return { totalCheckins, totalIngresos: Number(totalIngresos) || 0 };
    }

    // Resumen del día en curso (para mostrar antes de cerrar)
    async getResumenHoy() {
        const hoy = hoyStr();
        const totales = await this.totalesDelDia(hoy);
        const cierre = await DayClosure.findOne({ where: { closure_date: hoy } });

        return {
            fecha: hoy,
            ...totales,
            cerrado: !!cierre
        };
    }

    async getCierres(page: number = 1, limit: number = 30) {
        const offset = (page - 1) * limit;

        const { count: totalItems, rows: cierres } = await DayClosure.findAndCountAll({
            include: [{ model: User, as: 'cerradoPor' }],
            offset,
            limit,
            order: [['closure_date', 'DESC']]
        });

        return {
            items: cierres.map(c => this.mapToDto(c)),
            totalItems,
            page,
            limit
        };
    }

    async cerrarDia(adminId: number, data: CreateClosureType) {
        const fecha = data.fecha ?? hoyStr();

        const existente = await DayClosure.findOne({ where: { closure_date: fecha } });
        if (existente) {
            throw new AppError("El día ya fue cerrado", 409);
        }

        const { totalCheckins, totalIngresos } = await this.totalesDelDia(fecha);

        const nuevo = await DayClosure.create({
            closure_date: fecha,
            closed_by: adminId,
            total_checkins: totalCheckins,
            total_income: totalIngresos,
            notes: data.notas
        });

        const cierre = await DayClosure.findByPk(nuevo.id, {
            include: [{ model: User, as: 'cerradoPor' }]
        });

        return this.mapToDto(cierre!);
    }

    private mapToDto(c: DayClosure) {
        return {
            id: c.id,
            fecha: c.closure_date,
            totalCheckins: c.total_checkins,
            totalIngresos: Number(c.total_income),
            notas: c.notes,
            cerradoPor: c.cerradoPor ? {
                id: c.cerradoPor.id,
                nombre: c.cerradoPor.first_name,
                apellido: c.cerradoPor.last_name
            } : null,
            fechaCierre: c.created_at
        };
    }
}
