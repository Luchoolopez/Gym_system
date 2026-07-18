import { AppError } from "../utils/app.error";
import { Routine, User } from "../models/index";
import { CreateRoutineType, UpdateRoutineType } from "../validations/routine.validation";

export class RoutineService {

    async getMisRutinas(userId: number) {
        const rutinas = await Routine.findAll({
            where: { user_id: userId },
            include: [{ model: User, as: 'profesor' }],
            order: [['updated_at', 'DESC']]
        });

        return rutinas.map(r => this.mapToDto(r));
    }

    async getCreadas(professorId: number) {
        const rutinas = await Routine.findAll({
            where: { professor_id: professorId },
            include: [{ model: User, as: 'usuario' }],
            order: [['updated_at', 'DESC']]
        });

        return rutinas.map(r => this.mapToDto(r));
    }

    async createRutina(professorId: number, createData: CreateRoutineType) {
        const user = await User.findByPk(createData.usuarioId);
        if (!user || !user.is_active) {
            throw new AppError("Usuario no encontrado", 404);
        }

        const nueva = await Routine.create({
            professor_id: professorId,
            user_id: createData.usuarioId,
            title: createData.titulo,
            content: createData.contenido
        });

        return this.getRutinaById(nueva.id);
    }

    async updateRutina(professorId: number, routineId: number, updateData: UpdateRoutineType) {
        const rutina = await Routine.findByPk(routineId);
        if (!rutina || rutina.professor_id !== professorId) {
            throw new AppError("Rutina no encontrada", 404);
        }

        if (updateData.titulo !== undefined) {
            rutina.title = updateData.titulo;
        }
        if (updateData.contenido !== undefined) {
            rutina.content = updateData.contenido;
        }

        await rutina.save();

        return this.getRutinaById(rutina.id);
    }

    async deleteRutina(professorId: number, routineId: number) {
        const rutina = await Routine.findByPk(routineId);
        if (!rutina || rutina.professor_id !== professorId) {
            throw new AppError("Rutina no encontrada", 404);
        }

        await rutina.destroy();

        return true;
    }

    private async getRutinaById(routineId: number) {
        const rutina = await Routine.findByPk(routineId, {
            include: [
                { model: User, as: 'profesor' },
                { model: User, as: 'usuario' }
            ]
        });
        if (!rutina) {
            throw new AppError("Rutina no encontrada", 404);
        }
        return this.mapToDto(rutina);
    }

    private mapToDto(r: Routine) {
        return {
            id: r.id,
            titulo: r.title,
            contenido: r.content,
            profesor: r.profesor ? {
                id: r.profesor.id,
                nombre: r.profesor.first_name,
                apellido: r.profesor.last_name
            } : undefined,
            usuario: r.usuario ? {
                id: r.usuario.id,
                nombre: r.usuario.first_name,
                apellido: r.usuario.last_name
            } : undefined,
            fechaCreacion: r.created_at,
            fechaActualizacion: r.updated_at
        };
    }
}
