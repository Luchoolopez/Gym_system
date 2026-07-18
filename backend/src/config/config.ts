import dotenv from 'dotenv';

dotenv.config();

interface Config{
    port:number,
    nodeEnv: string,
    reservationCloseMinutes: number,
}

const config: Config = {
    port: Number(process.env.PORT) || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    // Minutos antes del inicio en los que la clase "cierra" y ya no se puede reservar/cancelar
    reservationCloseMinutes: Number(process.env.RESERVATION_CLOSE_MINUTES) || 10
};

export default config;