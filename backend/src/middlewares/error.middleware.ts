import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
    status?: number;
}

export const errorHandler = (
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    //Logueamos el error para el desarrollador (usar librerías como Winston o Morgan)
    console.error(`[Error] ${req.method} ${req.path} >> ${err.message}`);

    // Si es un error de Multer por tamaño de archivo
    if (err.message === 'File too large') {
        return res.status(400).json({
            success: false,
            message: 'La imagen es demasiado pesada. Máximo permitido: 5MB'
        });
    }

    //el status code (por defecto 500)
    const status = err.status || 500;
    
    //Respuesta estandarizada
    res.status(status).json({
        success: false,
        message: err.message || 'Ocurrió un error interno en el servidor',
        // Opcional: solo mostrar el stack trace en desarrollo
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};