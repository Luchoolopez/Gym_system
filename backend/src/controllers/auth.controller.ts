import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { AuthRequest } from "../middlewares/auth.middleware";

export class AuthController {
    constructor(private readonly authService: AuthService) {}

    register = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const result = await this.authService.register(req.body);
            return res.status(201).json({
                success: true,
                message: 'Usuario registrado exitosamente',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    login = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const result = await this.authService.login(req.body);
            return res.status(200).json({
                success: true,
                message: 'Inicio de sesión exitoso',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    me = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const userId = (req as AuthRequest).user?.id;
            if (!userId) {
                return res.status(401).json({ success: false, message: 'Acceso denegado: Se requiere un token válido' });
            }

            const user = await this.authService.getProfile(userId);
            return res.status(200).json({ success: true, data: user });
        } catch (error) {
            next(error);
        }
    }

    forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const result = await this.authService.forgotPassword(req.body.email);
            return res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const result = await this.authService.resetPassword(req.body);
            return res.status(200).json({ success: true, message: result.message });
        } catch (error) {
            next(error);
        }
    }
}
