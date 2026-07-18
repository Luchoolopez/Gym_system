import { Router } from "express";
import { ReservationController } from "../controllers/reservation.controller";
import { ReservationService } from "../services/reservation.service";
import { validateSchema } from "../middlewares/validateSchema.middleware";
import { createReservationSchema, attendanceSchema } from "../validations/reservation.validation";
import { authenticateToken } from "../middlewares/auth.middleware";
import { isProfessor } from "../middlewares/isProfessor.middleware";

const reservationRouter = Router();
const reservationService = new ReservationService();
const reservationController = new ReservationController(reservationService);

reservationRouter.get('/dia', authenticateToken, reservationController.getClasesDelDia);
reservationRouter.get('/mias', authenticateToken, reservationController.getMisReservas);
reservationRouter.get('/clase/:scheduleId', authenticateToken, isProfessor, reservationController.getInscriptos);
reservationRouter.post('/', authenticateToken, validateSchema(createReservationSchema), reservationController.createReserva);
reservationRouter.patch('/:id/cancelar', authenticateToken, reservationController.cancelarReserva);
reservationRouter.patch('/:id/asistencia', authenticateToken, isProfessor, validateSchema(attendanceSchema), reservationController.marcarAsistencia);

export default reservationRouter;
export { reservationRouter as router };
