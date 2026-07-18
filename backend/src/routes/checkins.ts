import { Router } from "express";
import { CheckInController } from "../controllers/checkin.controller";
import { CheckInService } from "../services/checkin.service";
import { validateSchema } from "../middlewares/validateSchema.middleware";
import { createCheckInSchema } from "../validations/checkin.validation";
import { authenticateToken } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/isAdmin.middleware";

const checkInRouter = Router();
const checkInService = new CheckInService();
const checkInController = new CheckInController(checkInService);

checkInRouter.get('/mios', authenticateToken, checkInController.getMisCheckIns);
checkInRouter.get('/', authenticateToken, isAdmin, checkInController.getCheckIns);
checkInRouter.post('/', authenticateToken, isAdmin, validateSchema(createCheckInSchema), checkInController.createCheckIn);

export default checkInRouter;
export { checkInRouter as router };
