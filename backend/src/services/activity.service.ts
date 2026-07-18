import { AppError } from "../utils/app.error";
import { Activity } from "../models/index";
import { CreateActivityType, UpdateActivityType } from "../validations/activity.validation";

export class ActivityService {

    async getActividades(incluirInactivas: boolean = false) {
        const where = incluirInactivas ? {} : { is_active: true };
        const actividades = await Activity.findAll({ where, order: [['name', 'ASC']] });
        return actividades.map(a => this.mapToDto(a));
    }

    async getActividadById(activityId: number) {
        const actividad = await Activity.findByPk(activityId);
        if (!actividad) {
            throw new AppError("Actividad no encontrada", 404);
        }
        return this.mapToDto(actividad);
    }

    async createActividad(createData: CreateActivityType) {
        const existing = await Activity.findOne({ where: { name: createData.nombre } });
        if (existing) {
            throw new AppError("Ya existe una actividad con ese nombre", 409);
        }

        const newActividad = await Activity.create({
            name: createData.nombre,
            description: createData.descripcion,
            is_active: createData.activo ?? true
        });

        return this.mapToDto(newActividad);
    }

    async updateActividad(activityId: number, updateData: UpdateActivityType) {
        const actividadToUpdate = await Activity.findByPk(activityId);
        if (!actividadToUpdate) {
            throw new AppError("Actividad no encontrada", 404);
        }

        if (updateData.nombre !== undefined) {
            actividadToUpdate.name = updateData.nombre;
        }
        if (updateData.descripcion !== undefined) {
            actividadToUpdate.description = updateData.descripcion;
        }
        if (updateData.activo !== undefined) {
            actividadToUpdate.is_active = updateData.activo;
        }

        await actividadToUpdate.save();

        return this.mapToDto(actividadToUpdate);
    }

    async deleteActividad(activityId: number) {
        const actividadToDelete = await Activity.findByPk(activityId);
        if (!actividadToDelete) {
            throw new AppError("Actividad no encontrada", 404);
        }

        actividadToDelete.is_active = false;
        await actividadToDelete.save();

        return true;
    }

    private mapToDto(a: Activity) {
        return {
            id: a.id,
            nombre: a.name,
            descripcion: a.description,
            activo: a.is_active,
            fechaCreacion: a.created_at
        };
    }
}
