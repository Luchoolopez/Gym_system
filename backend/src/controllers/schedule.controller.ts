import { Request, Response, NextFunction } from "express";
import { ScheduleService } from "../services/schedule.service";

export class ScheduleController {
    constructor(private readonly scheduleService: ScheduleService) {}

    getGrilla = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const actividadId = req.query.actividadId ? parseInt(req.query.actividadId as string, 10) : undefined;
            const dia = req.query.dia as string | undefined;
            const result = await this.scheduleService.getGrilla(actividadId, dia);
            return res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    getByProfesor = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const professorId = parseInt(String(req.params.id), 10);
            const result = await this.scheduleService.getByProfesor(professorId);
            return res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    createHorario = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const result = await this.scheduleService.createHorario(req.body);
            return res.status(201).json({ success: true, message: 'Horario creado exitosamente', data: result });
        } catch (error) {
            next(error);
        }
    }

    updateHorario = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const id = parseInt(String(req.params.id), 10);
            const result = await this.scheduleService.updateHorario(id, req.body);
            return res.status(200).json({ success: true, message: 'Horario actualizado exitosamente', data: result });
        } catch (error) {
            next(error);
        }
    }

    deleteHorario = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const id = parseInt(String(req.params.id), 10);
            await this.scheduleService.deleteHorario(id);
            return res.status(200).json({ success: true, message: 'Horario eliminado exitosamente' });
        } catch (error) {
            next(error);
        }
    }
}
