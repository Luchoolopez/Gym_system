import { Request, Response } from "express";
import { PaymentService } from "../services/payment.service";
import { AuthRequest } from "../middlewares/auth.middleware";

export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}

    getPagos = async (req: Request, res: Response): Promise<Response> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;
            const usuarioId = req.query.usuarioId ? parseInt(req.query.usuarioId as string, 10) : undefined;
            const desde = req.query.desde as string | undefined;
            const hasta = req.query.hasta as string | undefined;
            const result = await this.paymentService.getPagos(page, limit, usuarioId, desde, hasta);
            return res.status(200).json({ success: true, data: result });
        } catch (error: any) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    }

    getMisPagos = async (req: Request, res: Response): Promise<Response> => {
        try {
            const userId = (req as AuthRequest).user!.id;
            const result = await this.paymentService.getMisPagos(userId);
            return res.status(200).json({ success: true, data: result });
        } catch (error: any) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    }

    createPago = async (req: Request, res: Response): Promise<Response> => {
        try {
            const adminId = (req as AuthRequest).user!.id;
            const result = await this.paymentService.createPago(adminId, req.body);
            return res.status(201).json({ success: true, message: 'Pago registrado exitosamente', data: result });
        } catch (error: any) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }
}
