import { AppError } from "../utils/app.error";
import { Op } from "sequelize";
import { MembershipPlan } from "../models/index";
import { CreatePlanType, UpdatePlanType } from "../validations/plan.validation";

export class PlanService {

    async getPlanes(incluirInactivos: boolean = false) {
        const where = incluirInactivos ? {} : { is_active: true };
        // El destacado primero, luego por precio
        const planes = await MembershipPlan.findAll({ where, order: [['featured', 'DESC'], ['price', 'ASC']] });
        return planes.map(p => this.mapToDto(p));
    }

    async getPlanById(planId: number) {
        const plan = await MembershipPlan.findByPk(planId);
        if (!plan) {
            throw new AppError("Plan no encontrado", 404);
        }
        return this.mapToDto(plan);
    }

    async createPlan(createData: CreatePlanType) {
        const destacado = createData.destacado ?? false;

        const newPlan = await MembershipPlan.create({
            name: createData.nombre,
            description: createData.descripcion,
            price: createData.precio,
            duration_days: createData.duracionDias,
            class_limit: createData.limiteClases ?? null,
            featured: destacado,
            is_active: createData.activo ?? true
        });

        // Solo puede haber un plan destacado a la vez
        if (destacado) {
            await this.desmarcarOtrosDestacados(newPlan.id);
        }

        return this.mapToDto(newPlan);
    }

    async updatePlan(planId: number, updateData: UpdatePlanType) {
        const planToUpdate = await MembershipPlan.findByPk(planId);
        if (!planToUpdate) {
            throw new AppError("Plan no encontrado", 404);
        }

        if (updateData.nombre !== undefined) {
            planToUpdate.name = updateData.nombre;
        }
        if (updateData.descripcion !== undefined) {
            planToUpdate.description = updateData.descripcion;
        }
        if (updateData.precio !== undefined) {
            planToUpdate.price = updateData.precio;
        }
        if (updateData.duracionDias !== undefined) {
            planToUpdate.duration_days = updateData.duracionDias;
        }
        if (updateData.limiteClases !== undefined) {
            planToUpdate.class_limit = updateData.limiteClases;
        }
        if (updateData.destacado !== undefined) {
            planToUpdate.featured = updateData.destacado;
        }
        if (updateData.activo !== undefined) {
            planToUpdate.is_active = updateData.activo;
        }

        await planToUpdate.save();

        // Si quedó marcado como destacado, se desmarca cualquier otro
        if (planToUpdate.featured) {
            await this.desmarcarOtrosDestacados(planToUpdate.id);
        }

        return this.mapToDto(planToUpdate);
    }

    async deletePlan(planId: number) {
        const planToDelete = await MembershipPlan.findByPk(planId);
        if (!planToDelete) {
            throw new AppError("Plan no encontrado", 404);
        }

        planToDelete.is_active = false;
        planToDelete.featured = false; // un plan dado de baja no puede quedar destacado
        await planToDelete.save();

        return true;
    }

    private async desmarcarOtrosDestacados(exceptoId: number) {
        await MembershipPlan.update(
            { featured: false },
            { where: { featured: true, id: { [Op.ne]: exceptoId } } }
        );
    }

    private mapToDto(p: MembershipPlan) {
        return {
            id: p.id,
            nombre: p.name,
            descripcion: p.description,
            precio: Number(p.price),
            duracionDias: p.duration_days,
            limiteClases: p.class_limit, // null = pase libre
            paseLibre: p.class_limit == null,
            destacado: p.featured,
            activo: p.is_active,
            fechaCreacion: p.created_at
        };
    }
}
