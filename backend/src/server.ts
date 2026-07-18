import dotenv from 'dotenv';
dotenv.config();

import config from './config/config';
import { connectWithRetry, sequelize } from './config/database';
import { setupAssociations } from './models/index';
import { makeApp } from './app';

async function bootstrap() {
    setupAssociations();

    // Conectar la DB ANTES de abrir el puerto: el server no acepta requests sin DB
    await connectWithRetry();
    console.log('DB conectado');

    // sync solo en desarrollo; el esquema es responsabilidad de db/init-01.sql
    // (en producción usar migraciones)
    if (config.nodeEnv === 'development') {
        await sequelize.sync();
    }

    const app = makeApp();

    app.listen(config.port, () => {
        console.log(`Servidor corriendo en el puerto: ${config.port}`);
    });
}

bootstrap().catch((error) => {
    console.error('Error al iniciar el servidor: ', error);
    process.exit(1);
});
