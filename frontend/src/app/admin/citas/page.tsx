'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Cita, RespuestaAPI, RespuestaCitasPaginada, EstadoCita } from '@/types';
import { api, ErrorAPI } from '@/lib/api';
import { formatearFecha, formatearHora } from '@/lib/fecha';
import { Tarjeta } from '@/components/ui/Tarjeta';
import { Boton } from '@/components/ui/Boton';
import { EtiquetaEstado } from '@/components/ui/EtiquetaEstado';
import { Cargando } from '@/components/ui/Cargando';
import { useToast } from '@/contexts/ToastContext';
import { PanelNotas } from '@/components/admin/PanelNotas';

const ESTADOS: EstadoCita[] = ['PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'COMPLETADA', 'NO_ASISTIO'];

const ETIQUETAS_ESTADO: Record<EstadoCita, string> = {
  PENDIENTE: 'Pendiente',
  CONFIRMADA: 'Confirmada',
  CANCELADA: 'Cancelada',
  COMPLETADA: 'Completada',
  NO_ASISTIO: 'No asistió',
};

const LIMITE = 15;

function ContenidoCitas() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { mostrarToast } = useToast();

  const pacienteParam = searchParams.get('paciente') ?? '';
  const nombreParam = searchParams.get('nombre') ?? '';

  const [citas, setCitas] = useState<Cita[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');
  const [actualizando, setActualizando] = useState<string | null>(null);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [total, setTotal] = useState(0);

  const exportarCSV = async () => {
    const params = new URLSearchParams();
    if (filtroEstado) params.append('estado', filtroEstado);
    if (filtroFecha) params.append('fecha', filtroFecha);
    if (pacienteParam) params.append('paciente', pacienteParam);
    params.append('limite', '500');

    const resp = await api.get<RespuestaAPI<RespuestaCitasPaginada>>(`/citas/admin/todas?${params}`);
    const todas = resp.datos?.citas ?? [];

    const encabezados = ['Paciente', 'Documento', 'Tratamiento', 'Fecha', 'Hora inicio', 'Hora fin', 'Estado', 'WhatsApp', 'Notas paciente'];
    const filas = todas.map((c) =>
      [
        c.paciente.nombreCompleto,
        c.paciente.documentoIdentidad,
        c.tratamiento.nombre,
        c.fecha,
        c.horaInicio,
        c.horaFin,
        c.estado,
        c.paciente.numeroWhatsApp,
        c.notasPaciente ?? '',
      ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')
    );

    const csv = [encabezados.join(','), ...filas].join('\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `citas-${filtroFecha || new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const cargarCitas = useCallback(async (paginaActual: number) => {
    setCargando(true);
    const params = new URLSearchParams();
    if (filtroEstado) params.append('estado', filtroEstado);
    if (filtroFecha) params.append('fecha', filtroFecha);
    if (pacienteParam) params.append('paciente', pacienteParam);
    params.append('pagina', String(paginaActual));
    params.append('limite', String(LIMITE));

    try {
      const resp = await api.get<RespuestaAPI<RespuestaCitasPaginada>>(`/citas/admin/todas?${params}`);
      const datos = resp.datos;
      if (datos) {
        setCitas(datos.citas);
        setTotalPaginas(datos.paginas);
        setTotal(datos.total);
        setPagina(datos.pagina);
      }
    } finally {
      setCargando(false);
    }
  }, [filtroEstado, filtroFecha, pacienteParam]);

  useEffect(() => {
    setPagina(1);
    cargarCitas(1);
  }, [filtroEstado, filtroFecha, pacienteParam]); // eslint-disable-line react-hooks/exhaustive-deps

  const irAPagina = (nueva: number) => {
    if (nueva < 1 || nueva > totalPaginas) return;
    cargarCitas(nueva);
  };

  const cambiarEstado = async (citaId: string, nuevoEstado: EstadoCita) => {
    setActualizando(citaId);
    try {
      await api.patch(`/citas/admin/${citaId}/estado`, { estado: nuevoEstado });
      mostrarToast(`Cita marcada como ${ETIQUETAS_ESTADO[nuevoEstado].toLowerCase()}`, 'exito');
      await cargarCitas(pagina);
    } catch (err) {
      if (err instanceof ErrorAPI) mostrarToast(err.message, 'error');
    } finally {
      setActualizando(null);
    }
  };

  const limpiarFiltroPaciente = () => {
    router.push('/admin/citas');
  };

  return (
    <div>
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <span className="inline-block text-[#D4AF37] text-xs font-semibold tracking-[0.3em] uppercase mb-2 bg-[#D4AF37]/8 px-3 py-1.5 rounded-full">
            Administración
          </span>
          <h1 className="text-3xl font-light text-[#333333] mt-2">Citas</h1>
          <Link href="/admin/citas/nueva" className="text-xs text-[#D4AF37] hover:underline mt-1 inline-block">
            + Nueva cita manual
          </Link>
          {nombreParam && (
            <p className="text-sm text-gray-500 mt-1">
              Filtrado por:{' '}
              <span className="font-medium text-[#333333]">{nombreParam}</span>
              <button
                onClick={limpiarFiltroPaciente}
                className="ml-2 text-xs text-[#D4AF37] hover:underline"
              >
                Ver todas
              </button>
            </p>
          )}
        </div>
        {!cargando && total > 0 && (
          <div className="flex items-center gap-3">
            <p className="text-sm text-gray-400">
              {total} {total === 1 ? 'cita' : 'citas'}
            </p>
            <Boton variante="secundario" tamano="sm" onClick={exportarCSV}>
              Exportar CSV
            </Boton>
          </div>
        )}
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-[#333333] focus:outline-none focus:border-[#D4AF37] bg-white"
        >
          <option value="">Todos los estados</option>
          {ESTADOS.map((e) => <option key={e} value={e}>{ETIQUETAS_ESTADO[e]}</option>)}
        </select>
        <input
          type="date"
          value={filtroFecha}
          onChange={(e) => setFiltroFecha(e.target.value)}
          className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-[#333333] focus:outline-none focus:border-[#D4AF37] bg-white"
        />
        {(filtroEstado || filtroFecha) && (
          <Boton variante="fantasma" tamano="sm" onClick={() => { setFiltroEstado(''); setFiltroFecha(''); }}>
            Limpiar filtros
          </Boton>
        )}
      </div>

      {cargando ? (
        <Cargando mensaje="Cargando citas..." />
      ) : citas.length === 0 ? (
        <Tarjeta className="text-center py-12">
          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3">
            <span className="text-gray-300 text-xl">◎</span>
          </div>
          <p className="text-gray-400">No hay citas para mostrar</p>
        </Tarjeta>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {citas.map((cita) => {
              const enProgreso = actualizando === cita._id;
              return (
                <Tarjeta key={cita._id} className={`transition-opacity ${enProgreso ? 'opacity-60' : ''}`}>
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {/* Bloque fecha */}
                      <div className="shrink-0 text-center bg-[#FAFAFA] border border-gray-100 rounded-2xl px-3 py-2 min-w-[52px]">
                        <p className="text-xs text-[#D4AF37] font-semibold uppercase leading-none mb-1">
                          {new Date(cita.fecha + 'T12:00:00').toLocaleString('es', { month: 'short' })}
                        </p>
                        <p className="text-xl font-bold text-[#333333] leading-none">
                          {new Date(cita.fecha + 'T12:00:00').getDate()}
                        </p>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-0.5">
                          <span className="font-semibold text-sm text-[#333333]">
                            {cita.paciente.nombreCompleto}
                          </span>
                          <EtiquetaEstado estado={cita.estado} />
                        </div>
                        <p className="text-xs text-[#D4AF37] font-medium mb-1">{cita.tratamiento.nombre}</p>
                        <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                          <span>{formatearFecha(cita.fecha + 'T12:00:00')}</span>
                          <span>{formatearHora(cita.horaInicio)} – {formatearHora(cita.horaFin)}</span>
                          <span>{cita.paciente.numeroWhatsApp}</span>
                        </div>
                        {cita.estado === 'CONFIRMADA' && cita.mensajeWhatsAppEnviado && (
                          <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                            <span>✓</span> WhatsApp enviado
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Acciones */}
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
                      {['PENDIENTE', 'CONFIRMADA'].includes(cita.estado) && (
                        <Boton
                          variante="peligro"
                          tamano="sm"
                          cargando={enProgreso}
                          onClick={() => cambiarEstado(cita._id, 'CANCELADA')}
                        >
                          Cancelar
                        </Boton>
                      )}
                    </div>
                  </div>
                  <PanelNotas cita={cita} onActualizar={() => cargarCitas(pagina)} />
                </Tarjeta>
              );
            })}
          </div>

          {/* Paginación */}
          {totalPaginas > 1 && (
            <div className="flex items-center justify-center gap-3 mt-8">
              <Boton
                variante="fantasma"
                tamano="sm"
                onClick={() => irAPagina(pagina - 1)}
                disabled={pagina <= 1}
              >
                ← Anterior
              </Boton>
              <span className="text-sm text-gray-500">
                Página <span className="font-medium text-[#333333]">{pagina}</span> de {totalPaginas}
              </span>
              <Boton
                variante="fantasma"
                tamano="sm"
                onClick={() => irAPagina(pagina + 1)}
                disabled={pagina >= totalPaginas}
              >
                Siguiente →
              </Boton>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function PaginaAdminCitas() {
  return (
    <Suspense fallback={<Cargando mensaje="Cargando citas..." />}>
      <ContenidoCitas />
    </Suspense>
  );
}
