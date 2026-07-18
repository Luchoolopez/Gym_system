import { Request, Response, NextFunction } from "express";
import { ActivityService } from "../services/activity.service";

export class ActivityController {
    constructor(private readonly activityService: ActivityService) {}

    getActividades = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const incluirInactivas = req.query.incluirInactivas === 'true';
            const result = await this.activityService.getActividades(incluirInactivas);
            return res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    getActividadById = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const id = parseInt(String(req.params.id), 10);
            const result = await this.activityService.getActividadById(id);
            return res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    createActividad = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const result = await this.activityService.createActividad(req.body);
            return res.status(201).json({ success: true, message: 'Actividad creada exitosamente', data: result });
        } catch (error) {
            next(error);
        }
    }

    updateActividad = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const id = parseInt(String(req.params.id), 10);
            const result = await this.activityService.updateActividad(id, req.body);
            return res.status(200).json({ success: true, message: 'Actividad actualizada exitosamente', data: result });
        } catch (error) {
            next(error);
        }
    }

    deleteActividad = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const id = parseInt(String(req.params.id), 10);
            await this.activityService.deleteActividad(id);
            return res.status(200).json({ success: true, message: 'Actividad eliminada exitosamente' });
        } catch (error) {
            next(error);
        }
    }
}
