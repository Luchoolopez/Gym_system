import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { UserService } from "../services/user.service";
import { validateSchema } from "../middlewares/validateSchema.middleware";
import { createUserSchema, updateUserSchema, updateProfileSchema } from "../validations/user.validation";
import { authenticateToken } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/isAdmin.middleware";

const userRouter = Router();
const userService = new UserService();
const userController = new UserController(userService);

// '/perfil' va antes de '/:id' para que no lo capture como parámetro
userRouter.patch('/perfil', authenticateToken, validateSchema(updateProfileSchema), userController.updatePerfil);

userRouter.get('/', authenticateToken, isAdmin, userController.getUsuarios);
userRouter.get('/:id', authenticateToken, isAdmin, userController.getUsuarioById);
userRouter.post('/', authenticateToken, isAdmin, validateSchema(createUserSchema), userController.createUsuario);
userRouter.patch('/:id', authenticateToken, isAdmin, validateSchema(updateUserSchema), userController.updateUsuario);
userRouter.delete('/:id', authenticateToken, isAdmin, userController.deleteUsuario);

export default userRouter;
export { userRouter as router };
