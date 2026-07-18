import rateLimit from 'express-rate-limit';

// Protección contra fuerza bruta en los endpoints de autenticación
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 20, // intentos por IP en la ventana
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Demasiados intentos. Probá de nuevo en unos minutos'
    }
});
