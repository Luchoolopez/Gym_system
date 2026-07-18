import { Request, Response } from "express";
import { CheckInService } from "../services/checkin.service";
import { AuthRequest } from "../middlewares/auth.middleware";

export class CheckInController {
    constructor(private readonly checkInService: CheckInService) {}

    getCheckIns = async (req: Request, res: Response): Promise<Response> => {
        try {
            const fecha = req.query.fecha as string | undefined;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 50;
            const result = await this.checkInService.getCheckIns(fecha, page, limit);
            return res.status(200).json({ success: true, data: result });
        } catch (error: any) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    }

    getMisCheckIns = async (req: Request, res: Response): Promise<Response> => {
        try {
            const userId = (req as AuthRequest).user!.id;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 50;
            const result = await this.checkInService.getMisCheckIns(userId, page, limit);
            return res.status(200).json({ success: true, data: result });
        } catch (error: any) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    }

    createCheckIn = async (req: Request, res: Response): Promise<Response> => {
        try {
            const adminId = (req as AuthRequest).user!.id;
            const result = await this.checkInService.createCheckIn(adminId, req.body);
            return res.status(201).json({ success: true, message: 'Check-in registrado exitosamente', data: result });
        } catch (error: any) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }
}
