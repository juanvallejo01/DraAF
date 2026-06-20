'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tratamiento, HorariosClinica, DisponibilidadResponse, RespuestaAPI } from '@/types';
import { api, ErrorAPI } from '@/lib/api';
import { fechaHoyISO, formatearFecha, formatearHora } from '@/lib/fecha';
import { Tarjeta, EncabezadoTarjeta } from '@/components/ui/Tarjeta';
import { Boton } from '@/components/ui/Boton';
import { Cargando } from '@/components/ui/Cargando';
import { CalendarioPicker } from '@/components/ui/CalendarioPicker';
import { useToast } from '@/contexts/ToastContext';
import { cn } from '@/lib/utils';

interface PacienteOpcion {
  _id: string;
  nombreCompleto: string;
  correoElectronico: string;
  numeroWhatsApp: string;
  activo: boolean;
}

export default function PaginaNuevaCitaAdmin() {
  const router = useRouter();
  const { mostrarToast } = useToast();

  const [pacientes, setPacientes] = useState<PacienteOpcion[]>([]);
  const [tratamientos, setTratamientos] = useState<Tratamiento[]>([]);
  const [diasCerrados, setDiasCerrados] = useState<number[]>([0, 6]);
  const [fechasBloqueadas, setFechasBloqueadas] = useState<string[]>([]);
  const [cargando, setCargando] = useState(true);

  const [busquedaPaciente, setBusquedaPaciente] = useState('');
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<PacienteOpcion | null>(null);
  const [tratamientoSeleccionado, setTratamientoSeleccionado] = useState<Tratamiento | null>(null);
  const [fecha, setFecha] = useState(fechaHoyISO());
  const [disponibilidad, setDisponibilidad] = useState<DisponibilidadResponse | null>(null);
  const [cargandoSlots, setCargandoSlots] = useState(false);
  const [horaSeleccionada, setHoraSeleccionada] = useState('');
  const [notas, setNotas] = useState('');
  const [confirmarInmediatamente, setConfirmarInmediatamente] = useState(true);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    const TODOS = [0, 1, 2, 3, 4, 5, 6];
    Promise.all([
      api.get<RespuestaAPI<PacienteOpcion[]>>('/auth/admin/pacientes'),
      api.get<RespuestaAPI<Tratamiento[]>>('/tratamientos'),
      api.get<RespuestaAPI<HorariosClinica>>('/configuracion/horarios'),
      api.get<RespuestaAPI<{ fechas: string[] }>>('/configuracion/fechas-bloqueadas'),
    ]).then(([rP, rT, rH, rF]) => {
      setPacientes(rP.datos ?? []);
      setTratamientos(rT.datos ?? []);
      if (rH.datos?.clinica_dias_activos) {
        const activos = rH.datos.clinica_dias_activos.split(',').map(Number);
        setDiasCerrados(TODOS.filter((d) => !activos.includes(d)));
      }
      setFechasBloqueadas(rF.datos?.fechas ?? []);
    }).finally(() => setCargando(false));
  }, []);

  useEffect(() => {
    if (!tratamientoSeleccionado) return;
    setCargandoSlots(true);
    setHoraSeleccionada('');
    api.get<RespuestaAPI<DisponibilidadResponse>>(
      `/citas/disponibilidad?fecha=${fecha}&tratamiento=${tratamientoSeleccionado._id}`
    )
      .then((r) => setDisponibilidad(r.datos ?? null))
      .finally(() => setCargandoSlots(false));
  }, [tratamientoSeleccionado, fecha]);

  const pacientesFiltrados = pacientes.filter(
    (p) =>
      p.activo &&
      (p.nombreCompleto.toLowerCase().includes(busquedaPaciente.toLowerCase()) ||
        p.correoElectronico.toLowerCase().includes(busquedaPaciente.toLowerCase()))
  );

  const crearCita = async () => {
    if (!pacienteSeleccionado || !tratamientoSeleccionado || !horaSeleccionada) return;
    setEnviando(true);
    try {
      await api.post('/citas/admin', {
        pacienteId: pacienteSeleccionado._id,
        tratamiento: tratamientoSeleccionado._id,
        fecha,
        horaInicio: horaSeleccionada,
        notasPaciente: notas || undefined,
        confirmarInmediatamente,
      });
      mostrarToast('Cita creada correctamente', 'exito');
      router.push('/admin/citas');
    } catch (err) {
      mostrarToast(err instanceof ErrorAPI ? err.message : 'Error al crear la cita', 'error');
    } finally {
      setEnviando(false);
    }
  };

  if (cargando) return <Cargando mensaje="Cargando datos..." />;

  const listo = pacienteSeleccionado && tratamientoSeleccionado && horaSeleccionada;

  return (
    <div className="max-w-3xl">
      {/* Encabezado */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => router.push('/admin/citas')}
          className="text-sm text-gray-400 hover:text-[#333333] transition-colors"
        >
          ← Citas
        </button>
        <span className="text-gray-200">/</span>
        <div>
          <span className="inline-block text-[#D4AF37] text-xs font-semibold tracking-[0.3em] uppercase bg-[#D4AF37]/8 px-3 py-1 rounded-full">
            Nueva cita
          </span>
        </div>
      </div>
      <h1 className="text-3xl font-light text-[#333333] mb-8">Crear cita manual</h1>

      <div className="flex flex-col gap-5">

        {/* ── 1. Paciente ── */}
        <Tarjeta>
          <EncabezadoTarjeta
            titulo="1. Paciente"
            descripcion="Busca y selecciona al paciente."
          />
          {pacienteSeleccionado ? (
            <div className="flex items-center justify-between gap-3 bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-2xl px-4 py-3">
              <div>
                <p className="font-semibold text-sm text-[#333333]">{pacienteSeleccionado.nombreCompleto}</p>
                <p className="text-xs text-gray-400">{pacienteSeleccionado.correoElectronico} · {pacienteSeleccionado.numeroWhatsApp}</p>
              </div>
              <button
                onClick={() => { setPacienteSeleccionado(null); setBusquedaPaciente(''); }}
                className="text-xs text-gray-400 hover:text-[#333333] transition-colors shrink-0"
              >
                Cambiar
              </button>
            </div>
          ) : (
            <div>
              <input
                type="search"
                value={busquedaPaciente}
                onChange={(e) => setBusquedaPaciente(e.target.value)}
                placeholder="Buscar por nombre o correo..."
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37] mb-3"
                autoComplete="off"
              />
              {busquedaPaciente.length > 0 && (
                <div className="max-h-52 overflow-y-auto flex flex-col gap-1 border border-gray-100 rounded-2xl p-2">
                  {pacientesFiltrados.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">Sin resultados</p>
                  ) : (
                    pacientesFiltrados.slice(0, 8).map((p) => (
                      <button
                        key={p._id}
                        onClick={() => { setPacienteSeleccionado(p); setBusquedaPaciente(''); }}
                        className="text-left px-4 py-2.5 rounded-xl hover:bg-[#D4AF37]/8 transition-colors"
                      >
                        <p className="text-sm font-medium text-[#333333]">{p.nombreCompleto}</p>
                        <p className="text-xs text-gray-400">{p.correoElectronico}</p>
                      </button>
                    ))
                  )}
                </div>
              )}
              {busquedaPaciente.length === 0 && (
                <p className="text-xs text-gray-400">
                  {pacientes.filter((p) => p.activo).length} pacientes activos disponibles
                </p>
              )}
            </div>
          )}
        </Tarjeta>

        {/* ── 2. Tratamiento ── */}
        <Tarjeta>
          <EncabezadoTarjeta titulo="2. Tratamiento" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {tratamientos.map((t) => (
              <button
                key={t._id}
                onClick={() => { setTratamientoSeleccionado(t); setHoraSeleccionada(''); }}
                className={cn(
                  'text-left p-4 rounded-2xl border-2 transition-all',
                  tratamientoSeleccionado?._id === t._id
                    ? 'border-[#D4AF37] bg-[#D4AF37]/5'
                    : 'border-gray-100 hover:border-gray-200'
                )}
              >
                <p className="font-semibold text-sm text-[#333333]">{t.nombre}</p>
                <p className="text-xs text-gray-400 mt-0.5">{t.duracionMinutos} min</p>
              </button>
            ))}
          </div>
        </Tarjeta>

        {/* ── 3. Fecha y hora ── */}
        <Tarjeta>
          <EncabezadoTarjeta titulo="3. Fecha y hora" />
          <div className="flex flex-col lg:flex-row gap-6">
            <CalendarioPicker
              valorSeleccionado={fecha}
              onSeleccionar={(f) => { setFecha(f); setHoraSeleccionada(''); }}
              fechaMinima={fechaHoyISO()}
              diasCerrados={diasCerrados}
              fechasBloqueadas={fechasBloqueadas}
              className="lg:w-72 shrink-0"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-[#444444] mb-3">
                {formatearFecha(fecha + 'T12:00:00')}
              </p>
              {!tratamientoSeleccionado ? (
                <p className="text-sm text-gray-400">Selecciona un tratamiento primero.</p>
              ) : cargandoSlots ? (
                <Cargando mensaje="Buscando horarios..." />
              ) : disponibilidad?.horariosDisponibles.length === 0 ? (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-700">
                  Sin horarios disponibles. Prueba otra fecha.
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {disponibilidad?.horariosDisponibles.map((h) => (
                    <button
                      key={h}
                      onClick={() => setHoraSeleccionada(h)}
                      className={cn(
                        'py-2.5 px-2 rounded-xl text-sm border-2 font-medium transition-all',
                        horaSeleccionada === h
                          ? 'border-[#D4AF37] bg-[#D4AF37] text-white'
                          : 'border-gray-100 hover:border-[#D4AF37]/50 text-[#444444]'
                      )}
                    >
                      {formatearHora(h)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Tarjeta>

        {/* ── 4. Detalles y confirmar ── */}
        <Tarjeta>
          <EncabezadoTarjeta titulo="4. Opciones finales" />

          <div className="mb-5">
            <label className="text-sm font-medium text-[#333333] block mb-1.5">Notas internas (opcional)</label>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={2}
              maxLength={500}
              placeholder="Alergias, condiciones especiales, instrucciones..."
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37] resize-none"
            />
          </div>

          <label className="flex items-start gap-3 cursor-pointer mb-6">
            <input
              type="checkbox"
              checked={confirmarInmediatamente}
              onChange={(e) => setConfirmarInmediatamente(e.target.checked)}
              className="mt-0.5 accent-[#D4AF37]"
            />
            <div>
              <p className="text-sm font-medium text-[#333333]">Confirmar inmediatamente</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Marca la cita como Confirmada y envía WhatsApp al paciente. Desmarca para dejarla Pendiente.
              </p>
            </div>
          </label>

          {/* Resumen */}
          {listo && (
            <div className="bg-gradient-to-br from-[#FAFAFA] to-[#D4AF37]/5 rounded-2xl p-4 mb-6 border border-[#D4AF37]/15 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Paciente</p>
                  <p className="font-medium text-[#333333]">{pacienteSeleccionado?.nombreCompleto}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Tratamiento</p>
                  <p className="font-medium text-[#333333]">{tratamientoSeleccionado?.nombre}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Fecha</p>
                  <p className="font-medium text-[#333333]">{formatearFecha(fecha + 'T12:00:00')}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Hora</p>
                  <p className="font-medium text-[#333333]">{formatearHora(horaSeleccionada)}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Boton
              variante="primario"
              tamano="lg"
              disabled={!listo}
              cargando={enviando}
              onClick={crearCita}
            >
              {confirmarInmediatamente ? 'Crear y confirmar cita' : 'Crear cita pendiente'}
            </Boton>
          </div>
        </Tarjeta>

      </div>
    </div>
  );
}
