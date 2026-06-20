import { Request, Response, NextFunction } from 'express';

export class ErrorPersonalizado extends Error {
  constructor(
    public mensaje: string,
    public codigoEstado: number = 500,
    public errores?: string[]
  ) {
    super(mensaje);
    this.name = 'ErrorPersonalizado';
  }
}

export const manejarErrores = (
  error: Error | ErrorPersonalizado,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('❌ Error:', error);

  if (error instanceof ErrorPersonalizado) {
    res.status(error.codigoEstado).json({
      exito: false,
      mensaje: error.mensaje,
      ...(error.errores && { errores: error.errores }),
    });
    return;
  }

  if (error.name === 'CastError') {
    res.status(400).json({
      exito: false,
      mensaje: 'Identificador inválido',
    });
    return;
  }

  if (error.name === 'ValidationError') {
    res.status(400).json({
      exito: false,
      mensaje: 'Error de validación en los datos',
    });
    return;
  }

  res.status(500).json({
    exito: false,
    mensaje: 'Error interno del servidor',
  });
};

export const manejarRutaNoEncontrada = (_req: Request, res: Response): void => {
  res.status(404).json({
    exito: false,
    mensaje: 'Ruta no encontrada',
  });
};
