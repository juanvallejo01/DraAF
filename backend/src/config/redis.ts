import { Redis } from 'ioredis';
import { env } from './env';

export const opcionesRedis = {
  host: env.redis.host,
  port: env.redis.port,
  ...(env.redis.password && { password: env.redis.password }),
  maxRetriesPerRequest: null as null,
  enableReadyCheck: false,
};

export const redisCliente = new Redis(opcionesRedis);

redisCliente.on('connect', () => {
  console.log('✅ Conexión a Redis establecida correctamente');
});

redisCliente.on('error', (error) => {
  console.error('❌ Error en la conexión a Redis:', error);
});
