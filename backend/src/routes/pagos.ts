import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller";
import { PaymentService } from "../services/payment.service";
import { validateSchema } from "../middlewares/validateSchema.middleware";
import { createPaymentSchema } from "../validations/payment.validation";
import { authenticateToken } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/isAdmin.middleware";

const paymentRouter = Router();
const paymentService = new PaymentService();
const paymentController = new PaymentController(paymentService);

paymentRouter.get('/mios', authenticateToken, paymentController.getMisPagos);
paymentRouter.get('/', authenticateToken, isAdmin, paymentController.getPagos);
paymentRouter.post('/', authenticateToken, isAdmin, validateSchema(createPaymentSchema), paymentController.createPago);

export default paymentRouter;
export { paymentRouter as router };
