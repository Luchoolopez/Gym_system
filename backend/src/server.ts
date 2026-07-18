import dotenv from 'dotenv';
dotenv.config();

import config from './config/config';
import { connectWithRetry, sequelize } from './config/database';
import { setupAssociations } from './models/index';
import { makeApp } from './app';

setupAssociations();

const app = makeApp();

app.listen(config.port, async () => {
    console.log(`Servidor corriendo en el puerto: ${config.port}`);
    try {
        await connectWithRetry();
        console.log('DB conectado');
        // Sin { alter: true }: en MySQL duplica los índices UNIQUE en cada reinicio.
        // El esquema es responsabilidad de db/init-01.sql (docker compose down -v para regenerarlo).
        await sequelize.sync();
    } catch (error) {
        console.error('Error conectando a la DB: ', error);
    }
});
