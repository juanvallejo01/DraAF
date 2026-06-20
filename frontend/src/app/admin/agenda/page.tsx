'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Cita, RespuestaAPI, RespuestaCitasPaginada, EstadoCita } from '@/types';
import { api, ErrorAPI } from '@/lib/api';
import { fechaHoyISO, formatearHora, obtenerDiaSemana, formatearFecha } from '@/lib/fecha';
import { Tarjeta } from '@/components/ui/Tarjeta';
import { Boton } from '@/components/ui/Boton';
import { EtiquetaEstado } from '@/components/ui/EtiquetaEstado';
import { Cargando } from '@/components/ui/Cargando';
import { useToast } from '@/contexts/ToastContext';
import { PanelNotas } from '@/components/admin/PanelNotas';

const ETIQUETAS_ESTADO: Record<EstadoCita, string> = {
  PENDIENTE: 'Pendiente',
  CONFIRMADA: 'Confirmada',
  CANCELADA: 'Cancelada',
  COMPLETADA: 'Completada',
  NO_ASISTIO: 'No asistió',
};

function ContenidoAgenda() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { mostrarToast } = useToast();
  const fechaParam = searchParams.get('fecha');

  const [fecha, setFecha] = useState(fechaParam ?? fechaHoyISO());
  const [citas, setCitas] = useState<Cita[]>([]);
  const [cargando, setCargando] = useState(true);
  const [actualizando, setActualizando] = useState<string | null>(null);

  const cargar = async (f: string) => {
    setCargando(true);
    try {
      const r = await api.get<RespuestaAPI<RespuestaCitasPaginada>>(`/citas/admin/todas?fecha=${f}&limite=50`);
      setCitas(r.datos?.citas ?? []);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargar(fecha); }, [fecha]);

  const cambiarFecha = (nueva: string) => {
    setFecha(nueva);
    router.replace(`/admin/agenda?fecha=${nueva}`, { scroll: false });
  };

  const cambiarEstado = async (citaId: string, nuevoEstado: EstadoCita) => {
    setActualizando(citaId);
    try {
      await api.patch(`/citas/admin/${citaId}/estado`, { estado: nuevoEstado });
      await cargar(fecha);
      mostrarToast(`Cita marcada como ${ETIQUETAS_ESTADO[nuevoEstado]}`);
    } catch (err) {
      mostrarToast(err instanceof ErrorAPI ? err.message : 'Error al actualizar la cita', 'error');
    } finally {
      setActualizando(null);
    }
  };

  const fechaObj = new Date(fecha + 'T12:00:00');
  const esHoy = fecha === fechaHoyISO();

  return (
    <div>
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <span className="inline-block text-[#D4AF37] text-xs font-semibold tracking-[0.3em] uppercase mb-2 bg-[#D4AF37]/8 px-3 py-1.5 rounded-full">
            Vista diaria
          </span>
          <h1 className="text-3xl font-light text-[#333333] mt-2">Agenda</h1>
        </div>

        <div className="flex items-center gap-3">
          {!esHoy && (
            <button
              onClick={() => cambiarFecha(fechaHoyISO())}
              className="text-xs text-[#D4AF37] hover:underline font-medium"
            >
              Ir a hoy
            </button>
          )}
          <input
            type="date"
            value={fecha}
            onChange={(e) => cambiarFecha(e.target.value)}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:border-[#D4AF37] bg-white"
          />
        </div>
      </div>

      {/* Fecha en texto */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-base font-medium text-[#333333]">
          {obtenerDiaSemana(fechaObj)}
        </span>
        <span className="text-gray-400">·</span>
        <span className="text-base text-gray-500">{formatearFecha(fechaObj)}</span>
        {esHoy && (
          <span className="ml-1 text-xs bg-[#D4AF37] text-white px-2.5 py-0.5 rounded-full font-medium">
            Hoy
          </span>
        )}
      </div>

      {cargando ? (
        <Cargando mensaje="Cargando agenda..." />
      ) : citas.length === 0 ? (
        <Tarjeta className="text-center py-16">
          <div className="w-14 h-14 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-[#D4AF37] text-xl">◎</span>
          </div>
          <p className="text-xl font-light text-gray-400 mb-1">Sin citas para este día</p>
          <p className="text-sm text-gray-400">Selecciona otra fecha para ver la agenda</p>
        </Tarjeta>
      ) : (
        <div className="relative">
          {/* Línea vertical de timeline */}
          <div className="absolute left-16 top-0 bottom-0 w-px bg-gray-100 hidden sm:block" />

          <div className="flex flex-col gap-3">
            {citas.map((cita) => {
              const enProgreso = actualizando === cita._id;
              return (
                <div key={cita._id} className="flex gap-4 items-start">
                  {/* Hora */}
                  <div className="w-14 text-right shrink-0 pt-4">
                    <p className="text-sm font-semibold text-[#333333]">{formatearHora(cita.horaInicio)}</p>
                    <p className="text-xs text-gray-400">{formatearHora(cita.horaFin)}</p>
                  </div>

                  {/* Tarjeta de cita */}
                  <div className="flex-1">
                    <Tarjeta className={`border-l-4 transition-opacity ${enProgreso ? 'opacity-60' : ''} ${
                      cita.estado === 'CONFIRMADA' ? 'border-l-emerald-400' :
                      cita.estado === 'PENDIENTE' ? 'border-l-amber-400' :
                      cita.estado === 'CANCELADA' ? 'border-l-red-300' :
                      'border-l-gray-200'
                    }`}>
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <p className="font-semibold text-sm text-[#333333]">{cita.paciente.nombreCompleto}</p>
                            <EtiquetaEstado estado={cita.estado} />
                          </div>
                          <p className="text-xs text-[#D4AF37] font-medium mb-1">{cita.tratamiento.nombre}</p>
                          <p className="text-xs text-gray-400">{cita.paciente.numeroWhatsApp}</p>
                          {cita.notasPaciente && (
                            <p className="text-xs text-gray-500 mt-2 italic border-t border-gray-50 pt-2">
                              "{cita.notasPaciente}"
                            </p>
                          )}
                          {cita.estado === 'CONFIRMADA' && cita.mensajeWhatsAppEnviado && (
                            <p className="text-xs text-emerald-600 mt-1.5 flex items-center gap-1">
                              <span>✓</span> WhatsApp enviado
                            </p>
                          )}
                        </div>

                        {/* Acciones */}
                        {!['CANCELADA', 'COMPLETADA', 'NO_ASISTIO'].includes(cita.estado) && (
                          <div className="flex flex-wrap gap-2 shrink-0">
                            {cita.estado === 'PENDIENTE' && (
                              <Boton
                                variante="primario"
                                tamano="sm"
                                cargando={enProgreso}
                                onClick={() => cambiarEstado(cita._id, 'CONFIRMADA')}
                              >
                                Confirmar
                              </Boton>
                            )}
                            {cita.estado === 'CONFIRMADA' && (
                              <>
                                <Boton
                                  variante="secundario"
                                  tamano="sm"
                                  cargando={enProgreso}
                                  onClick={() => cambiarEstado(cita._id, 'COMPLETADA')}
                                >
                                  Completada
                                </Boton>
                                <Boton
                                  variante="fantasma"
                                  tamano="sm"
                                  cargando={enProgreso}
                                  onClick={() => cambiarEstado(cita._id, 'NO_ASISTIO')}
                                >
                                  No asistió
                                </Boton>
                              </>
                            )}
                            <Boton
                              variante="peligro"
                              tamano="sm"
                              cargando={enProgreso}
                              onClick={() => cambiarEstado(cita._id, 'CANCELADA')}
                            >
                              Cancelar
                            </Boton>
                          </div>
                        )}
                      </div>
                      <PanelNotas cita={cita} onActualizar={() => cargar(fecha)} />
                    </Tarjeta>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function PaginaAgenda() {
  return (
    <Suspense fallback={<Cargando mensaje="Cargando agenda..." />}>
      <ContenidoAgenda />
    </Suspense>
  );
}
