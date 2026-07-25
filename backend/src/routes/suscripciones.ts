import { Router } from "express";
import { SubscriptionController } from "../controllers/subscription.controller";
import { SubscriptionService } from "../services/subscription.service";
import { validateSchema } from "../middlewares/validateSchema.middleware";
import { createSubscriptionSchema, renewSubscriptionSchema, updateSubscriptionSchema } from "../validations/subscription.validation";
import { authenticateToken } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/isAdmin.middleware";

const subscriptionRouter = Router();
const subscriptionService = new SubscriptionService();
const subscriptionController = new SubscriptionController(subscriptionService);

subscriptionRouter.get('/mia', authenticateToken, subscriptionController.getMiSuscripcion);
subscriptionRouter.get('/', authenticateToken, isAdmin, subscriptionController.getSuscripciones);
subscriptionRouter.get('/usuario/:userId', authenticateToken, isAdmin, subscriptionController.getHistorialUsuario);
subscriptionRouter.post('/', authenticateToken, isAdmin, validateSchema(createSubscriptionSchema), subscriptionController.createSuscripcion);
subscriptionRouter.post('/:id/renovar', authenticateToken, isAdmin, validateSchema(renewSubscriptionSchema), subscriptionController.renovarSuscripcion);
subscriptionRouter.patch('/:id/cancelar', authenticateToken, isAdmin, subscriptionController.cancelarSuscripcion);
subscriptionRouter.patch('/:id', authenticateToken, isAdmin, validateSchema(updateSubscriptionSchema), subscriptionController.updateSuscripcion);

export default subscriptionRouter;
export { subscriptionRouter as router };
