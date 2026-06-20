import { Response, NextFunction } from 'express';
import { RequestAutenticado } from '../types';
import * as tratamientoService from '../services/tratamiento.service';
import { responderExito } from '../utils/respuesta';

export const listar = async (
  req: RequestAutenticado,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const soloActivos = req.query.todos !== 'true';
    const tratamientos = await tratamientoService.listarTratamientos(soloActivos);
    responderExito(res, tratamientos, 'Tratamientos obtenidos correctamente');
  } catch (error) {
    next(error);
  }
};

export const obtener = async (
  req: RequestAutenticado,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tratamiento = await tratamientoService.obtenerTratamiento(req.params.id);
    responderExito(res, tratamiento, 'Tratamiento obtenido correctamente');
  } catch (error) {
    next(error);
  }
};

export const crear = async (
  req: RequestAutenticado,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tratamiento = await tratamientoService.crearTratamiento(req.body);
    responderExito(res, tratamiento, 'Tratamiento creado correctamente', 201);
  } catch (error) {
    next(error);
  }
};

export const actualizar = async (
  req: RequestAutenticado,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tratamiento = await tratamientoService.actualizarTratamiento(req.params.id, req.body);
    responderExito(res, tratamiento, 'Tratamiento actualizado correctamente');
  } catch (error) {
    next(error);
  }
};

export const eliminar = async (
  req: RequestAutenticado,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await tratamientoService.eliminarTratamiento(req.params.id);
    responderExito(res, null, 'Tratamiento desactivado correctamente');
  } catch (error) {
    next(error);
  }
};
