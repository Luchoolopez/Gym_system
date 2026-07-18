import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { AuthRequest } from "../middlewares/auth.middleware";

export class AuthController {
    constructor(private readonly authService: AuthService) {}

    register = async (req: Request, res: Response): Promise<Response> => {
        try {
            const result = await this.authService.register(req.body);
            return res.status(201).json({
                success: true,
                message: 'Usuario registrado exitosamente',
                data: result
            });
        } catch (error: any) {
            if (error.message === "El email ya esta registrado" || error.message === "El DNI ya esta registrado") {
                return res.status(409).json({ success: false, message: error.message });
            }
            console.error(error);
            return res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    }

    login = async (req: Request, res: Response): Promise<Response> => {
        try {
            const result = await this.authService.login(req.body);
            return res.status(200).json({
                success: true,
                message: 'Inicio de sesión exitoso',
                data: result
            });
        } catch (error: any) {
            if (error.message === 'Credenciales invalidas' || error.message === 'Cuenta inactiva') {
                return res.status(401).json({
                    success: false,
                    message: error.message === 'Cuenta inactiva' ? 'Cuenta inactiva' : 'Email o contraseña incorrectos'
                });
            }
            console.error(error);
            return res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    }

    me = async (req: Request, res: Response): Promise<Response> => {
        try {
            const userId = (req as AuthRequest).user?.id;
            if (!userId) {
                return res.status(401).json({ success: false, message: 'Acceso denegado: Se requiere un token válido' });
            }

            const user = await this.authService.getProfile(userId);
            return res.status(200).json({ success: true, data: user });
        } catch (error: any) {
            if (error.message === 'Usuario no encontrado') {
                return res.status(401).json({ success: false, message: error.message });
            }
            return res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    }

    forgotPassword = async (req: Request, res: Response): Promise<Response> => {
        try {
            const result = await this.authService.forgotPassword(req.body.email);
            return res.status(200).json({ success: true, data: result });
        } catch (error: any) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    }

    resetPassword = async (req: Request, res: Response): Promise<Response> => {
        try {
            const result = await this.authService.resetPassword(req.body);
            return res.status(200).json({ success: true, message: result.message });
        } catch (error: any) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }
}
