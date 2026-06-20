import axios from 'axios';
import { env } from '../config/env';
import { Configuracion } from '../models/Configuracion';
import { formatearFecha, formatearHora } from '../utils/fecha';

const CLAVES_CONFIG = {
  plantillaMensaje: 'whatsapp_plantilla_mensaje',
  direccion: 'clinica_direccion',
  enlaceGoogleMaps: 'clinica_enlace_maps',
};

const PLANTILLA_DEFECTO = `Hola, {{nombrePaciente}}.

Tu cita para {{nombreTratamiento}} ha sido confirmada.

Fecha: {{fecha}}.

Hora: {{hora}}.

Te esperamos 15 minutos antes de tu cita para realizar el proceso de ingreso.

Ubicación:
{{enlaceGoogleMaps}}

{{direccion}}

Te esperamos.`;

export const construirMensajeWhatsApp = async (datos: {
  nombrePaciente: string;
  nombreTratamiento: string;
  fecha: Date;
  horaInicio: string;
}): Promise<string> => {
  const [configPlantilla, configDireccion, configMaps] = await Promise.all([
    Configuracion.findOne({ clave: CLAVES_CONFIG.plantillaMensaje }),
    Configuracion.findOne({ clave: CLAVES_CONFIG.direccion }),
    Configuracion.findOne({ clave: CLAVES_CONFIG.enlaceGoogleMaps }),
  ]);

  const plantilla = configPlantilla?.valor ?? PLANTILLA_DEFECTO;
  const direccion = configDireccion?.valor ?? 'Consulta con el administrador la dirección';
  const enlaceMaps = configMaps?.valor ?? '#';

  return plantilla
    .replace(/{{nombrePaciente}}/g, datos.nombrePaciente)
    .replace(/{{nombreTratamiento}}/g, datos.nombreTratamiento)
    .replace(/{{fecha}}/g, formatearFecha(datos.fecha))
    .replace(/{{hora}}/g, formatearHora(datos.horaInicio))
    .replace(/{{direccion}}/g, direccion)
    .replace(/{{enlaceGoogleMaps}}/g, enlaceMaps);
};

export const enviarMensajeWhatsApp = async (
  numeroDestino: string,
  mensaje: string
): Promise<void> => {
  if (!env.whatsapp.phoneNumberId || !env.whatsapp.accessToken) {
    console.warn('⚠️  WhatsApp no configurado. Mensaje simulado:\n', mensaje);
    return;
  }

  const url = `${env.whatsapp.apiUrl}/${env.whatsapp.phoneNumberId}/messages`;

  await axios.post(
    url,
    {
      messaging_product: 'whatsapp',
      to: numeroDestino,
      type: 'text',
      text: { body: mensaje },
    },
    {
      headers: {
        Authorization: `Bearer ${env.whatsapp.accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );
};
