import { Response, NextFunction } from 'express';
import { RequestAutenticado } from '../types';
import * as authService from '../services/auth.service';
import { responderExito } from '../utils/respuesta';

export const registrar = async (
  req: RequestAutenticado,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const resultado = await authService.registrarPaciente(req.body);
    responderExito(res, resultado, 'Registro exitoso', 201);
  } catch (error) {
    next(error);
  }
};

export const iniciarSesion = async (
  req: RequestAutenticado,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const resultado = await authService.iniciarSesion(req.body);
    responderExito(res, resultado, 'Inicio de sesión exitoso');
  } catch (error) {
    next(error);
  }
};

export const perfil = async (
  req: RequestAutenticado,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const usuario = await authService.obtenerPerfil(req.usuario!.id);
    responderExito(res, usuario, 'Perfil obtenido correctamente');
  } catch (error) {
    next(error);
  }
};

export const actualizarPerfil = async (
  req: RequestAutenticado,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const resultado = await authService.actualizarPerfil(req.usuario!.id, req.body);
    responderExito(res, resultado, 'Perfil actualizado correctamente');
  } catch (error) {
    next(error);
  }
};

export const olvidePassword = async (
  req: RequestAutenticado,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await authService.generarCodigoRecuperacion(req.body);
    responderExito(res, null, 'Si el correo está registrado, recibirás un WhatsApp con las instrucciones');
  } catch (error) {
    next(error);
  }
};

export const restablecerPassword = async (
  req: RequestAutenticado,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await authService.restablecerPasswordConCodigo(req.body);
    responderExito(res, null, 'Contraseña restablecida correctamente');
  } catch (error) {
    next(error);
  }
};
