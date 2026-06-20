import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const requerido = (nombre: string): string => {
  const valor = process.env[nombre];
  if (!valor) throw new Error(`Variable de entorno requerida no definida: ${nombre}`);
  return valor;
};

const opcional = (nombre: string, valorPorDefecto: string): string => {
  return process.env[nombre] ?? valorPorDefecto;
};

export const env = {
  puerto: parseInt(opcional('PORT', '4000'), 10),
  entorno: opcional('NODE_ENV', 'development'),
  mongoUri: requerido('MONGODB_URI'),
  jwtSecreto: requerido('JWT_SECRET'),
  jwtExpiracion: opcional('JWT_EXPIRES_IN', '7d'),
  redis: {
    host: opcional('REDIS_HOST', 'localhost'),
    port: parseInt(opcional('REDIS_PORT', '6379'), 10),
    password: opcional('REDIS_PASSWORD', ''),
  },
  whatsapp: {
    apiUrl: opcional('WHATSAPP_API_URL', 'https://graph.facebook.com/v19.0'),
    phoneNumberId: opcional('WHATSAPP_PHONE_NUMBER_ID', ''),
    accessToken: opcional('WHATSAPP_ACCESS_TOKEN', ''),
    verifyToken: opcional('WHATSAPP_VERIFY_TOKEN', 'draaf_verify_token'),
    appSecret: opcional('WHATSAPP_APP_SECRET', ''),
  },
  frontendUrl: opcional('FRONTEND_URL', 'http://localhost:3000'),
} as const;
