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
        await sequelize.sync();
    } catch (error) {
        console.error('Error conectando a la DB: ', error);
    }
});
