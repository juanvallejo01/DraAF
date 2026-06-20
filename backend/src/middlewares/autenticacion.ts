import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { PayloadJWT, RequestAutenticado, RolUsuario } from '../types';
import { responderError } from '../utils/respuesta';

export const verificarToken = (
  req: RequestAutenticado,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    responderError(res, 401, 'Token de autenticación no proporcionado');
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, env.jwtSecreto) as PayloadJWT;
    req.usuario = payload;
    next();
  } catch {
    responderError(res, 401, 'Token inválido o expirado');
  }
};

export const soloAdmin = (
  req: RequestAutenticado,
  res: Response,
  next: NextFunction
): void => {
  if (!req.usuario || req.usuario.rol !== 'ADMIN') {
    responderError(res, 403, 'Acceso restringido al administrador');
    return;
  }
  next();
};

export const soloRoles = (...roles: RolUsuario[]) => {
  return (req: RequestAutenticado, res: Response, next: NextFunction): void => {
    if (!req.usuario || !roles.includes(req.usuario.rol)) {
      responderError(res, 403, 'No tienes permisos para realizar esta acción');
      return;
    }
    next();
  };
};
