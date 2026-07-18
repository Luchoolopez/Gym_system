import cors from 'cors';
import 'dotenv/config';

const whitelist = [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.FRONTEND_URL
];

const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
        if (!origin) {
            return callback(null, true);
        }

        if (whitelist.indexOf(origin) !== -1) {
            return callback(null, true);
        }

        if (origin.endsWith('.vercel.app')) {
            return callback(null, true);
        }

        console.error('Bloqueado por CORS:', origin);
        return callback(null, false);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-session-id'],
    credentials: true,
    optionsSuccessStatus: 204 // Importante para navegadores legacy
};

export default cors(corsOptions);