import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";
import { AuthRequest } from "../middlewares/auth.middleware";

export class UserController {
    constructor(private readonly userService: UserService) {}

    getUsuarios = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;
            const rol = req.query.rol as string | undefined;
            const busqueda = req.query.busqueda as string | undefined;
            const result = await this.userService.getUsuarios(page, limit, rol, busqueda);
            return res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    getUsuarioById = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const id = parseInt(String(req.params.id), 10);
            const result = await this.userService.getUsuarioById(id);
            return res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    createUsuario = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const result = await this.userService.createUsuario(req.body);
            return res.status(201).json({ success: true, message: 'Usuario creado exitosamente', data: result });
        } catch (error) {
            next(error);
        }
    }

    updateUsuario = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const id = parseInt(String(req.params.id), 10);
            const result = await this.userService.updateUsuario(id, req.body);
            return res.status(200).json({ success: true, message: 'Usuario actualizado exitosamente', data: result });
        } catch (error) {
            next(error);
        }
    }

    updatePerfil = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const userId = (req as AuthRequest).user?.id;
            if (!userId) {
                return res.status(401).json({ success: false, message: 'No autorizado' });
            }
            const result = await this.userService.updatePerfil(userId, req.body);
            return res.status(200).json({ success: true, message: 'Perfil actualizado exitosamente', data: result });
        } catch (error) {
            next(error);
        }
    }

    deleteUsuario = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const id = parseInt(String(req.params.id), 10);
            await this.userService.deleteUsuario(id);
            return res.status(200).json({ success: true, message: 'Usuario dado de baja exitosamente' });
        } catch (error) {
            next(error);
        }
    }
}
