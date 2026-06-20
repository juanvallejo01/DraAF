import { Configuracion } from '../models/Configuracion';
import { ErrorPersonalizado } from '../middlewares/manejoErrores';

const DEFAULTS_HORARIOS: Record<string, string> = {
  clinica_hora_apertura: '08:00',
  clinica_hora_cierre: '18:00',
  clinica_intervalo_slot: '30',
  clinica_dias_activos: '1,2,3,4,5',
};

export const obtenerConfiguracion = async (clave: string) => {
  const config = await Configuracion.findOne({ clave });
  if (!config) throw new ErrorPersonalizado(`Configuración '${clave}' no encontrada`, 404);
  return config;
};

export const actualizarConfiguracion = async (clave: string, valor: string) => {
  return Configuracion.findOneAndUpdate(
    { clave },
    { valor },
    { upsert: true, new: true, runValidators: true }
  );
};

export const obtenerConfiguracionWhatsApp = async () => {
  const claves = [
    'whatsapp_plantilla_mensaje',
    'clinica_direccion',
    'clinica_enlace_maps',
    'clinica_whatsapp_admin',
  ];

  const configs = await Configuracion.find({ clave: { $in: claves } });

  return claves.reduce<Record<string, string>>((acc, clave) => {
    const config = configs.find((c) => c.clave === clave);
    acc[clave] = config?.valor ?? '';
    return acc;
  }, {});
};

export const obtenerConfiguracionHorarios = async () => {
  const claves = Object.keys(DEFAULTS_HORARIOS);
  const configs = await Configuracion.find({ clave: { $in: claves } });

  return claves.reduce<Record<string, string>>((acc, clave) => {
    const config = configs.find((c) => c.clave === clave);
    acc[clave] = config?.valor ?? DEFAULTS_HORARIOS[clave];
    return acc;
  }, {});
};

export const actualizarConfiguracionHorarios = async (datos: {
  horaApertura?: string;
  horaCierre?: string;
  intervaloSlot?: string;
  diasActivos?: string;
}) => {
  const mapa: Record<string, string> = {};
  if (datos.horaApertura !== undefined) mapa['clinica_hora_apertura'] = datos.horaApertura;
  if (datos.horaCierre !== undefined) mapa['clinica_hora_cierre'] = datos.horaCierre;
  if (datos.intervaloSlot !== undefined) mapa['clinica_intervalo_slot'] = datos.intervaloSlot;
  if (datos.diasActivos !== undefined) mapa['clinica_dias_activos'] = datos.diasActivos;

  await Promise.all(
    Object.entries(mapa).map(([clave, valor]) =>
      Configuracion.findOneAndUpdate(
        { clave },
        { valor, descripcion: DEFAULTS_HORARIOS[clave] ? `Horario: ${clave}` : clave },
        { upsert: true, new: true }
      )
    )
  );

  return obtenerConfiguracionHorarios();
};

export const obtenerFechasBloqueadas = async (): Promise<string[]> => {
  const config = await Configuracion.findOne({ clave: 'clinica_fechas_bloqueadas' });
  if (!config?.valor) return [];
  try { return JSON.parse(config.valor) as string[]; } catch { return []; }
};

export const agregarFechaBloqueada = async (fecha: string): Promise<string[]> => {
  const fechas = await obtenerFechasBloqueadas();
  if (!fechas.includes(fecha)) {
    fechas.push(fecha);
    fechas.sort();
  }
  await actualizarConfiguracion('clinica_fechas_bloqueadas', JSON.stringify(fechas));
  return fechas;
};

export const eliminarFechaBloqueada = async (fecha: string): Promise<string[]> => {
  const fechas = (await obtenerFechasBloqueadas()).filter((f) => f !== fecha);
  await actualizarConfiguracion('clinica_fechas_bloqueadas', JSON.stringify(fechas));
  return fechas;
};

export const obtenerPoliticaCancelacion = async (): Promise<{ horasMinimas: number }> => {
  const config = await Configuracion.findOne({ clave: 'clinica_horas_cancelacion' });
  const horasMinimas = parseInt(config?.valor ?? '24', 10);
  return { horasMinimas: isNaN(horasMinimas) ? 24 : horasMinimas };
};

export const actualizarPoliticaCancelacion = async (horasMinimas: number): Promise<{ horasMinimas: number }> => {
  await actualizarConfiguracion('clinica_horas_cancelacion', String(horasMinimas));
  return { horasMinimas };
};

export const obtenerHorasRecordatorio = async (): Promise<number> => {
  const config = await Configuracion.findOne({ clave: 'clinica_horas_recordatorio' });
  const horas = parseInt(config?.valor ?? '24', 10);
  return isNaN(horas) ? 24 : horas;
};

export const actualizarConfiguracionWhatsApp = async (datos: {
  plantillaMensaje?: string;
  direccion?: string;
  enlaceGoogleMaps?: string;
  whatsappAdmin?: string;
}) => {
  const operaciones = [];

  if (datos.plantillaMensaje !== undefined) {
    operaciones.push(
      Configuracion.findOneAndUpdate(
        { clave: 'whatsapp_plantilla_mensaje' },
        { valor: datos.plantillaMensaje, descripcion: 'Plantilla del mensaje de confirmación de WhatsApp' },
        { upsert: true, new: true }
      )
    );
  }

  if (datos.direccion !== undefined) {
    operaciones.push(
      Configuracion.findOneAndUpdate(
        { clave: 'clinica_direccion' },
        { valor: datos.direccion, descripcion: 'Dirección física de la clínica' },
        { upsert: true, new: true }
      )
    );
  }

  if (datos.enlaceGoogleMaps !== undefined) {
    operaciones.push(
      Configuracion.findOneAndUpdate(
        { clave: 'clinica_enlace_maps' },
        { valor: datos.enlaceGoogleMaps, descripcion: 'Enlace de Google Maps de la clínica' },
        { upsert: true, new: true }
      )
    );
  }

  if (datos.whatsappAdmin !== undefined) {
    operaciones.push(
      Configuracion.findOneAndUpdate(
        { clave: 'clinica_whatsapp_admin' },
        { valor: datos.whatsappAdmin, descripcion: 'WhatsApp del admin para notificaciones de nuevas citas' },
        { upsert: true, new: true }
      )
    );
  }

  await Promise.all(operaciones);
  return obtenerConfiguracionWhatsApp();
};
