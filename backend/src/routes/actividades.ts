import { Router } from "express";
import { ActivityController } from "../controllers/activity.controller";
import { ActivityService } from "../services/activity.service";
import { validateSchema } from "../middlewares/validateSchema.middleware";
import { createActivitySchema, updateActivitySchema } from "../validations/activity.validation";
import { authenticateToken } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/isAdmin.middleware";

const activityRouter = Router();
const activityService = new ActivityService();
const activityController = new ActivityController(activityService);

activityRouter.get('/', activityController.getActividades);
activityRouter.get('/:id', activityController.getActividadById);
activityRouter.post('/', authenticateToken, isAdmin, validateSchema(createActivitySchema), activityController.createActividad);
activityRouter.patch('/:id', authenticateToken, isAdmin, validateSchema(updateActivitySchema), activityController.updateActividad);
activityRouter.delete('/:id', authenticateToken, isAdmin, activityController.deleteActividad);

export default activityRouter;
export { activityRouter as router };
