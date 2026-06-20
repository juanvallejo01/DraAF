import { Types } from 'mongoose';
import { Cita } from '../models/Cita';
import { Tratamiento } from '../models/Tratamiento';
import { Usuario } from '../models/Usuario';
import { ErrorPersonalizado } from '../middlewares/manejoErrores';
import { encolarMensajeWhatsApp } from '../queues/whatsapp';
import { DatosCrearCita, DatosActualizarEstadoCita, DatosCrearCitaAdmin } from '../validations/cita';
import { obtenerConfiguracionHorarios, obtenerFechasBloqueadas, obtenerConfiguracion, obtenerHorasRecordatorio } from './configuracion.service';

const calcularHoraFin = (horaInicio: string, duracionMinutos: number): string => {
  const [horas, minutos] = horaInicio.split(':').map(Number);
  const totalMinutos = horas * 60 + minutos + duracionMinutos;
  const horasFin = Math.floor(totalMinutos / 60) % 24;
  const minutosFin = totalMinutos % 60;
  return `${String(horasFin).padStart(2, '0')}:${String(minutosFin).padStart(2, '0')}`;
};

export const crearCita = async (pacienteId: string, datos: DatosCrearCita) => {
  const tratamiento = await Tratamiento.findById(datos.tratamiento);
  if (!tratamiento || !tratamiento.activo) {
    throw new ErrorPersonalizado('Tratamiento no encontrado o no disponible', 404);
  }

  const fechasBloqueadas = await obtenerFechasBloqueadas();
  if (fechasBloqueadas.includes(datos.fecha)) {
    throw new ErrorPersonalizado('Esta fecha no está disponible. Selecciona otra fecha.', 400);
  }

  const fechaCita = new Date(datos.fecha);
  const horaFin = calcularHoraFin(datos.horaInicio, tratamiento.duracionMinutos);

  const conflicto = await Cita.findOne({
    fecha: fechaCita,
    estado: { $nin: ['CANCELADA'] },
    $or: [
      { horaInicio: { $lt: horaFin }, horaFin: { $gt: datos.horaInicio } },
    ],
  });

  if (conflicto) {
    throw new ErrorPersonalizado('El horario seleccionado no está disponible', 409);
  }

  const cita = await Cita.create({
    paciente: new Types.ObjectId(pacienteId),
    tratamiento: new Types.ObjectId(datos.tratamiento),
    fecha: fechaCita,
    horaInicio: datos.horaInicio,
    horaFin,
    notasPaciente: datos.notasPaciente,
    estado: 'PENDIENTE',
    historialEstados: [{ estado: 'PENDIENTE', fecha: new Date() }],
  });

  const citaPopulada = await cita.populate(['paciente', 'tratamiento']);

  try {
    const adminConfig = await obtenerConfiguracion('clinica_whatsapp_admin').catch(() => null);
    if (adminConfig?.valor) {
      const fechaLegible = new Date(datos.fecha + 'T12:00:00').toLocaleDateString('es-CO', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      });
      const pacienteInfo = citaPopulada.paciente as unknown as { nombreCompleto: string };
      await encolarMensajeWhatsApp({
        citaId: citaPopulada._id,
        numeroWhatsApp: adminConfig.valor,
        nombrePaciente: '',
        nombreTratamiento: '',
        fecha: datos.fecha,
        hora: datos.horaInicio,
        mensajeDirecto: `🔔 *Nueva cita reservada*\n\nPaciente: ${pacienteInfo.nombreCompleto}\nTratamiento: ${tratamiento.nombre}\nFecha: ${fechaLegible}\nHora: ${datos.horaInicio}\n\n👉 Ingresa al panel para confirmarla.`,
        actualizarCita: false,
      });
    }
  } catch {
    // No interrumpir la reserva si falla la notificación al admin
  }

  return citaPopulada;
};

