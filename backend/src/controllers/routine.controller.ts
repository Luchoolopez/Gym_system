import { Request, Response, NextFunction } from "express";
import { RoutineService } from "../services/routine.service";
import { AuthRequest } from "../middlewares/auth.middleware";

export class RoutineController {
    constructor(private readonly routineService: RoutineService) {}

    getMisRutinas = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const userId = (req as AuthRequest).user!.id;
            const result = await this.routineService.getMisRutinas(userId);
            return res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    getCreadas = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const professorId = (req as AuthRequest).user!.id;
            const result = await this.routineService.getCreadas(professorId);
            return res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    createRutina = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const professorId = (req as AuthRequest).user!.id;
            const result = await this.routineService.createRutina(professorId, req.body);
            return res.status(201).json({ success: true, message: 'Rutina creada exitosamente', data: result });
        } catch (error) {
            next(error);
        }
    }

    updateRutina = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const professorId = (req as AuthRequest).user!.id;
            const id = parseInt(String(req.params.id), 10);
            const result = await this.routineService.updateRutina(professorId, id, req.body);
            return res.status(200).json({ success: true, message: 'Rutina actualizada exitosamente', data: result });
        } catch (error) {
            next(error);
        }
    }

    deleteRutina = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const professorId = (req as AuthRequest).user!.id;
            const id = parseInt(String(req.params.id), 10);
            await this.routineService.deleteRutina(professorId, id);
            return res.status(200).json({ success: true, message: 'Rutina eliminada exitosamente' });
        } catch (error) {
            next(error);
        }
    }
}
