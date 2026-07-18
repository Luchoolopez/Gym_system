import { Router } from "express";
import { ScheduleController } from "../controllers/schedule.controller";
import { ScheduleService } from "../services/schedule.service";
import { validateSchema } from "../middlewares/validateSchema.middleware";
import { createScheduleSchema, updateScheduleSchema } from "../validations/schedule.validation";
import { authenticateToken } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/isAdmin.middleware";
import { isProfessor } from "../middlewares/isProfessor.middleware";

const scheduleRouter = Router();
const scheduleService = new ScheduleService();
const scheduleController = new ScheduleController(scheduleService);

scheduleRouter.get('/', scheduleController.getGrilla);
scheduleRouter.get('/profesor/:id', authenticateToken, isProfessor, scheduleController.getByProfesor);
scheduleRouter.post('/', authenticateToken, isAdmin, validateSchema(createScheduleSchema), scheduleController.createHorario);
scheduleRouter.patch('/:id', authenticateToken, isAdmin, validateSchema(updateScheduleSchema), scheduleController.updateHorario);
scheduleRouter.delete('/:id', authenticateToken, isAdmin, scheduleController.deleteHorario);

export default scheduleRouter;
export { scheduleRouter as router };
