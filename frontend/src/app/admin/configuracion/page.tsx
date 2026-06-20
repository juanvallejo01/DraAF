'use client';

import { useEffect, useState } from 'react';
import { HorariosClinica, RespuestaAPI } from '@/types';
import { api, ErrorAPI } from '@/lib/api';
import { Tarjeta, EncabezadoTarjeta } from '@/components/ui/Tarjeta';
import { Boton } from '@/components/ui/Boton';
import { Campo } from '@/components/ui/Campo';
import { Cargando } from '@/components/ui/Cargando';
import { useToast } from '@/contexts/ToastContext';

interface ConfigWhatsApp {
  whatsapp_plantilla_mensaje: string;
  clinica_direccion: string;
  clinica_enlace_maps: string;
  clinica_whatsapp_admin: string;
}

const DIAS_SEMANA = [
  { valor: 1, etiqueta: 'Lun' },
  { valor: 2, etiqueta: 'Mar' },
  { valor: 3, etiqueta: 'Mié' },
  { valor: 4, etiqueta: 'Jue' },
  { valor: 5, etiqueta: 'Vie' },
  { valor: 6, etiqueta: 'Sáb' },
  { valor: 0, etiqueta: 'Dom' },
];

const INTERVALOS = [
  { valor: '15', etiqueta: '15 minutos' },
  { valor: '30', etiqueta: '30 minutos' },
  { valor: '60', etiqueta: '1 hora' },
];

