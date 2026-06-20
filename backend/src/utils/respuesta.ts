import { Response } from 'express';
import { RespuestaAPI } from '../types';

export const responderExito = <T>(
  res: Response,
  datos: T,
  mensaje = 'Operación exitosa',
  codigoEstado = 200
): void => {
  const respuesta: RespuestaAPI<T> = {
    exito: true,
    mensaje,
    datos,
  };
  res.status(codigoEstado).json(respuesta);
};

export const responderError = (
  res: Response,
  codigoEstado: number,
  mensaje: string,
  errores?: string[]
): void => {
  const respuesta: RespuestaAPI = {
    exito: false,
    mensaje,
    ...(errores && { errores }),
  };
  res.status(codigoEstado).json(respuesta);
};
