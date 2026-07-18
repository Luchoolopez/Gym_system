import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { AuthRequest } from "../middlewares/auth.middleware";

export class UserController {
    constructor(private readonly userService: UserService) {}

    getUsuarios = async (req: Request, res: Response): Promise<Response> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;
            const rol = req.query.rol as string | undefined;
            const busqueda = req.query.busqueda as string | undefined;
            const result = await this.userService.getUsuarios(page, limit, rol, busqueda);
            return res.status(200).json({ success: true, data: result });
        } catch (error: any) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    }

    getUsuarioById = async (req: Request, res: Response): Promise<Response> => {
        try {
            const id = parseInt(String(req.params.id), 10);
            const result = await this.userService.getUsuarioById(id);
            return res.status(200).json({ success: true, data: result });
        } catch (error: any) {
            return res.status(404).json({ success: false, message: error.message });
        }
    }

    createUsuario = async (req: Request, res: Response): Promise<Response> => {
        try {
            const result = await this.userService.createUsuario(req.body);
            return res.status(201).json({ success: true, message: 'Usuario creado exitosamente', data: result });
        } catch (error: any) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    updateUsuario = async (req: Request, res: Response): Promise<Response> => {
        try {
            const id = parseInt(String(req.params.id), 10);
            const result = await this.userService.updateUsuario(id, req.body);
            return res.status(200).json({ success: true, message: 'Usuario actualizado exitosamente', data: result });
        } catch (error: any) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    updatePerfil = async (req: Request, res: Response): Promise<Response> => {
        try {
            const userId = (req as AuthRequest).user?.id;
            if (!userId) {
                return res.status(401).json({ success: false, message: 'No autorizado' });
            }
            const result = await this.userService.updatePerfil(userId, req.body);
            return res.status(200).json({ success: true, message: 'Perfil actualizado exitosamente', data: result });
        } catch (error: any) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    deleteUsuario = async (req: Request, res: Response): Promise<Response> => {
        try {
            const id = parseInt(String(req.params.id), 10);
            await this.userService.deleteUsuario(id);
            return res.status(200).json({ success: true, message: 'Usuario dado de baja exitosamente' });
        } catch (error: any) {
            return res.status(404).json({ success: false, message: error.message });
        }
    }
}
