import { Request, Response, NextFunction } from "express";
import { StatsService } from "../services/stats.service";
import { AuthRequest } from "../middlewares/auth.middleware";

export class StatsController {
    constructor(private readonly statsService: StatsService) {}

    getMias = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const userId = (req as AuthRequest).user!.id;
            const result = await this.statsService.getMias(userId);
            return res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    getDashboard = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const result = await this.statsService.getDashboard();
            return res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }
}
