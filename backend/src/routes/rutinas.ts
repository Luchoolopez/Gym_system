import { Router } from "express";
import { RoutineController } from "../controllers/routine.controller";
import { RoutineService } from "../services/routine.service";
import { validateSchema } from "../middlewares/validateSchema.middleware";
import { createRoutineSchema, updateRoutineSchema } from "../validations/routine.validation";
import { authenticateToken } from "../middlewares/auth.middleware";
import { isProfessor } from "../middlewares/isProfessor.middleware";

const routineRouter = Router();
const routineService = new RoutineService();
const routineController = new RoutineController(routineService);

routineRouter.get('/mias', authenticateToken, routineController.getMisRutinas);
routineRouter.get('/creadas', authenticateToken, isProfessor, routineController.getCreadas);
routineRouter.post('/', authenticateToken, isProfessor, validateSchema(createRoutineSchema), routineController.createRutina);
routineRouter.patch('/:id', authenticateToken, isProfessor, validateSchema(updateRoutineSchema), routineController.updateRutina);
routineRouter.delete('/:id', authenticateToken, isProfessor, routineController.deleteRutina);

export default routineRouter;
export { routineRouter as router };
