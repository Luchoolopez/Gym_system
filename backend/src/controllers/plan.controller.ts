import { Request, Response, NextFunction } from "express";
import { PlanService } from "../services/plan.service";

export class PlanController {
    constructor(private readonly planService: PlanService) {}

    getPlanes = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const incluirInactivos = req.query.incluirInactivos === 'true';
            const result = await this.planService.getPlanes(incluirInactivos);
            return res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    getPlanById = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const id = parseInt(String(req.params.id), 10);
            const result = await this.planService.getPlanById(id);
            return res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    createPlan = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const result = await this.planService.createPlan(req.body);
            return res.status(201).json({ success: true, message: 'Plan creado exitosamente', data: result });
        } catch (error) {
            next(error);
        }
    }

    updatePlan = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const id = parseInt(String(req.params.id), 10);
            const result = await this.planService.updatePlan(id, req.body);
            return res.status(200).json({ success: true, message: 'Plan actualizado exitosamente', data: result });
        } catch (error) {
            next(error);
        }
    }

    deletePlan = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const id = parseInt(String(req.params.id), 10);
            await this.planService.deletePlan(id);
            return res.status(200).json({ success: true, message: 'Plan eliminado exitosamente' });
        } catch (error) {
            next(error);
        }
    }
}
