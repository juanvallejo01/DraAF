'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Tratamiento, DisponibilidadResponse, HorariosClinica, RespuestaAPI } from '@/types';
import { api, ErrorAPI } from '@/lib/api';
import { fechaHoyISO, formatearFecha, formatearHora } from '@/lib/fecha';
import { Tarjeta, EncabezadoTarjeta } from '@/components/ui/Tarjeta';
import { Boton } from '@/components/ui/Boton';
import { Campo } from '@/components/ui/Campo';
import { Cargando } from '@/components/ui/Cargando';
import { CalendarioPicker } from '@/components/ui/CalendarioPicker';
import { cn } from '@/lib/utils';

type Paso = 1 | 2 | 3;

const ETIQUETAS_PASOS: Record<Paso, string> = {
  1: 'Tratamiento',
  2: 'Fecha y hora',
  3: 'Confirmación',
};

export default function PaginaReservar() {
  const router = useRouter();
  const [paso, setPaso] = useState<Paso>(1);
  const [tratamientos, setTratamientos] = useState<Tratamiento[]>([]);
  const [tratamientoSeleccionado, setTratamientoSeleccionado] = useState<Tratamiento | null>(null);
  const [fecha, setFecha] = useState(fechaHoyISO());
  const [disponibilidad, setDisponibilidad] = useState<DisponibilidadResponse | null>(null);
  const [horaSeleccionada, setHoraSeleccionada] = useState('');
  const [notas, setNotas] = useState('');
  const [cargando, setCargando] = useState(true);
  const [cargandoHorarios, setCargandoHorarios] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [diasCerrados, setDiasCerrados] = useState<number[]>([0, 6]);
  const [fechasBloqueadas, setFechasBloqueadas] = useState<string[]>([]);

  useEffect(() => {
    const TODOS_LOS_DIAS = [0, 1, 2, 3, 4, 5, 6];
    Promise.all([
      api.get<RespuestaAPI<Tratamiento[]>>('/tratamientos'),
      api.get<RespuestaAPI<HorariosClinica>>('/configuracion/horarios', false),
      api.get<RespuestaAPI<{ fechas: string[] }>>('/configuracion/fechas-bloqueadas', false),
    ]).then(([rTrat, rHorarios, rFechas]) => {
      setTratamientos(rTrat.datos ?? []);
      if (rHorarios.datos?.clinica_dias_activos) {
        const activos = rHorarios.datos.clinica_dias_activos.split(',').map(Number);
        setDiasCerrados(TODOS_LOS_DIAS.filter((d) => !activos.includes(d)));
      }
      if (rFechas.datos?.fechas) {
        setFechasBloqueadas(rFechas.datos.fechas);
      }
    }).finally(() => setCargando(false));
  }, []);

  useEffect(() => {
    if (!tratamientoSeleccionado) return;
    setCargandoHorarios(true);
    setHoraSeleccionada('');
    api.get<RespuestaAPI<DisponibilidadResponse>>(
      `/citas/disponibilidad?fecha=${fecha}&tratamiento=${tratamientoSeleccionado._id}`
    )
      .then((r) => setDisponibilidad(r.datos ?? null))
      .finally(() => setCargandoHorarios(false));
  }, [tratamientoSeleccionado, fecha]);

  const seleccionarFecha = (nuevaFecha: string) => {
    setFecha(nuevaFecha);
    setHoraSeleccionada('');
  };

  const confirmarReserva = async () => {
    if (!tratamientoSeleccionado || !horaSeleccionada) return;
    setEnviando(true);
    setError('');
    try {
      await api.post('/citas', {
        tratamiento: tratamientoSeleccionado._id,
        fecha,
        horaInicio: horaSeleccionada,
        notasPaciente: notas || undefined,
      });
      router.push('/paciente/citas?reservada=1');
    } catch (err) {
      setError(err instanceof ErrorAPI ? err.message : 'Error al reservar. Intenta nuevamente.');
    } finally {
      setEnviando(false);
    }
  };

  if (cargando) return <Cargando mensaje="Cargando tratamientos..." />;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Encabezado */}
      <div className="mb-8">
        <span className="inline-block text-[#D4AF37] text-xs font-semibold tracking-[0.3em] uppercase mb-3 bg-[#D4AF37]/8 px-3 py-1.5 rounded-full">
          Nueva reserva
        </span>
        <h1 className="text-3xl font-light text-[#333333] mt-3">Reservar cita</h1>
      </div>

      {/* Indicador de pasos */}
      <div className="flex items-center gap-0 mb-8">
        {([1, 2, 3] as Paso[]).map((p, i) => (
          <div key={p} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div className={cn(
                'w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all',
                paso > p
                  ? 'bg-[#D4AF37] text-white'
                  : paso === p
                  ? 'bg-[#333333] text-white'
                  : 'bg-gray-100 text-gray-400'
              )}>
                {paso > p ? '✓' : p}
              </div>
              <span className={cn(
                'text-xs hidden sm:block',
                paso === p ? 'text-[#333333] font-medium' : 'text-gray-400'
              )}>
                {ETIQUETAS_PASOS[p]}
              </span>
            </div>
            {i < 2 && (
              <div className={cn(
                'flex-1 h-0.5 mx-2 mb-5 transition-colors',
                paso > p ? 'bg-[#D4AF37]' : 'bg-gray-200'
              )} />
            )}
          </div>
        ))}
      </div>

      {/* ── Paso 1: Tratamiento ── */}
      {paso === 1 && (
        <Tarjeta>
          <EncabezadoTarjeta titulo="¿Qué tratamiento necesitas?" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {tratamientos.map((t) => (
              <button
                key={t._id}
                onClick={() => setTratamientoSeleccionado(t)}
                className={cn(
                  'text-left p-5 rounded-2xl border-2 transition-all duration-150',
                  tratamientoSeleccionado?._id === t._id
                    ? 'border-[#D4AF37] bg-[#D4AF37]/5 shadow-sm'
                    : 'border-gray-100 hover:border-gray-200 hover:shadow-sm'
                )}
              >
                <p className="font-semibold text-[#333333] text-sm mb-1">{t.nombre}</p>
                <p className="text-xs text-gray-400">{t.duracionMinutos} min · {t.descripcion.slice(0, 50)}…</p>
              </button>
            ))}
          </div>
          <div className="flex justify-end mt-6 pt-4 border-t border-gray-50">
            <Boton
              variante="primario"
              disabled={!tratamientoSeleccionado}
              onClick={() => setPaso(2)}
            >
              Continuar →
            </Boton>
          </div>
        </Tarjeta>
      )}

      {/* ── Paso 2: Fecha y hora ── */}
      {paso === 2 && (
        <Tarjeta>
          <EncabezadoTarjeta titulo="Selecciona cuándo" />

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Calendario */}
            <CalendarioPicker
              valorSeleccionado={fecha}
              onSeleccionar={seleccionarFecha}
              fechaMinima={fechaHoyISO()}
              diasCerrados={diasCerrados}
              fechasBloqueadas={fechasBloqueadas}
              className="lg:w-72 shrink-0"
            />

            {/* Horarios */}
            <div className="flex-1">
              <p className="text-sm font-medium text-[#444444] mb-1">
                {fecha ? formatearFecha(fecha + 'T12:00:00') : 'Selecciona una fecha'}
              </p>

              {cargandoHorarios ? (
                <Cargando mensaje="Buscando horarios..." />
              ) : !tratamientoSeleccionado ? (
                <p className="text-sm text-gray-400 mt-4">Regresa al paso anterior para elegir un tratamiento.</p>
              ) : disponibilidad?.horariosDisponibles.length === 0 ? (
                <div className="mt-4 bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-700">
                  Sin horarios disponibles para este día. Prueba otra fecha.
                </div>
              ) : (
                <div className="mt-3">
                  <p className="text-xs text-gray-400 mb-3 uppercase tracking-wide font-medium">
                    Horarios disponibles
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {disponibilidad?.horariosDisponibles.map((h) => (
                      <button
                        key={h}
                        onClick={() => setHoraSeleccionada(h)}
                        className={cn(
                          'py-2.5 px-2 rounded-xl text-sm border-2 font-medium transition-all',
                          horaSeleccionada === h
                            ? 'border-[#D4AF37] bg-[#D4AF37] text-white shadow-sm'
                            : 'border-gray-100 hover:border-[#D4AF37]/50 text-[#444444] bg-white'
                        )}
                      >
                        {formatearHora(h)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between mt-6 pt-4 border-t border-gray-50">
            <Boton variante="fantasma" onClick={() => { setPaso(1); setHoraSeleccionada(''); }}>
              ← Atrás
            </Boton>
            <Boton
              variante="primario"
              disabled={!horaSeleccionada}
              onClick={() => setPaso(3)}
            >
              Continuar →
            </Boton>
          </div>
        </Tarjeta>
      )}

      {/* ── Paso 3: Confirmación ── */}
      {paso === 3 && (
        <Tarjeta>
          <EncabezadoTarjeta titulo="Confirma tu reserva" />

          {/* Resumen visual */}
          <div className="bg-gradient-to-br from-[#FAFAFA] to-[#D4AF37]/5 rounded-2xl p-5 mb-6 border border-[#D4AF37]/15">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">Tratamiento</p>
                <p className="text-base font-semibold text-[#333333]">{tratamientoSeleccionado?.nombre}</p>
                <p className="text-xs text-gray-400 mt-0.5">{tratamientoSeleccionado?.duracionMinutos} minutos de duración</p>
              </div>
              <div className="w-10 h-10 bg-[#D4AF37]/10 rounded-full flex items-center justify-center shrink-0">
                <span className="text-[#D4AF37] text-lg">◈</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#D4AF37]/10">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">Fecha</p>
                <p className="text-sm font-medium text-[#333333]">{formatearFecha(fecha + 'T12:00:00')}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">Hora</p>
                <p className="text-sm font-medium text-[#333333]">{formatearHora(horaSeleccionada)}</p>
              </div>
            </div>
          </div>

          <Campo
            etiqueta="Notas adicionales (opcional)"
            type="text"
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder="Alergias, medicamentos actuales, condiciones especiales…"
            className="mb-5"
          />

          <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-6">
            <span className="text-amber-500 text-base mt-0.5">⏳</span>
            <p className="text-xs text-amber-700 leading-relaxed">
              Tu cita quedará <strong>pendiente</strong> hasta que el equipo la confirme.
              Recibirás un mensaje por WhatsApp con todos los detalles cuando esté confirmada.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 mb-5">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex justify-between pt-4 border-t border-gray-50">
            <Boton variante="fantasma" onClick={() => setPaso(2)}>← Atrás</Boton>
            <Boton variante="primario" tamano="lg" cargando={enviando} onClick={confirmarReserva}>
              Confirmar reserva
            </Boton>
          </div>
        </Tarjeta>
      )}
    </div>
  );
}
