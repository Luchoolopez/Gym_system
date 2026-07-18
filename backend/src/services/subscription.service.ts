import { AppError } from "../utils/app.error";
import { Op } from "sequelize";
import { UserSubscription, MembershipPlan, User } from "../models/index";
import { CreateSubscriptionType, RenewSubscriptionType } from "../validations/subscription.validation";
import { hoyStr, sumarDias } from "../utils/date.handle";

// Busca la suscripción vigente de un usuario (no cancelada y dentro del período).
// La reusan los módulos de reservas y check-ins para validar el acceso.
export const findSuscripcionVigente = async (userId: number) => {
    const hoy = hoyStr();
    return UserSubscription.findOne({
        where: {
            user_id: userId,
            payment_status: { [Op.ne]: 'CANCELLED' },
            start_date: { [Op.lte]: hoy },
            end_date: { [Op.gte]: hoy }
        },
        include: [{ model: MembershipPlan, as: 'plan' }],
        order: [['end_date', 'DESC']]
    });
};

// Clases restantes de una suscripción (null = pase libre)
export const clasesRestantes = (sub: UserSubscription): number | null => {
    if (!sub.plan || sub.plan.class_limit == null) {
        return null;
    }
    return Math.max(0, sub.plan.class_limit - sub.classes_used);
};

export class SubscriptionService {

    async getSuscripciones(page: number = 1, limit: number = 20, estadoPago?: string, vigentes?: boolean) {
        const offset = (page - 1) * limit;
        const hoy = hoyStr();

        const where: any = {};
        if (estadoPago) {
            where.payment_status = estadoPago;
        }
        if (vigentes) {
            where.start_date = { [Op.lte]: hoy };
            where.end_date = { [Op.gte]: hoy };
            where.payment_status = estadoPago ?? { [Op.ne]: 'CANCELLED' };
        }

        const { count: totalItems, rows: suscripciones } = await UserSubscription.findAndCountAll({
            where,
            include: [
                { model: MembershipPlan, as: 'plan' },
                { model: User, as: 'usuario' }
            ],
            offset,
            limit,
            order: [['end_date', 'DESC']]
        });

        return {
            items: suscripciones.map(s => this.mapToDto(s)),
            totalItems,
            page,
            limit
        };
    }

    async getMiSuscripcion(userId: number) {
        const vigente = await findSuscripcionVigente(userId);
        if (vigente) {
            return this.mapToDto(vigente);
        }

        // Si no hay vigente, devolvemos la última para mostrar el vencimiento
        const ultima = await UserSubscription.findOne({
            where: { user_id: userId },
            include: [{ model: MembershipPlan, as: 'plan' }],
            order: [['end_date', 'DESC']]
        });
        if (!ultima) {
            throw new AppError("El usuario no tiene suscripciones", 400);
        }
        return this.mapToDto(ultima);
    }

    async getHistorialUsuario(userId: number) {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new AppError("Usuario no encontrado", 404);
        }

        const suscripciones = await UserSubscription.findAll({
            where: { user_id: userId },
            include: [{ model: MembershipPlan, as: 'plan' }],
            order: [['end_date', 'DESC']]
        });

        return suscripciones.map(s => this.mapToDto(s));
    }

    async createSuscripcion(createData: CreateSubscriptionType) {
        const user = await User.findByPk(createData.usuarioId);
        if (!user || !user.is_active) {
            throw new AppError("Usuario no encontrado", 404);
        }

        const plan = await MembershipPlan.findByPk(createData.planId);
        if (!plan || !plan.is_active) {
            throw new AppError("Plan no encontrado", 404);
        }

        const vigente = await findSuscripcionVigente(createData.usuarioId);
        if (vigente) {
            throw new AppError("El usuario ya tiene una suscripción vigente", 409);
        }

        const fechaInicio = createData.fechaInicio ?? hoyStr();
        const fechaFin = sumarDias(fechaInicio, plan.duration_days);

        const nueva = await UserSubscription.create({
            user_id: createData.usuarioId,
            plan_id: createData.planId,
            start_date: fechaInicio,
            end_date: fechaFin
        });

        return this.getSuscripcionById(nueva.id);
    }

    async renovarSuscripcion(subscriptionId: number, renewData: RenewSubscriptionType) {
        const anterior = await UserSubscription.findByPk(subscriptionId, {
            include: [{ model: MembershipPlan, as: 'plan' }]
        });
        if (!anterior) {
            throw new AppError("Suscripción no encontrada", 404);
        }

        const planId = renewData.planId ?? anterior.plan_id;
        const plan = await MembershipPlan.findByPk(planId);
        if (!plan || !plan.is_active) {
            throw new AppError("Plan no encontrado", 404);
        }

        const hoy = hoyStr();
        // Si la anterior sigue vigente, la nueva arranca cuando termina; si ya venció, arranca hoy
        const fechaInicio = renewData.fechaInicio
            ?? (anterior.end_date >= hoy ? sumarDias(anterior.end_date, 1) : hoy);
        const fechaFin = sumarDias(fechaInicio, plan.duration_days);

        const nueva = await UserSubscription.create({
            user_id: anterior.user_id,
            plan_id: planId,
            start_date: fechaInicio,
            end_date: fechaFin
        });

        return this.getSuscripcionById(nueva.id);
    }

    async cancelarSuscripcion(subscriptionId: number) {
        const suscripcion = await UserSubscription.findByPk(subscriptionId);
        if (!suscripcion) {
            throw new AppError("Suscripción no encontrada", 404);
        }

        suscripcion.payment_status = 'CANCELLED';
        await suscripcion.save();

        return true;
    }

    private async getSuscripcionById(subscriptionId: number) {
        const suscripcion = await UserSubscription.findByPk(subscriptionId, {
            include: [
                { model: MembershipPlan, as: 'plan' },
                { model: User, as: 'usuario' }
            ]
        });
        if (!suscripcion) {
            throw new AppError("Suscripción no encontrada", 404);
        }
        return this.mapToDto(suscripcion);
    }

    private mapToDto(s: UserSubscription) {
        const hoy = hoyStr();
        return {
            id: s.id,
            usuarioId: s.user_id,
            usuario: s.usuario ? {
                id: s.usuario.id,
                nombre: s.usuario.first_name,
                apellido: s.usuario.last_name,
                dni: s.usuario.dni
            } : undefined,
            plan: s.plan ? {
                id: s.plan.id,
                nombre: s.plan.name,
                precio: Number(s.plan.price),
                limiteClases: s.plan.class_limit
            } : undefined,
            fechaInicio: s.start_date,
            fechaFin: s.end_date,
            estadoPago: s.payment_status,
            clasesUsadas: s.classes_used,
            clasesRestantes: clasesRestantes(s),
            vigente: s.payment_status !== 'CANCELLED' && s.start_date <= hoy && s.end_date >= hoy,
            fechaCreacion: s.created_at
        };
    }
}
