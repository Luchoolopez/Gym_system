import { Request, Response, NextFunction } from "express";
import { SubscriptionService } from "../services/subscription.service";
import { AuthRequest } from "../middlewares/auth.middleware";

export class SubscriptionController {
    constructor(private readonly subscriptionService: SubscriptionService) {}

    getSuscripciones = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;
            const estadoPago = req.query.estadoPago as string | undefined;
            const vigentes = req.query.vigentes === 'true';
            const result = await this.subscriptionService.getSuscripciones(page, limit, estadoPago, vigentes);
            return res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    getMiSuscripcion = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const userId = (req as AuthRequest).user!.id;
            const result = await this.subscriptionService.getMiSuscripcion(userId);
            return res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    getHistorialUsuario = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const userId = parseInt(String(req.params.userId), 10);
            const result = await this.subscriptionService.getHistorialUsuario(userId);
            return res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    createSuscripcion = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const result = await this.subscriptionService.createSuscripcion(req.body);
            return res.status(201).json({ success: true, message: 'Suscripción creada exitosamente', data: result });
        } catch (error) {
            next(error);
        }
    }

    renovarSuscripcion = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const id = parseInt(String(req.params.id), 10);
            const result = await this.subscriptionService.renovarSuscripcion(id, req.body);
            return res.status(201).json({ success: true, message: 'Suscripción renovada exitosamente', data: result });
        } catch (error) {
            next(error);
        }
    }

    cancelarSuscripcion = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const id = parseInt(String(req.params.id), 10);
            await this.subscriptionService.cancelarSuscripcion(id);
            return res.status(200).json({ success: true, message: 'Suscripción cancelada exitosamente' });
        } catch (error) {
            next(error);
        }
    }

    updateSuscripcion = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const id = parseInt(String(req.params.id), 10);
            const result = await this.subscriptionService.updateSuscripcion(id, req.body);
            return res.status(200).json({ success: true, message: 'Suscripción actualizada exitosamente', data: result });
        } catch (error) {
            next(error);
        }
    }
}
