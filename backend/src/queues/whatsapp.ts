import { Queue } from 'bullmq';
import { opcionesRedis } from '../config/redis';
import { DatosJobWhatsApp } from '../types';

export const NOMBRE_COLA_WHATSAPP = 'whatsapp-notificaciones';

export const colaWhatsApp = new Queue<DatosJobWhatsApp>(NOMBRE_COLA_WHATSAPP, {
  connection: opcionesRedis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 50 },
  },
});

export const encolarMensajeWhatsApp = async (datos: DatosJobWhatsApp, delayMs = 1000): Promise<void> => {
  await colaWhatsApp.add('enviar-confirmacion', datos, { delay: delayMs });
  console.log(`📨 Mensaje WhatsApp encolado para cita ${datos.citaId} (delay: ${delayMs}ms)`);
};
