import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

// Los Admin también pasan: pueden hacer todo lo que hace un Profesor
export const isProfessor = (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthRequest).user;
    if (!user || (user.role !== 'Profesor' && user.role !== 'Admin')) {
        return res.status(403).json({
            success: false,
            message: 'Acceso denegado: Se requieren permisos de Profesor'
        });
    }
    next();
};
