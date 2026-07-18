import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: {
        id: number;
        role: string;
    }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Acceso denegado: Se requiere un token de autenticación'
        });
    }

    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('se necesita el codigo secreto');
        }

        const decoded = jwt.verify(token, secret);

        (req as AuthRequest).user = decoded as { id: number; role: string };

        next();

    } catch (error) {
        return res.status(403).json({
            success: false,
            message: 'Token inválido o expirado'
        });
    }
};
