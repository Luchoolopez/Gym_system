import express from 'express';
import corsMiddleware from './config/cors';
import { router } from './routes';
import { errorHandler } from './middlewares/error.middleware';

export function makeApp() {
    const app = express();

    app.use(express.json());

    app.use(corsMiddleware);

    app.use(express.urlencoded({ extended: true }));

    app.use('/api', router);

    app.use((req, res) => { res.status(404).json({ message: 'Not Found' }) });
    app.use(errorHandler);

    return app;
}
