import { Response, NextFunction } from 'express';
import { RequestAutenticado } from '../types';
import * as citaService from '../services/cita.service';
import { responderExito } from '../utils/respuesta';

export const crear = async (
  req: RequestAutenticado,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const cita = await citaService.crearCita(req.usuario!.id, req.body);
    responderExito(res, cita, 'Cita reservada correctamente', 201);
  } catch (error) {
    next(error);
  }
};

export const misciTAS = async (
  req: RequestAutenticado,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const citas = await citaService.listarCitasPaciente(req.usuario!.id);
    responderExito(res, citas, 'Citas obtenidas correctamente');
  } catch (error) {
    next(error);
  }
};

export const cancelar = async (
  req: RequestAutenticado,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const cita = await citaService.cancelarCita(req.params.id, req.usuario!.id);
    responderExito(res, cita, 'Cita cancelada correctamente');
  } catch (error) {
    next(error);
  }
};

export const disponibilidad = async (
  req: RequestAutenticado,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { fecha, tratamiento } = req.query as { fecha: string; tratamiento: string };
    const resultado = await citaService.obtenerDisponibilidad(fecha, tratamiento);
    responderExito(res, resultado, 'Disponibilidad obtenida correctamente');
  } catch (error) {
    next(error);
  }
};

export const listarAdmin = async (
  req: RequestAutenticado,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { fecha, estado, paciente, pagina, limite } = req.query as Record<string, string>;
    const resultado = await citaService.listarTodasLasCitas({
      fecha,
      estado,
      pacienteId: paciente,
      pagina: pagina ? parseInt(pagina, 10) : undefined,
      limite: limite ? parseInt(limite, 10) : undefined,
    });
    responderExito(res, resultado, 'Citas obtenidas correctamente');
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
    const cita = await citaService.obtenerCita(req.params.id);
    responderExito(res, cita, 'Cita obtenida correctamente');
  } catch (error) {
    next(error);
  }
};

export const actualizarEstado = async (
  req: RequestAutenticado,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const cita = await citaService.actualizarEstadoCita(req.params.id, req.body);
    responderExito(res, cita, 'Estado de la cita actualizado correctamente');
  } catch (error) {
    next(error);
  }
};

export const dashboard = async (
  req: RequestAutenticado,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const estadisticas = await citaService.obtenerEstadisticasDashboard();
    responderExito(res, estadisticas, 'Estadísticas obtenidas correctamente');
  } catch (error) {
    next(error);
  }
};

export const actualizarNotas = async (
  req: RequestAutenticado,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const cita = await citaService.actualizarNotasAdmin(req.params.id, req.body.notasAdmin ?? '');
    responderExito(res, cita, 'Notas actualizadas correctamente');
  } catch (error) {
    next(error);
  }
};

export const crearAdmin = async (
  req: RequestAutenticado,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const cita = await citaService.crearCitaAdmin(req.body);
    responderExito(res, cita, 'Cita creada correctamente', 201);
  } catch (error) {
    next(error);
  }
};

export const conteoPendientes = async (
  _req: RequestAutenticado,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const total = await citaService.contarCitasPendientes();
    responderExito(res, { pendientes: total }, 'Conteo obtenido');
  } catch (error) {
    next(error);
  }
};

export const resumenMes = async (
  req: RequestAutenticado,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const year = parseInt(req.query.year as string, 10);
    const month = parseInt(req.query.month as string, 10);

    if (!year || !month || month < 1 || month > 12) {
      res.status(400).json({ exito: false, mensaje: 'Año y mes son requeridos y deben ser válidos' });
      return;
    }

    const resumen = await citaService.obtenerResumenMes(year, month);
    responderExito(res, resumen, 'Resumen del mes obtenido correctamente');
  } catch (error) {
    next(error);
  }
};
