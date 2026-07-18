import { Request, Response } from "express";
import { ScheduleService } from "../services/schedule.service";

export class ScheduleController {
    constructor(private readonly scheduleService: ScheduleService) {}

    getGrilla = async (req: Request, res: Response): Promise<Response> => {
        try {
            const actividadId = req.query.actividadId ? parseInt(req.query.actividadId as string, 10) : undefined;
            const dia = req.query.dia as string | undefined;
            const result = await this.scheduleService.getGrilla(actividadId, dia);
            return res.status(200).json({ success: true, data: result });
        } catch (error: any) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    }

    getByProfesor = async (req: Request, res: Response): Promise<Response> => {
        try {
            const professorId = parseInt(String(req.params.id), 10);
            const result = await this.scheduleService.getByProfesor(professorId);
            return res.status(200).json({ success: true, data: result });
        } catch (error: any) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    }

    createHorario = async (req: Request, res: Response): Promise<Response> => {
        try {
            const result = await this.scheduleService.createHorario(req.body);
            return res.status(201).json({ success: true, message: 'Horario creado exitosamente', data: result });
        } catch (error: any) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    updateHorario = async (req: Request, res: Response): Promise<Response> => {
        try {
            const id = parseInt(String(req.params.id), 10);
            const result = await this.scheduleService.updateHorario(id, req.body);
            return res.status(200).json({ success: true, message: 'Horario actualizado exitosamente', data: result });
        } catch (error: any) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    deleteHorario = async (req: Request, res: Response): Promise<Response> => {
        try {
            const id = parseInt(String(req.params.id), 10);
            await this.scheduleService.deleteHorario(id);
            return res.status(200).json({ success: true, message: 'Horario eliminado exitosamente' });
        } catch (error: any) {
            return res.status(404).json({ success: false, message: error.message });
        }
    }
}
