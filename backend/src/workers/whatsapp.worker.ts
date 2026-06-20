import { Worker, Job } from 'bullmq';
import { opcionesRedis } from '../config/redis';
import { DatosJobWhatsApp } from '../types';
import { NOMBRE_COLA_WHATSAPP } from '../queues/whatsapp';
import { construirMensajeWhatsApp, enviarMensajeWhatsApp } from '../services/whatsapp.service';
import { Cita } from '../models/Cita';

const procesarJobWhatsApp = async (job: Job<DatosJobWhatsApp>): Promise<void> => {
  const {
    citaId,
    numeroWhatsApp,
    nombrePaciente,
    nombreTratamiento,
    fecha,
    hora,
    mensajeDirecto,
    actualizarCita = true,
    verificarCitaConfirmada = false,
  } = job.data;

  console.log(`🔄 Procesando job WhatsApp para cita ${citaId} — intento ${job.attemptsMade + 1}`);

  if (verificarCitaConfirmada) {
    const citaActual = await Cita.findById(citaId).select('estado');
    if (!citaActual || citaActual.estado !== 'CONFIRMADA') {
      console.log(`⏭ Recordatorio omitido: cita ${citaId} ya no está CONFIRMADA (estado: ${citaActual?.estado ?? 'no encontrada'})`);
      return;
    }
  }

  const mensaje = mensajeDirecto
    ? mensajeDirecto
    : await construirMensajeWhatsApp({
        nombrePaciente,
        nombreTratamiento,
        fecha: new Date(fecha),
        horaInicio: hora,
      });

  await enviarMensajeWhatsApp(numeroWhatsApp, mensaje);

  if (actualizarCita) {
    await Cita.findByIdAndUpdate(citaId, { mensajeWhatsAppEnviado: true });
  }

  console.log(`✅ Mensaje WhatsApp enviado correctamente para cita ${citaId}`);
};

export const iniciarWorkerWhatsApp = (): Worker<DatosJobWhatsApp> => {
  const worker = new Worker<DatosJobWhatsApp>(
    NOMBRE_COLA_WHATSAPP,
    procesarJobWhatsApp,
    {
      connection: opcionesRedis,
      concurrency: 5,
    }
  );

  worker.on('completed', (job) => {
    console.log(`✅ Job ${job.id} completado`);
  });

  worker.on('failed', (job, error) => {
    console.error(`❌ Job ${job?.id} fallido:`, error.message);
  });

  console.log('🚀 Worker de WhatsApp iniciado');
  return worker;
};
