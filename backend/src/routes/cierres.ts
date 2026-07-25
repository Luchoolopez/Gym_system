import { Router } from "express";
import { ClosureController } from "../controllers/closure.controller";
import { ClosureService } from "../services/closure.service";
import { validateSchema } from "../middlewares/validateSchema.middleware";
import { createClosureSchema } from "../validations/closure.validation";
import { authenticateToken } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/isAdmin.middleware";

const closureRouter = Router();
const closureService = new ClosureService();
const closureController = new ClosureController(closureService);

closureRouter.get('/hoy', authenticateToken, isAdmin, closureController.getResumenHoy);
closureRouter.get('/', authenticateToken, isAdmin, closureController.getCierres);
closureRouter.post('/', authenticateToken, isAdmin, validateSchema(createClosureSchema), closureController.cerrarDia);

export default closureRouter;
export { closureRouter as router };
