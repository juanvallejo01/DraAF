import { Response, NextFunction } from 'express';
import { RequestAutenticado } from '../types';
import * as configuracionService from '../services/configuracion.service';
import { responderExito } from '../utils/respuesta';

export const obtenerWhatsApp = async (
  req: RequestAutenticado,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const config = await configuracionService.obtenerConfiguracionWhatsApp();
    responderExito(res, config, 'Configuración obtenida correctamente');
  } catch (error) {
    next(error);
  }
};

export const obtenerContactoPublico = async (
  _req: RequestAutenticado,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const config = await configuracionService.obtenerConfiguracionWhatsApp();
    responderExito(res, {
      whatsapp: config.clinica_whatsapp_admin || '573000000000',
      direccion: config.clinica_direccion || 'Calle 10 #5-20, Cali, Colombia',
      enlaceMaps: config.clinica_enlace_maps || 'https://maps.google.com/'
    }, 'Contacto obtenido');
  } catch (error) {
    next(error);
  }
};

export const obtenerHorarios = async (
  req: RequestAutenticado,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const config = await configuracionService.obtenerConfiguracionHorarios();
    responderExito(res, config, 'Horarios obtenidos correctamente');
  } catch (error) {
    next(error);
  }
};

export const actualizarHorarios = async (
  req: RequestAutenticado,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const config = await configuracionService.actualizarConfiguracionHorarios(req.body);
    responderExito(res, config, 'Horarios actualizados correctamente');
  } catch (error) {
    next(error);
  }
};

export const actualizarWhatsApp = async (
  req: RequestAutenticado,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const config = await configuracionService.actualizarConfiguracionWhatsApp(req.body);
    responderExito(res, config, 'Configuración actualizada correctamente');
  } catch (error) {
    next(error);
  }
};

export const listarFechasBloqueadas = async (
  req: RequestAutenticado,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const fechas = await configuracionService.obtenerFechasBloqueadas();
    responderExito(res, { fechas }, 'Fechas bloqueadas obtenidas');
  } catch (error) {
    next(error);
  }
};

export const agregarFecha = async (
  req: RequestAutenticado,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { fecha } = req.body as { fecha: string };
    if (!fecha || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      res.status(400).json({ exito: false, mensaje: 'Formato de fecha inválido (YYYY-MM-DD)' });
      return;
    }
    const fechas = await configuracionService.agregarFechaBloqueada(fecha);
    responderExito(res, { fechas }, 'Fecha bloqueada agregada');
  } catch (error) {
    next(error);
  }
};

export const eliminarFecha = async (
  req: RequestAutenticado,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { fecha } = req.params;
    const fechas = await configuracionService.eliminarFechaBloqueada(fecha);
    responderExito(res, { fechas }, 'Fecha desbloqueada');
  } catch (error) {
    next(error);
  }
};

export const obtenerPoliticaCancelacion = async (
  req: RequestAutenticado,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const politica = await configuracionService.obtenerPoliticaCancelacion();
    responderExito(res, politica, 'Política de cancelación obtenida');
  } catch (error) {
    next(error);
  }
};

export const obtenerConfiguracionRecordatorio = async (
  req: RequestAutenticado,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const horas = await configuracionService.obtenerHorasRecordatorio();
    responderExito(res, { horasRecordatorio: horas }, 'Configuración de recordatorio obtenida');
  } catch (error) {
    next(error);
  }
};

export const actualizarConfiguracionRecordatorio = async (
  req: RequestAutenticado,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { horasRecordatorio } = req.body as { horasRecordatorio: number };
    await configuracionService.actualizarConfiguracion('clinica_horas_recordatorio', String(Number(horasRecordatorio)));
    responderExito(res, { horasRecordatorio: Number(horasRecordatorio) }, 'Configuración de recordatorio actualizada');
  } catch (error) {
    next(error);
  }
};

export const actualizarPoliticaCancelacion = async (
  req: RequestAutenticado,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { horasMinimas } = req.body as { horasMinimas: number };
    const politica = await configuracionService.actualizarPoliticaCancelacion(Number(horasMinimas));
    responderExito(res, politica, 'Política de cancelación actualizada');
  } catch (error) {
    next(error);
  }
};
