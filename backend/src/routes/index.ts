import { Router } from "express";
import { readdirSync } from "fs";

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PATH_ROUTER = __dirname;
const router = Router();

// Solo archivos de ruta válidos: un nombre + extensión (ej. "usuarios.ts").
// Archivos con más de un punto (ej. "user.controller.ts") se ignoran.
const cleanFileName = (fileName: string): string | undefined => {
    const parts = fileName.split('.');
    if (parts.length !== 2 || !['ts', 'js'].includes(parts[1]!)) {
        return undefined;
    }
    return parts[0];
}

const loadRoutes = async () => {
    const files = readdirSync(PATH_ROUTER);
    for (const fileName of files) {
        const cleanName = cleanFileName(fileName);
        if (cleanName && cleanName !== 'index') {
            const module = await import(`./${cleanName}`);
            const moduleRouter = module.router || module.default;

            if (moduleRouter) {
                console.log(`Ruta cargada y registrada: /api/${cleanName}`);
                router.use(`/${cleanName}`, moduleRouter);
            } else {
                throw new Error(`El módulo de ruta ${cleanName} no exporta un 'router' o un 'default'.`);
            }
        }
    }
};

// Top-level await: si una ruta falla al cargar, el server no arranca (falla visible, no silenciosa)
await loadRoutes();

export { router };
