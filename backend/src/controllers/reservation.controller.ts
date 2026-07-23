import { Request, Response, NextFunction } from "express";
import { ReservationService } from "../services/reservation.service";
import { AuthRequest } from "../middlewares/auth.middleware";

export class ReservationController {
    constructor(private readonly reservationService: ReservationService) {}

    getClasesDelDia = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const fecha = req.query.fecha as string | undefined;
            const actividadId = req.query.actividadId ? parseInt(req.query.actividadId as string, 10) : undefined;
            const result = await this.reservationService.getClasesDelDia(fecha, actividadId);
            return res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    getMisReservas = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const userId = (req as AuthRequest).user!.id;
            const result = await this.reservationService.getMisReservas(userId);
            return res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    createReserva = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const userId = (req as AuthRequest).user!.id;
            const result = await this.reservationService.createReserva(userId, req.body);
            return res.status(201).json({ success: true, message: 'Reserva realizada exitosamente', data: result });
        } catch (error) {
            next(error);
        }
    }

    cancelarReserva = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const userId = (req as AuthRequest).user!.id;
            const id = parseInt(String(req.params.id), 10);
            const result = await this.reservationService.cancelarReserva(userId, id);
            return res.status(200).json({ success: true, message: 'Reserva cancelada exitosamente', data: result });
        } catch (error) {
            next(error);
        }
    }

    adminCreateReserva = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const result = await this.reservationService.adminCreateReserva(req.body);
            return res.status(201).json({ success: true, message: 'Socio anotado en la clase', data: result });
        } catch (error) {
            next(error);
        }
    }

    adminCancelReserva = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const id = parseInt(String(req.params.id), 10);
            const result = await this.reservationService.adminCancelReserva(id);
            return res.status(200).json({ success: true, message: 'Socio quitado de la clase', data: result });
        } catch (error) {
            next(error);
        }
    }

    getInscriptos = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const scheduleId = parseInt(String(req.params.scheduleId), 10);
            const fecha = req.query.fecha as string;
            if (!fecha || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
                return res.status(400).json({ success: false, message: 'El parámetro fecha es obligatorio (YYYY-MM-DD)' });
            }
            const result = await this.reservationService.getInscriptos(scheduleId, fecha);
            return res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    marcarAsistencia = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const id = parseInt(String(req.params.id), 10);
            const result = await this.reservationService.marcarAsistencia(id, req.body);
            return res.status(200).json({ success: true, message: 'Asistencia registrada exitosamente', data: result });
        } catch (error) {
            next(error);
        }
    }
}
