import { Request, Response } from "express";
import { PlanService } from "../services/plan.service";

export class PlanController {
    constructor(private readonly planService: PlanService) {}

    getPlanes = async (req: Request, res: Response): Promise<Response> => {
        try {
            const incluirInactivos = req.query.incluirInactivos === 'true';
            const result = await this.planService.getPlanes(incluirInactivos);
            return res.status(200).json({ success: true, data: result });
        } catch (error: any) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    }

    getPlanById = async (req: Request, res: Response): Promise<Response> => {
        try {
            const id = parseInt(String(req.params.id), 10);
            const result = await this.planService.getPlanById(id);
            return res.status(200).json({ success: true, data: result });
        } catch (error: any) {
            return res.status(404).json({ success: false, message: error.message });
        }
    }

    createPlan = async (req: Request, res: Response): Promise<Response> => {
        try {
            const result = await this.planService.createPlan(req.body);
            return res.status(201).json({ success: true, message: 'Plan creado exitosamente', data: result });
        } catch (error: any) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    updatePlan = async (req: Request, res: Response): Promise<Response> => {
        try {
            const id = parseInt(String(req.params.id), 10);
            const result = await this.planService.updatePlan(id, req.body);
            return res.status(200).json({ success: true, message: 'Plan actualizado exitosamente', data: result });
        } catch (error: any) {
            return res.status(404).json({ success: false, message: error.message });
        }
    }

    deletePlan = async (req: Request, res: Response): Promise<Response> => {
        try {
            const id = parseInt(String(req.params.id), 10);
            await this.planService.deletePlan(id);
            return res.status(200).json({ success: true, message: 'Plan eliminado exitosamente' });
        } catch (error: any) {
            return res.status(404).json({ success: false, message: error.message });
        }
    }
}
