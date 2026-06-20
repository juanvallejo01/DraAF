import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { PayloadJWT } from '../types';

export const generarToken = (payload: Omit<PayloadJWT, 'iat' | 'exp'>): string => {
  return jwt.sign(payload, env.jwtSecreto, {
    expiresIn: env.jwtExpiracion as jwt.SignOptions['expiresIn'],
  });
};

export const verificarToken = (token: string): PayloadJWT => {
  return jwt.verify(token, env.jwtSecreto) as PayloadJWT;
};