export const crearCitaAdmin = async (datos: DatosCrearCitaAdmin) => {
  const [tratamiento, paciente] = await Promise.all([
    Tratamiento.findById(datos.tratamiento),
    Usuario.findById(datos.pacienteId),
  ]);

  if (!tratamiento || !tratamiento.activo) {
    throw new ErrorPersonalizado('Tratamiento no encontrado o no disponible', 404);
  }
  if (!paciente || paciente.rol !== 'PACIENTE') {
    throw new ErrorPersonalizado('Paciente no encontrado', 404);
  }

  const fechasBloqueadas = await obtenerFechasBloqueadas();
  if (fechasBloqueadas.includes(datos.fecha)) {
    throw new ErrorPersonalizado('Esta fecha no está disponible', 400);
  }

  const horaFin = calcularHoraFin(datos.horaInicio, tratamiento.duracionMinutos);
  const fechaCita = new Date(datos.fecha);

  const conflicto = await Cita.findOne({
    fecha: fechaCita,
    estado: { $nin: ['CANCELADA'] },
    $or: [{ horaInicio: { $lt: horaFin }, horaFin: { $gt: datos.horaInicio } }],
  });

  if (conflicto) {
    throw new ErrorPersonalizado('El horario seleccionado no está disponible', 409);
  }

  const estadoInicial = datos.confirmarInmediatamente ? 'CONFIRMADA' : 'PENDIENTE';

  const cita = await Cita.create({
    paciente: new Types.ObjectId(datos.pacienteId),
    tratamiento: new Types.ObjectId(datos.tratamiento),
    fecha: fechaCita,
    horaInicio: datos.horaInicio,
    horaFin,
    notasPaciente: datos.notasPaciente,
    estado: estadoInicial,
    historialEstados: [{ estado: estadoInicial, fecha: new Date() }],
  });

  const citaPopulada = await cita.populate(['paciente', 'tratamiento']);

  if (datos.confirmarInmediatamente) {
    try {
      await encolarMensajeWhatsApp({
        citaId: citaPopulada._id,
        numeroWhatsApp: paciente.numeroWhatsApp,
        nombrePaciente: paciente.nombreCompleto,
        nombreTratamiento: tratamiento.nombre,
        fecha: fechaCita.toISOString(),
        hora: datos.horaInicio,
      });
    } catch {
      // No fallar si WhatsApp falla
    }
  }

  return citaPopulada;
};

export const actualizarEstadoCita = async (
  citaId: string,
  datos: DatosActualizarEstadoCita
) => {
  const cita = await Cita.findById(citaId)
    .populate<{ paciente: { nombreCompleto: string; numeroWhatsApp: string } }>('paciente', 'nombreCompleto numeroWhatsApp')
    .populate<{ tratamiento: { nombre: string } }>('tratamiento', 'nombre');

  if (!cita) throw new ErrorPersonalizado('Cita no encontrada', 404);

  const estadoAnterior = cita.estado;
  if (estadoAnterior !== datos.estado) {
    cita.estado = datos.estado;
    cita.historialEstados = cita.historialEstados || [];
    cita.historialEstados.push({ estado: datos.estado, fecha: new Date() });
  }
  if (datos.notasAdmin) cita.notasAdmin = datos.notasAdmin;
  await cita.save();

  if (estadoAnterior !== 'CONFIRMADA' && datos.estado === 'CONFIRMADA') {
    const paciente = cita.paciente as unknown as { nombreCompleto: string; numeroWhatsApp: string };
    const tratamiento = cita.tratamiento as unknown as { nombre: string };

    await encolarMensajeWhatsApp({
      citaId: cita._id,
      numeroWhatsApp: paciente.numeroWhatsApp,
      nombrePaciente: paciente.nombreCompleto,
      nombreTratamiento: tratamiento.nombre,
      fecha: cita.fecha.toISOString(),
      hora: cita.horaInicio,
    });

    // Programar recordatorio con delay hasta (fechaCita - horasRecordatorio)
    try {
      const horasRecordatorio = await obtenerHorasRecordatorio();
      if (horasRecordatorio > 0) {
        const ahora = new Date();
        const fechaCitaDateTime = new Date(cita.fecha);
        const [h, m] = cita.horaInicio.split(':').map(Number);
        fechaCitaDateTime.setHours(h, m, 0, 0);

        const msHastaRecordatorio = fechaCitaDateTime.getTime() - ahora.getTime() - horasRecordatorio * 3600000;

        if (msHastaRecordatorio > 0) {
          const fechaLegible = fechaCitaDateTime.toLocaleDateString('es-CO', {
            weekday: 'long', day: 'numeric', month: 'long',
          });
          await encolarMensajeWhatsApp({
            citaId: cita._id,
            numeroWhatsApp: paciente.numeroWhatsApp,
            nombrePaciente: paciente.nombreCompleto,
            nombreTratamiento: tratamiento.nombre,
            fecha: cita.fecha.toISOString(),
            hora: cita.horaInicio,
            mensajeDirecto: `⏰ *Recordatorio de tu cita*\n\n¡Hola, ${paciente.nombreCompleto}! Te recordamos que tienes:\n\n✨ *${tratamiento.nombre}*\n📅 ${fechaLegible}\n🕐 ${cita.horaInicio}\n\nTe esperamos *15 minutos antes*.\n\n¡Hasta pronto! 🌟`,
            actualizarCita: false,
            verificarCitaConfirmada: true,
          }, msHastaRecordatorio);
        }
      }
    } catch {
      // No fallar la confirmación si el recordatorio falla
    }
  }

  return cita;
};

export const listarCitasPaciente = async (pacienteId: string) => {
  return Cita.find({ paciente: pacienteId })
    .populate('tratamiento', 'nombre duracionMinutos imagen')
    .sort({ fecha: -1, horaInicio: -1 });
};

