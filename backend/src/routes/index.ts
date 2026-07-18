import { Router } from "express";
import { readdirSync } from "fs";

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PATH_ROUTER = __dirname;
const router = Router();

const cleanFileName = (fileName: string): string | undefined => {
    const file = fileName.split('.').shift();
    return file;
}

const loadRoutes = async () => {
    const files = readdirSync(PATH_ROUTER);
    for (const fileName of files) {
        const cleanName = cleanFileName(fileName);
        if (cleanName && cleanName !== 'index') {
            try {
                const module = await import(`./${cleanName}`);
                const moduleRouter = module.router || module.default;

                if (moduleRouter) {
                    console.log(`Ruta cargada y registrada: /api/${cleanName}`);
                    router.use(`/${cleanName}`, moduleRouter);
                } else {
                    console.warn(`El módulo de ruta ${cleanName} no exporta un 'router' o un 'default'.`);
                }
            } catch (error) {
                console.error(`Error al cargar la ruta /${cleanName}:`, error);
            }
        }
    }
};

loadRoutes();

export { router };