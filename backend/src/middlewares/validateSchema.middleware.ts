import { Request, Response, NextFunction } from "express";
import { ZodType, ZodError } from "zod";

export const validateSchema = (
    schema: ZodType<any>,
    source: 'body' | 'query' | 'params' = 'body'
) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dataToValidate = req[source];
            const validatedData = await schema.parseAsync(dataToValidate);
            req[source] = validatedData;
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const issues = error.issues.map((issue) => ({
                    field: issue.path.join('.'),
                    message: issue.message,
                }));

                return res.status(400).json({
                    success: false,
                    message: 'Error de validacion',
                    error: issues
                });
            }

            next(error);
        }
    }