export const listarTodasLasCitas = async (filtros: {
  fecha?: string;
  estado?: string;
  pacienteId?: string;
  pagina?: number;
  limite?: number;
}) => {
  const query: Record<string, unknown> = {};

  if (filtros.fecha) {
    const fechaInicio = new Date(filtros.fecha);
    const fechaFin = new Date(filtros.fecha);
    fechaFin.setDate(fechaFin.getDate() + 1);
    query['fecha'] = { $gte: fechaInicio, $lt: fechaFin };
  }

  if (filtros.estado) query['estado'] = filtros.estado;
  if (filtros.pacienteId) query['paciente'] = filtros.pacienteId;

  const limite = Math.min(filtros.limite ?? 20, 100);
  const pagina = Math.max(filtros.pagina ?? 1, 1);
  const skip = (pagina - 1) * limite;

  const [citas, total] = await Promise.all([
    Cita.find(query)
      .populate('paciente', 'nombreCompleto correoElectronico numeroWhatsApp documentoIdentidad')
      .populate('tratamiento', 'nombre duracionMinutos')
      .sort({ fecha: 1, horaInicio: 1 })
      .skip(skip)
      .limit(limite),
    Cita.countDocuments(query),
  ]);

  return {
    citas,
    total,
    pagina,
    limite,
    paginas: Math.ceil(total / limite),
    hayMas: skip + citas.length < total,
  };
};

export const obtenerCita = async (citaId: string) => {
  const cita = await Cita.findById(citaId)
    .populate('paciente', 'nombreCompleto correoElectronico numeroWhatsApp documentoIdentidad')
    .populate('tratamiento', 'nombre duracionMinutos descripcion');
  if (!cita) throw new ErrorPersonalizado('Cita no encontrada', 404);
  return cita;
};

export const actualizarNotasAdmin = async (citaId: string, notasAdmin: string) => {
  const cita = await Cita.findByIdAndUpdate(
    citaId,
    { notasAdmin },
    { new: true }
  ).populate('paciente', 'nombreCompleto').populate('tratamiento', 'nombre');
  if (!cita) throw new ErrorPersonalizado('Cita no encontrada', 404);
  return cita;
};

export const contarCitasPendientes = async () => {
  return Cita.countDocuments({ estado: 'PENDIENTE' });
};

export const cancelarCita = async (citaId: string, pacienteId: string) => {
  const cita = await Cita.findOne({ _id: citaId, paciente: pacienteId });
  if (!cita) throw new ErrorPersonalizado('Cita no encontrada', 404);

  if (['CANCELADA', 'COMPLETADA', 'NO_ASISTIO'].includes(cita.estado)) {
    throw new ErrorPersonalizado('No es posible cancelar una cita en este estado', 400);
  }

  const configHoras = await obtenerConfiguracion('clinica_horas_cancelacion').catch(() => null);
  const horasMinimas = parseInt(configHoras?.valor ?? '24', 10);

  if (!isNaN(horasMinimas) && horasMinimas > 0) {
    const ahora = new Date();
    const fechaCita = new Date(cita.fecha);
    const [h, m] = cita.horaInicio.split(':').map(Number);
    fechaCita.setHours(h, m, 0, 0);

    const diferenciaHoras = (fechaCita.getTime() - ahora.getTime()) / (1000 * 60 * 60);

    if (diferenciaHoras < horasMinimas) {
      throw new ErrorPersonalizado(
        `No es posible cancelar con menos de ${horasMinimas} horas de antelación. Contáctanos directamente para casos urgentes.`,
        400
      );
    }
  }

  cita.estado = 'CANCELADA';
  cita.historialEstados = cita.historialEstados || [];
  cita.historialEstados.push({ estado: 'CANCELADA', fecha: new Date() });
  return cita.save();
};