export default function PaginaConfiguracion() {
  const { mostrarToast } = useToast();

  const [config, setConfig] = useState<ConfigWhatsApp>({
    whatsapp_plantilla_mensaje: '',
    clinica_direccion: '',
    clinica_enlace_maps: '',
    clinica_whatsapp_admin: '',
  });

  const [horarios, setHorarios] = useState<HorariosClinica>({
    clinica_hora_apertura: '08:00',
    clinica_hora_cierre: '18:00',
    clinica_intervalo_slot: '30',
    clinica_dias_activos: '1,2,3,4,5',
  });

  const [diasSeleccionados, setDiasSeleccionados] = useState<number[]>([1, 2, 3, 4, 5]);
  const [horasCancelacion, setHorasCancelacion] = useState('24');
  const [horasRecordatorio, setHorasRecordatorio] = useState('24');
  const [fechasBloqueadas, setFechasBloqueadas] = useState<string[]>([]);
  const [nuevaFecha, setNuevaFecha] = useState('');
  const [cargando, setCargando] = useState(true);
  const [guardandoWA, setGuardandoWA] = useState(false);
  const [guardandoHorarios, setGuardandoHorarios] = useState(false);
  const [guardandoCancelacion, setGuardandoCancelacion] = useState(false);
  const [guardandoRecordatorio, setGuardandoRecordatorio] = useState(false);
  const [agregandoFecha, setAgregandoFecha] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get<RespuestaAPI<ConfigWhatsApp>>('/configuracion/whatsapp'),
      api.get<RespuestaAPI<HorariosClinica>>('/configuracion/horarios'),
      api.get<RespuestaAPI<{ horasMinimas: number }>>('/configuracion/cancelacion'),
      api.get<RespuestaAPI<{ fechas: string[] }>>('/configuracion/fechas-bloqueadas'),
      api.get<RespuestaAPI<{ horasRecordatorio: number }>>('/configuracion/recordatorio'),
    ]).then(([rWA, rH, rCan, rFechas, rRec]) => {
      if (rWA.datos) setConfig(rWA.datos);
      if (rH.datos) {
        setHorarios(rH.datos);
        const activos = rH.datos.clinica_dias_activos.split(',').map(Number);
        setDiasSeleccionados(activos);
      }
      if (rCan.datos) setHorasCancelacion(String(rCan.datos.horasMinimas));
      if (rFechas.datos) setFechasBloqueadas(rFechas.datos.fechas ?? []);
      if (rRec.datos) setHorasRecordatorio(String(rRec.datos.horasRecordatorio));
    }).finally(() => setCargando(false));
  }, []);

  const toggleDia = (dia: number) => {
    setDiasSeleccionados((prev) =>
      prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]
    );
  };

  const guardarWhatsApp = async () => {
    setGuardandoWA(true);
    try {
      await api.patch('/configuracion/whatsapp', {
        plantillaMensaje: config.whatsapp_plantilla_mensaje,
        direccion: config.clinica_direccion,
        enlaceGoogleMaps: config.clinica_enlace_maps,
        whatsappAdmin: config.clinica_whatsapp_admin,
      });
      mostrarToast('Configuración de WhatsApp guardada', 'exito');
    } catch (err) {
      mostrarToast(err instanceof ErrorAPI ? err.message : 'Error al guardar', 'error');
    } finally {
      setGuardandoWA(false);
    }
  };

  const guardarHorarios = async () => {
    if (diasSeleccionados.length === 0) {
      mostrarToast('Selecciona al menos un día laborable', 'error');
      return;
    }
    setGuardandoHorarios(true);
    try {
      await api.patch('/configuracion/horarios', {
        horaApertura: horarios.clinica_hora_apertura,
        horaCierre: horarios.clinica_hora_cierre,
        intervaloSlot: horarios.clinica_intervalo_slot,
        diasActivos: diasSeleccionados.sort((a, b) => a - b).join(','),
      });
      mostrarToast('Horarios guardados correctamente', 'exito');
    } catch (err) {
      mostrarToast(err instanceof ErrorAPI ? err.message : 'Error al guardar', 'error');
    } finally {
      setGuardandoHorarios(false);
    }
  };

  const guardarRecordatorio = async () => {
    const horas = parseInt(horasRecordatorio, 10);
    if (isNaN(horas) || horas < 0) {
      mostrarToast('Ingresa un número válido de horas (0 = sin recordatorio)', 'error');
      return;
    }
    setGuardandoRecordatorio(true);
    try {
      await api.patch('/configuracion/recordatorio', { horasRecordatorio: horas });
      mostrarToast(horas === 0 ? 'Recordatorio desactivado' : `Recordatorio configurado: ${horas}h antes`, 'exito');
    } catch (err) {
      mostrarToast(err instanceof ErrorAPI ? err.message : 'Error al guardar', 'error');
    } finally {
      setGuardandoRecordatorio(false);
    }
  };

  const guardarCancelacion = async () => {
    const horas = parseInt(horasCancelacion, 10);
    if (isNaN(horas) || horas < 0) {
      mostrarToast('Ingresa un número válido de horas (0 = sin restricción)', 'error');
      return;
    }
    setGuardandoCancelacion(true);
    try {
      await api.patch('/configuracion/cancelacion', { horasMinimas: horas });
      mostrarToast('Política de cancelación actualizada', 'exito');
    } catch (err) {
      mostrarToast(err instanceof ErrorAPI ? err.message : 'Error al guardar', 'error');
    } finally {
      setGuardandoCancelacion(false);
    }
  };

  const agregarFecha = async () => {
    if (!nuevaFecha) return;
    setAgregandoFecha(true);
    try {
      const r = await api.post<RespuestaAPI<{ fechas: string[] }>>('/configuracion/fechas-bloqueadas', { fecha: nuevaFecha });
      setFechasBloqueadas(r.datos?.fechas ?? []);
      setNuevaFecha('');
      mostrarToast('Fecha bloqueada', 'exito');
    } catch (err) {
      mostrarToast(err instanceof ErrorAPI ? err.message : 'Error al bloquear la fecha', 'error');
    } finally {
      setAgregandoFecha(false);
    }
  };

  const eliminarFecha = async (fecha: string) => {
    try {
      const r = await api.delete<RespuestaAPI<{ fechas: string[] }>>(`/configuracion/fechas-bloqueadas/${fecha}`);
      setFechasBloqueadas(r.datos?.fechas ?? []);
      mostrarToast('Fecha desbloqueada', 'exito');
    } catch (err) {
      mostrarToast(err instanceof ErrorAPI ? err.message : 'Error al desbloquear la fecha', 'error');
    }
  };

  if (cargando) return <Cargando />;

  return (
    <div>
      <div className="mb-8">
        <span className="inline-block text-[#D4AF37] text-xs font-semibold tracking-[0.3em] uppercase mb-2 bg-[#D4AF37]/8 px-3 py-1.5 rounded-full">
          Sistema
        </span>
        <h1 className="text-3xl font-light text-[#333333] mt-2">Configuración</h1>
      </div>

      <div className="max-w-2xl flex flex-col gap-6">

        {/* ── Horarios de atención ── */}
        <Tarjeta>
          <EncabezadoTarjeta
            titulo="Horarios de atención"
            descripcion="Define cuándo está disponible la clínica para reservas. Los cambios se reflejan en el formulario de citas de inmediato."
          />

          <div className="grid grid-cols-2 gap-4 mb-5">
            <Campo
              etiqueta="Hora de apertura"
              type="time"
              value={horarios.clinica_hora_apertura}
              onChange={(e) => setHorarios((p) => ({ ...p, clinica_hora_apertura: e.target.value }))}
            />
            <Campo
              etiqueta="Hora de cierre"
              type="time"
              value={horarios.clinica_hora_cierre}
              onChange={(e) => setHorarios((p) => ({ ...p, clinica_hora_cierre: e.target.value }))}
            />
          </div>

          <div className="mb-5">
            <label className="text-sm font-medium text-[#333333] block mb-1.5">Intervalo entre citas</label>
            <div className="flex gap-2">
              {INTERVALOS.map(({ valor, etiqueta }) => (
                <button
                  key={valor}
                  onClick={() => setHorarios((p) => ({ ...p, clinica_intervalo_slot: valor }))}
                  className={`px-4 py-2 rounded-xl text-sm border-2 font-medium transition-all ${
                    horarios.clinica_intervalo_slot === valor
                      ? 'border-[#D4AF37] bg-[#D4AF37]/8 text-[#D4AF37]'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  {etiqueta}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <label className="text-sm font-medium text-[#333333] block mb-2">Días laborales</label>
            <div className="flex flex-wrap gap-2">
              {DIAS_SEMANA.map(({ valor, etiqueta }) => {
                const activo = diasSeleccionados.includes(valor);
                return (
                  <button
                    key={valor}
                    onClick={() => toggleDia(valor)}
                    className={`w-12 h-10 rounded-xl text-sm border-2 font-medium transition-all ${
                      activo
                        ? 'border-[#D4AF37] bg-[#D4AF37] text-white'
                        : 'border-gray-200 text-gray-400 hover:border-gray-300'
                    }`}
                  >
                    {etiqueta}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {diasSeleccionados.length === 0
                ? 'Sin días activos — la clínica no aceptará reservas'
                : `${diasSeleccionados.length} ${diasSeleccionados.length === 1 ? 'día activo' : 'días activos'}`}
            </p>
          </div>

          <Boton variante="primario" cargando={guardandoHorarios} onClick={guardarHorarios}>
            Guardar horarios
          </Boton>
        </Tarjeta>

        {/* ── Fechas bloqueadas ── */}
        <Tarjeta>
          <EncabezadoTarjeta
            titulo="Fechas bloqueadas"
            descripcion="Bloquea días específicos (festivos, vacaciones). Los pacientes no podrán reservar en estas fechas."
          />

          <div className="flex gap-2 mb-4">
            <input
              type="date"
              value={nuevaFecha}
              onChange={(e) => setNuevaFecha(e.target.value)}
              className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:border-[#D4AF37] bg-white"
            />
            <Boton
              variante="primario"
              tamano="sm"
              cargando={agregandoFecha}
              disabled={!nuevaFecha}
              onClick={agregarFecha}
            >
              Bloquear
            </Boton>
          </div>

          {fechasBloqueadas.length === 0 ? (
            <p className="text-sm text-gray-400 py-2">Sin fechas bloqueadas actualmente</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {fechasBloqueadas.map((f) => {
                const d = new Date(f + 'T12:00:00');
                const etiqueta = d.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
                return (
                  <div key={f} className="flex items-center gap-1.5 bg-red-50 border border-red-100 rounded-xl px-3 py-1.5">
                    <span className="text-xs text-red-700 font-medium">{etiqueta}</span>
                    <button
                      onClick={() => eliminarFecha(f)}
                      className="text-red-300 hover:text-red-500 transition-colors text-xs ml-1"
                      aria-label={`Desbloquear ${f}`}
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </Tarjeta>

        {/* ── Política de cancelación ── */}
        <Tarjeta>
          <EncabezadoTarjeta
            titulo="Política de cancelación"
            descripcion="Número mínimo de horas de antelación que un paciente necesita para cancelar su cita. 0 = sin restricción."
          />
          <div className="flex items-end gap-4">
            <div className="w-36">
              <label className="text-sm font-medium text-[#333333] block mb-1.5">Horas de antelación</label>
              <input
                type="number"
                min="0"
                max="168"
                value={horasCancelacion}
                onChange={(e) => setHorasCancelacion(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <Boton variante="primario" cargando={guardandoCancelacion} onClick={guardarCancelacion}>
              Guardar política
            </Boton>
          </div>
          {horasCancelacion !== '0' && (
            <p className="text-xs text-gray-400 mt-3">
              Los pacientes no podrán cancelar dentro de las <strong>{horasCancelacion} horas</strong> previas a su cita.
            </p>
          )}
        </Tarjeta>

        {/* ── Recordatorio automático ── */}
        <Tarjeta>
          <EncabezadoTarjeta
            titulo="Recordatorio automático"
            descripcion="Se envía un mensaje de WhatsApp al paciente este número de horas antes de su cita. 0 = sin recordatorio."
          />
          <div className="flex items-end gap-4">
            <div className="w-36">
              <label className="text-sm font-medium text-[#333333] block mb-1.5">Horas antes</label>
              <input
                type="number"
                min="0"
                max="168"
                value={horasRecordatorio}
                onChange={(e) => setHorasRecordatorio(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <Boton variante="primario" cargando={guardandoRecordatorio} onClick={guardarRecordatorio}>
              Guardar recordatorio
            </Boton>
          </div>
          {horasRecordatorio !== '0' && (
            <p className="text-xs text-gray-400 mt-3">
              El paciente recibirá un recordatorio <strong>{horasRecordatorio} horas antes</strong> de su cita confirmada.
            </p>
          )}
        </Tarjeta>

        {/* ── WhatsApp ── */}
        <Tarjeta>
          <EncabezadoTarjeta
            titulo="Mensaje de confirmación WhatsApp"
            descripcion="Usa {{nombrePaciente}}, {{nombreTratamiento}}, {{fecha}}, {{hora}}, {{direccion}}, {{enlaceGoogleMaps}} como variables dinámicas."
          />
          <div>
            <label className="text-sm font-medium text-[#333333] block mb-1.5">Plantilla del mensaje</label>
            <textarea
              value={config.whatsapp_plantilla_mensaje}
              onChange={(e) => setConfig((p) => ({ ...p, whatsapp_plantilla_mensaje: e.target.value }))}
              rows={10}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-mono focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 resize-y"
              placeholder="Hola, {{nombrePaciente}}. Tu cita para {{nombreTratamiento}}..."
            />
          </div>
        </Tarjeta>

        <Tarjeta>
          <EncabezadoTarjeta
            titulo="Datos de la clínica"
            descripcion="Información de contacto y notificaciones."
          />
          <div className="flex flex-col gap-4">
            <Campo
              etiqueta="Dirección de la clínica"
              type="text"
              value={config.clinica_direccion}
              onChange={(e) => setConfig((p) => ({ ...p, clinica_direccion: e.target.value }))}
              placeholder="Calle 10 #5-20, Cali, Colombia"
            />
            <Campo
              etiqueta="Enlace de Google Maps"
              type="url"
              value={config.clinica_enlace_maps}
              onChange={(e) => setConfig((p) => ({ ...p, clinica_enlace_maps: e.target.value }))}
              placeholder="https://maps.google.com/..."
            />
            <Campo
              etiqueta="WhatsApp del admin (notificaciones de nuevas citas)"
              type="text"
              value={config.clinica_whatsapp_admin}
              onChange={(e) => setConfig((p) => ({ ...p, clinica_whatsapp_admin: e.target.value }))}
              placeholder="+573001234567"
            />
          </div>
        </Tarjeta>

        <Boton variante="primario" tamano="lg" cargando={guardandoWA} onClick={guardarWhatsApp}>
          Guardar configuración WhatsApp
        </Boton>
      </div>
    </div>
  );
}
