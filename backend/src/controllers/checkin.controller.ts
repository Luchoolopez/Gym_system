import { Request, Response, NextFunction } from "express";
import { CheckInService } from "../services/checkin.service";
import { AuthRequest } from "../middlewares/auth.middleware";

export class CheckInController {
    constructor(private readonly checkInService: CheckInService) {}

    getCheckIns = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const fecha = req.query.fecha as string | undefined;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 50;
            const result = await this.checkInService.getCheckIns(fecha, page, limit);
            return res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    getMisCheckIns = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const userId = (req as AuthRequest).user!.id;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 50;
            const result = await this.checkInService.getMisCheckIns(userId, page, limit);
            return res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    createCheckIn = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const adminId = (req as AuthRequest).user!.id;
            const result = await this.checkInService.createCheckIn(adminId, req.body);
            return res.status(201).json({ success: true, message: 'Check-in registrado exitosamente', data: result });
        } catch (error) {
            next(error);
        }
    }
}