export const obtenerDisponibilidad = async (fecha: string, tratamientoId: string) => {
  const tratamiento = await Tratamiento.findById(tratamientoId);
  if (!tratamiento) throw new ErrorPersonalizado('Tratamiento no encontrado', 404);

  const horarios = await obtenerConfiguracionHorarios();
  const [hAp, mAp] = (horarios.clinica_hora_apertura ?? '08:00').split(':').map(Number);
  const [hCi, mCi] = (horarios.clinica_hora_cierre ?? '18:00').split(':').map(Number);
  const intervaloSlot = parseInt(horarios.clinica_intervalo_slot ?? '30', 10);
  const diasActivos = (horarios.clinica_dias_activos ?? '1,2,3,4,5').split(',').map(Number);

  const HORA_APERTURA = hAp * 60 + mAp;
  const HORA_CIERRE = hCi * 60 + mCi;

  const fechaBuscada = new Date(fecha + 'T12:00:00');
  const diaSemana = fechaBuscada.getDay();

  if (!diasActivos.includes(diaSemana)) {
    return { fecha, tratamientoId, duracionMinutos: tratamiento.duracionMinutos, horariosDisponibles: [], diasActivos };
  }

  const fechasBloqueadas = await obtenerFechasBloqueadas();
  if (fechasBloqueadas.includes(fecha)) {
    return { fecha, tratamientoId, duracionMinutos: tratamiento.duracionMinutos, horariosDisponibles: [], diasActivos, fechasBloqueadas };
  }

  const inicioDia = new Date(fecha + 'T00:00:00');
  const finDia = new Date(fecha + 'T23:59:59');

  const citasDelDia = await Cita.find({
    fecha: { $gte: inicioDia, $lt: finDia },
    estado: { $nin: ['CANCELADA'] },
  }).select('horaInicio horaFin');

  const horariosOcupados = citasDelDia.map((c) => ({
    inicio: c.horaInicio,
    fin: c.horaFin,
  }));

  const horariosDisponibles: string[] = [];
  const duracion = tratamiento.duracionMinutos;

  for (let minutos = HORA_APERTURA; minutos + duracion <= HORA_CIERRE; minutos += intervaloSlot) {
    const horaInicio = `${String(Math.floor(minutos / 60)).padStart(2, '0')}:${String(minutos % 60).padStart(2, '0')}`;
    const horaFin = calcularHoraFin(horaInicio, duracion);

    const hayConflicto = horariosOcupados.some(
      (ocupado) => horaInicio < ocupado.fin && horaFin > ocupado.inicio
    );

    if (!hayConflicto) horariosDisponibles.push(horaInicio);
  }

  return { fecha, tratamientoId, duracionMinutos: duracion, horariosDisponibles, diasActivos };
};

export const obtenerEstadisticasDashboard = async () => {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const manana = new Date(hoy);
  manana.setDate(manana.getDate() + 1);

  // Actividad de los últimos 7 días
  const hace7dias = new Date(hoy);
  hace7dias.setDate(hoy.getDate() - 6);

  const [totalPacientes, citasHoy, citasPendientes, citasConfirmadas, totalCitas, citasSemana] =
    await Promise.all([
      Usuario.countDocuments({ rol: 'PACIENTE', activo: true }),
      Cita.countDocuments({ fecha: { $gte: hoy, $lt: manana } }),
      Cita.countDocuments({ estado: 'PENDIENTE' }),
      Cita.countDocuments({ estado: 'CONFIRMADA', fecha: { $gte: hoy, $lt: manana } }),
      Cita.countDocuments(),
      Cita.find({
        fecha: { $gte: hace7dias, $lt: manana },
        estado: { $nin: ['CANCELADA'] },
      }).select('fecha estado'),
    ]);

  // Agrupar por día
  const DIAS_ES = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'];
  const actividadSemanal = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(hace7dias);
    d.setDate(hace7dias.getDate() + i);
    const clave = d.toISOString().split('T')[0];
    const citasDelDia = citasSemana.filter(
      (c) => c.fecha.toISOString().split('T')[0] === clave
    );
    return {
      dia: DIAS_ES[d.getDay()],
      fecha: clave,
      total: citasDelDia.length,
      confirmadas: citasDelDia.filter((c) => c.estado === 'CONFIRMADA').length,
    };
  });

  return {
    totalPacientes,
    citasHoy,
    citasPendientes,
    citasConfirmadas,
    totalCitas,
    actividadSemanal,
  };
};

export const obtenerResumenMes = async (year: number, month: number) => {
  const inicio = new Date(year, month - 1, 1);
  const fin = new Date(year, month, 0, 23, 59, 59, 999);

  const citas = await Cita.find({
    fecha: { $gte: inicio, $lte: fin },
  }).select('fecha estado');

  const resumen: Record<string, { total: number; pendientes: number; confirmadas: number; canceladas: number; completadas: number; noAsistio: number }> = {};

  citas.forEach((cita) => {
    const clave = cita.fecha.toISOString().split('T')[0];
    if (!resumen[clave]) {
      resumen[clave] = { total: 0, pendientes: 0, confirmadas: 0, canceladas: 0, completadas: 0, noAsistio: 0 };
    }
    resumen[clave].total++;
    if (cita.estado === 'PENDIENTE') resumen[clave].pendientes++;
    else if (cita.estado === 'CONFIRMADA') resumen[clave].confirmadas++;
    else if (cita.estado === 'CANCELADA') resumen[clave].canceladas++;
    else if (cita.estado === 'COMPLETADA') resumen[clave].completadas++;
    else if (cita.estado === 'NO_ASISTIO') resumen[clave].noAsistio++;
  });

  return resumen;
};
