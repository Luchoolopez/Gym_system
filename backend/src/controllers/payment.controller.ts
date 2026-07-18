import { Request, Response, NextFunction } from "express";
import { PaymentService } from "../services/payment.service";
import { AuthRequest } from "../middlewares/auth.middleware";

export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}

    getPagos = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;
            const usuarioId = req.query.usuarioId ? parseInt(req.query.usuarioId as string, 10) : undefined;
            const desde = req.query.desde as string | undefined;
            const hasta = req.query.hasta as string | undefined;
            const result = await this.paymentService.getPagos(page, limit, usuarioId, desde, hasta);
            return res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    getMisPagos = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const userId = (req as AuthRequest).user!.id;
            const result = await this.paymentService.getMisPagos(userId);
            return res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    createPago = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const adminId = (req as AuthRequest).user!.id;
            const result = await this.paymentService.createPago(adminId, req.body);
            return res.status(201).json({ success: true, message: 'Pago registrado exitosamente', data: result });
        } catch (error) {
            next(error);
        }
    }
}
