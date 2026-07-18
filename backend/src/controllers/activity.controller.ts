import { Request, Response } from "express";
import { ActivityService } from "../services/activity.service";

export class ActivityController {
    constructor(private readonly activityService: ActivityService) {}

    getActividades = async (req: Request, res: Response): Promise<Response> => {
        try {
            const incluirInactivas = req.query.incluirInactivas === 'true';
            const result = await this.activityService.getActividades(incluirInactivas);
            return res.status(200).json({ success: true, data: result });
        } catch (error: any) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    }

    getActividadById = async (req: Request, res: Response): Promise<Response> => {
        try {
            const id = parseInt(String(req.params.id), 10);
            const result = await this.activityService.getActividadById(id);
            return res.status(200).json({ success: true, data: result });
        } catch (error: any) {
            return res.status(404).json({ success: false, message: error.message });
        }
    }

    createActividad = async (req: Request, res: Response): Promise<Response> => {
        try {
            const result = await this.activityService.createActividad(req.body);
            return res.status(201).json({ success: true, message: 'Actividad creada exitosamente', data: result });
        } catch (error: any) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    updateActividad = async (req: Request, res: Response): Promise<Response> => {
        try {
            const id = parseInt(String(req.params.id), 10);
            const result = await this.activityService.updateActividad(id, req.body);
            return res.status(200).json({ success: true, message: 'Actividad actualizada exitosamente', data: result });
        } catch (error: any) {
            return res.status(404).json({ success: false, message: error.message });
        }
    }

    deleteActividad = async (req: Request, res: Response): Promise<Response> => {
        try {
            const id = parseInt(String(req.params.id), 10);
            await this.activityService.deleteActividad(id);
            return res.status(200).json({ success: true, message: 'Actividad eliminada exitosamente' });
        } catch (error: any) {
            return res.status(404).json({ success: false, message: error.message });
        }
    }
}
