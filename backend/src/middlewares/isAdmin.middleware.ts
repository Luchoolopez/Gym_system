import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

export const isAdmin = (req:Request, res:Response, next:NextFunction) => {
    const user = (req as AuthRequest).user;
    if(!user || user.role !== 'admin'){
        return res.status(403).json({
            success:false,
            message:'Acceso denegado: Se requieren permisos de Administracion'
        });
    }
    next();
};