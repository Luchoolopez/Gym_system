import { AppError } from "../utils/app.error";
import { Op } from "sequelize";
import { Payment, UserSubscription, MembershipPlan, User } from "../models/index";
import { CreatePaymentType } from "../validations/payment.validation";
import { hoyStr } from "../utils/date.handle";

export class PaymentService {

    async getPagos(page: number = 1, limit: number = 20, usuarioId?: number, desde?: string, hasta?: string) {
        const offset = (page - 1) * limit;

        const where: any = {};
        if (desde && hasta) {
            where.payment_date = { [Op.between]: [desde, hasta] };
        } else if (desde) {
            where.payment_date = { [Op.gte]: desde };
        } else if (hasta) {
            where.payment_date = { [Op.lte]: hasta };
        }

        const include: any = [{
            model: UserSubscription,
            as: 'suscripcion',
            ...(usuarioId ? { where: { user_id: usuarioId } } : {}),
            include: [
                { model: User, as: 'usuario' },
                { model: MembershipPlan, as: 'plan' }
            ]
        }];

        const { count: totalItems, rows: pagos } = await Payment.findAndCountAll({
            where,
            include,
            offset,
            limit,
            order: [['payment_date', 'DESC'], ['id', 'DESC']]
        });

        return {
            items: pagos.map(p => this.mapToDto(p)),
            totalItems,
            page,
            limit
        };
    }

    async getMisPagos(userId: number) {
        const pagos = await Payment.findAll({
            include: [{
                model: UserSubscription,
                as: 'suscripcion',
                where: { user_id: userId },
                include: [{ model: MembershipPlan, as: 'plan' }]
            }],
            order: [['payment_date', 'DESC'], ['id', 'DESC']]
        });

        return pagos.map(p => this.mapToDto(p));
    }

    async createPago(adminId: number, createData: CreatePaymentType) {
        const suscripcion = await UserSubscription.findByPk(createData.suscripcionId);
        if (!suscripcion) {
            throw new AppError("Suscripción no encontrada", 404);
        }
        if (suscripcion.payment_status === 'CANCELLED') {
            throw new AppError("No se puede registrar un pago de una suscripción cancelada", 400);
        }

        const nuevoPago = await Payment.create({
            subscription_id: createData.suscripcionId,
            amount: createData.monto,
            payment_method: createData.metodo,
            payment_date: createData.fecha ?? hoyStr(),
            registered_by: adminId,
            notes: createData.notas
        });

        // Registrar el pago deja la suscripción como paga
        suscripcion.payment_status = 'PAID';
        await suscripcion.save();

        const pago = await Payment.findByPk(nuevoPago.id, {
            include: [{
                model: UserSubscription,
                as: 'suscripcion',
                include: [
                    { model: User, as: 'usuario' },
                    { model: MembershipPlan, as: 'plan' }
                ]
            }]
        });

        return this.mapToDto(pago!);
    }

    private mapToDto(p: Payment) {
        return {
            id: p.id,
            suscripcionId: p.subscription_id,
            usuario: p.suscripcion?.usuario ? {
                id: p.suscripcion.usuario.id,
                nombre: p.suscripcion.usuario.first_name,
                apellido: p.suscripcion.usuario.last_name,
                dni: p.suscripcion.usuario.dni
            } : undefined,
            plan: p.suscripcion?.plan ? {
                id: p.suscripcion.plan.id,
                nombre: p.suscripcion.plan.name
            } : undefined,
            monto: Number(p.amount),
            metodo: p.payment_method,
            fecha: p.payment_date,
            notas: p.notes,
            fechaCreacion: p.created_at
        };
    }
}
