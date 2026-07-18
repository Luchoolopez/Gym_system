import { MembershipPlan } from "../models/index";
import { CreatePlanType, UpdatePlanType } from "../validations/plan.validation";

export class PlanService {

    async getPlanes(incluirInactivos: boolean = false) {
        const where = incluirInactivos ? {} : { is_active: true };
        const planes = await MembershipPlan.findAll({ where, order: [['price', 'ASC']] });
        return planes.map(p => this.mapToDto(p));
    }

    async getPlanById(planId: number) {
        const plan = await MembershipPlan.findByPk(planId);
        if (!plan) {
            throw new Error("Plan no encontrado");
        }
        return this.mapToDto(plan);
    }

    async createPlan(createData: CreatePlanType) {
        const newPlan = await MembershipPlan.create({
            name: createData.nombre,
            description: createData.descripcion,
            price: createData.precio,
            duration_days: createData.duracionDias,
            class_limit: createData.limiteClases ?? null,
            is_active: createData.activo ?? true
        });

        return this.mapToDto(newPlan);
    }

    async updatePlan(planId: number, updateData: UpdatePlanType) {
        const planToUpdate = await MembershipPlan.findByPk(planId);
        if (!planToUpdate) {
            throw new Error("Plan no encontrado");
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
        if (updateData.activo !== undefined) {
            planToUpdate.is_active = updateData.activo;
        }

        await planToUpdate.save();

        return this.mapToDto(planToUpdate);
    }

    async deletePlan(planId: number) {
        const planToDelete = await MembershipPlan.findByPk(planId);
        if (!planToDelete) {
            throw new Error("Plan no encontrado");
        }

        planToDelete.is_active = false;
        await planToDelete.save();

        return true;
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
            activo: p.is_active,
            fechaCreacion: p.created_at
        };
    }
}
