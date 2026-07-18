import { Request, Response } from "express";
import { ReservationService } from "../services/reservation.service";
import { AuthRequest } from "../middlewares/auth.middleware";

export class ReservationController {
    constructor(private readonly reservationService: ReservationService) {}

    getClasesDelDia = async (req: Request, res: Response): Promise<Response> => {
        try {
            const fecha = req.query.fecha as string | undefined;
            const actividadId = req.query.actividadId ? parseInt(req.query.actividadId as string, 10) : undefined;
            const result = await this.reservationService.getClasesDelDia(fecha, actividadId);
            return res.status(200).json({ success: true, data: result });
        } catch (error: any) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    }

    getMisReservas = async (req: Request, res: Response): Promise<Response> => {
        try {
            const userId = (req as AuthRequest).user!.id;
            const result = await this.reservationService.getMisReservas(userId);
            return res.status(200).json({ success: true, data: result });
        } catch (error: any) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    }

    createReserva = async (req: Request, res: Response): Promise<Response> => {
        try {
            const userId = (req as AuthRequest).user!.id;
            const result = await this.reservationService.createReserva(userId, req.body);
            return res.status(201).json({ success: true, message: 'Reserva realizada exitosamente', data: result });
        } catch (error: any) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    cancelarReserva = async (req: Request, res: Response): Promise<Response> => {
        try {
            const userId = (req as AuthRequest).user!.id;
            const id = parseInt(String(req.params.id), 10);
            const result = await this.reservationService.cancelarReserva(userId, id);
            return res.status(200).json({ success: true, message: 'Reserva cancelada exitosamente', data: result });
        } catch (error: any) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    getInscriptos = async (req: Request, res: Response): Promise<Response> => {
        try {
            const scheduleId = parseInt(String(req.params.scheduleId), 10);
            const fecha = req.query.fecha as string;
            if (!fecha || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
                return res.status(400).json({ success: false, message: 'El parámetro fecha es obligatorio (YYYY-MM-DD)' });
            }
            const result = await this.reservationService.getInscriptos(scheduleId, fecha);
            return res.status(200).json({ success: true, data: result });
        } catch (error: any) {
            return res.status(404).json({ success: false, message: error.message });
        }
    }

    marcarAsistencia = async (req: Request, res: Response): Promise<Response> => {
        try {
            const id = parseInt(String(req.params.id), 10);
            const result = await this.reservationService.marcarAsistencia(id, req.body);
            return res.status(200).json({ success: true, message: 'Asistencia registrada exitosamente', data: result });
        } catch (error: any) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }
}
