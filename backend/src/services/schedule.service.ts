import { AppError } from "../utils/app.error";
import { Schedule, Activity, User, Role } from "../models/index";
import { CreateScheduleType, UpdateScheduleType } from "../validations/schedule.validation";

const ORDEN_DIAS = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];

export class ScheduleService {

    async getGrilla(actividadId?: number, dia?: string) {
        const where: any = { is_active: true };
        if (actividadId) {
            where.activity_id = actividadId;
        }
        if (dia) {
            where.day_of_week = dia;
        }

        const horarios = await Schedule.findAll({
            where,
            include: [
                { model: Activity, as: 'actividad' },
                { model: User, as: 'profesor' }
            ],
            order: [['start_time', 'ASC']]
        });

        const dtos = horarios.map(h => this.mapToDto(h));
        dtos.sort((a, b) => ORDEN_DIAS.indexOf(a.dia) - ORDEN_DIAS.indexOf(b.dia) || a.horaInicio.localeCompare(b.horaInicio));
        return dtos;
    }

    async getByProfesor(professorId: number) {
        const horarios = await Schedule.findAll({
            where: { professor_id: professorId, is_active: true },
            include: [{ model: Activity, as: 'actividad' }],
            order: [['start_time', 'ASC']]
        });

        const dtos = horarios.map(h => this.mapToDto(h));
        dtos.sort((a, b) => ORDEN_DIAS.indexOf(a.dia) - ORDEN_DIAS.indexOf(b.dia) || a.horaInicio.localeCompare(b.horaInicio));
        return dtos;
    }

    async createHorario(createData: CreateScheduleType) {
        const actividad = await Activity.findByPk(createData.actividadId);
        if (!actividad || !actividad.is_active) {
            throw new AppError("Actividad no encontrada", 404);
        }

        if (createData.profesorId != null) {
            await this.validarProfesor(createData.profesorId);
        }

        const nuevo = await Schedule.create({
            activity_id: createData.actividadId,
            day_of_week: createData.dia,
            start_time: createData.horaInicio,
            end_time: createData.horaFin,
            professor_id: createData.profesorId ?? null,
            room: createData.sala,
            capacity: createData.cupo ?? null,
            is_active: createData.activo ?? true
        });

        return this.getHorarioById(nuevo.id);
    }

    async updateHorario(scheduleId: number, updateData: UpdateScheduleType) {
        const horario = await Schedule.findByPk(scheduleId);
        if (!horario) {
            throw new AppError("Horario no encontrado", 404);
        }

        if (updateData.actividadId !== undefined) {
            const actividad = await Activity.findByPk(updateData.actividadId);
            if (!actividad || !actividad.is_active) {
                throw new AppError("Actividad no encontrada", 404);
            }
            horario.activity_id = updateData.actividadId;
        }

        if (updateData.profesorId !== undefined) {
            if (updateData.profesorId != null) {
                await this.validarProfesor(updateData.profesorId);
            }
            horario.professor_id = updateData.profesorId;
        }

        if (updateData.dia !== undefined) {
            horario.day_of_week = updateData.dia;
        }
        if (updateData.horaInicio !== undefined) {
            horario.start_time = updateData.horaInicio;
        }
        if (updateData.horaFin !== undefined) {
            horario.end_time = updateData.horaFin;
        }
        if (updateData.sala !== undefined) {
            horario.room = updateData.sala;
        }
        if (updateData.cupo !== undefined) {
            horario.capacity = updateData.cupo;
        }
        if (updateData.activo !== undefined) {
            horario.is_active = updateData.activo;
        }

        if (horario.end_time <= horario.start_time) {
            throw new AppError("La hora de fin debe ser posterior a la de inicio", 400);
        }

        await horario.save();

        return this.getHorarioById(horario.id);
    }

    async deleteHorario(scheduleId: number) {
        const horario = await Schedule.findByPk(scheduleId);
        if (!horario) {
            throw new AppError("Horario no encontrado", 404);
        }

        horario.is_active = false;
        await horario.save();

        return true;
    }

    private async validarProfesor(professorId: number) {
        const profesor = await User.findByPk(professorId, {
            include: [{ model: Role, as: 'role' }]
        });
        if (!profesor || !profesor.is_active) {
            throw new AppError("Profesor no encontrado", 404);
        }
        if (profesor.role?.name !== 'Profesor' && profesor.role?.name !== 'Admin') {
            throw new AppError("El usuario asignado no es un profesor", 400);
        }
    }

    private async getHorarioById(scheduleId: number) {
        const horario = await Schedule.findByPk(scheduleId, {
            include: [
                { model: Activity, as: 'actividad' },
                { model: User, as: 'profesor' }
            ]
        });
        if (!horario) {
            throw new AppError("Horario no encontrado", 404);
        }
        return this.mapToDto(horario);
    }

    private mapToDto(h: Schedule) {
        return {
            id: h.id,
            actividad: h.actividad ? { id: h.actividad.id, nombre: h.actividad.name } : undefined,
            dia: h.day_of_week,
            horaInicio: h.start_time,
            horaFin: h.end_time,
            profesor: h.profesor ? {
                id: h.profesor.id,
                nombre: h.profesor.first_name,
                apellido: h.profesor.last_name
            } : null,
            sala: h.room,
            cupo: h.capacity, // null = sin límite
            activo: h.is_active
        };
    }
}
