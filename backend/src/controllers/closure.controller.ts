import { Request, Response, NextFunction } from "express";
import { ClosureService } from "../services/closure.service";
import { AuthRequest } from "../middlewares/auth.middleware";

export class ClosureController {
    constructor(private readonly closureService: ClosureService) {}

    getResumenHoy = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const result = await this.closureService.getResumenHoy();
            return res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    getCierres = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 30;
            const result = await this.closureService.getCierres(page, limit);
            return res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    cerrarDia = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const adminId = (req as AuthRequest).user!.id;
            const result = await this.closureService.cerrarDia(adminId, req.body);
            return res.status(201).json({ success: true, message: 'Caja cerrada exitosamente', data: result });
        } catch (error) {
            next(error);
        }
    }
}
