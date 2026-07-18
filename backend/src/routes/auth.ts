import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { AuthService } from "../services/auth.service";
import { validateSchema } from "../middlewares/validateSchema.middleware";
import { registerUserSchema, loginUserSchema, forgotPasswordSchema, resetPasswordSchema } from "../validations/user.validation";
import { authenticateToken } from "../middlewares/auth.middleware";

const authRouter = Router();
const authService = new AuthService();
const authController = new AuthController(authService);

authRouter.post('/register', validateSchema(registerUserSchema), authController.register);
authRouter.post('/login', validateSchema(loginUserSchema), authController.login);
authRouter.post('/forgot-password', validateSchema(forgotPasswordSchema), authController.forgotPassword);
authRouter.post('/reset-password', validateSchema(resetPasswordSchema), authController.resetPassword);
authRouter.get('/me', authenticateToken, authController.me);

export default authRouter;
export { authRouter as router };
