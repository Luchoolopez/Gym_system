import { Router } from "express";
import { PlanController } from "../controllers/plan.controller";
import { PlanService } from "../services/plan.service";
import { validateSchema } from "../middlewares/validateSchema.middleware";
import { createPlanSchema, updatePlanSchema } from "../validations/plan.validation";
import { authenticateToken } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/isAdmin.middleware";

const planRouter = Router();
const planService = new PlanService();
const planController = new PlanController(planService);

planRouter.get('/', planController.getPlanes);
planRouter.get('/:id', planController.getPlanById);
planRouter.post('/', authenticateToken, isAdmin, validateSchema(createPlanSchema), planController.createPlan);
planRouter.patch('/:id', authenticateToken, isAdmin, validateSchema(updatePlanSchema), planController.updatePlan);
planRouter.delete('/:id', authenticateToken, isAdmin, planController.deletePlan);

export default planRouter;
export { planRouter as router };
