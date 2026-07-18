import 'dotenv/config';
import { Sequelize } from 'sequelize';
import type { Options } from 'sequelize';

const NODE_ENV = process.env.NODE_ENV || 'development';

function requireEnv(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Falta variable env: ${key}`);
    }
    return value;
}

let sequelize: Sequelize;

const commonOptions: Options = {
    dialect: 'mysql',
    logging: NODE_ENV === 'development' ? console.log : false,
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
    dialectOptions: NODE_ENV === 'production' ? {
        ssl: {
            require: true, 
            rejectUnauthorized: false 
        }
    } : {}
};

if (process.env.DATABASE_URL) {
    sequelize = new Sequelize(process.env.DATABASE_URL, commonOptions);
} 
else {
    sequelize = new Sequelize(
        requireEnv('DB_NAME'),
        requireEnv('DB_USER'),
        requireEnv('DB_PASSWORD'),
        {
            ...commonOptions,
            host: requireEnv("DB_HOST"),
            port: parseInt(process.env.DB_PORT || '3306'),
        }
    );
}

async function connectWithRetry(attempts = 5, delay = 3000) {
    for (let i = 1; i <= attempts; i++) {
        try {
            await sequelize.authenticate();
            console.log(`✅ DB conectada con Sequelize (${process.env.DATABASE_URL ? 'Modo URL' : 'Modo Variables'})`);
            return true;
        } catch (error) {
            console.error(`❌ Error, Intento ${i}/${attempts} - Error conectando a la DB:`, error);

            if (i === attempts) {
                console.error('⛔ No se pudo establecer conexión con la base de datos.');
                throw error;
            }

            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

export { sequelize, connectWithRetry };