import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validar = (esquema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const resultado = esquema.safeParse(req.body);

    if (!resultado.success) {
      const errores = resultado.error.errors.map((e) => e.message);
      res.status(400).json({
        exito: false,
        mensaje: 'Datos de entrada inválidos',
        errores,
      });
      return;
    }

    req.body = resultado.data;
    next();
  };
};
