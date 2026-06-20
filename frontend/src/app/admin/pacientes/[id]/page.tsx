'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Cita, RespuestaAPI, RespuestaCitasPaginada, EstadoCita } from '@/types';
import { api, ErrorAPI } from '@/lib/api';
import { formatearFecha, formatearHora } from '@/lib/fecha';
import { Tarjeta } from '@/components/ui/Tarjeta';
import { Boton } from '@/components/ui/Boton';
import { EtiquetaEstado } from '@/components/ui/EtiquetaEstado';
import { Cargando } from '@/components/ui/Cargando';
import { useToast } from '@/contexts/ToastContext';

interface PacienteDetalle {
  _id: string;
  nombreCompleto: string;
  documentoIdentidad: string;
  correoElectronico: string;
  numeroWhatsApp: string;
  activo: boolean;
  creadoEn: string;
}

export default function PaginaDetallePaciente() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { mostrarToast } = useToast();

  const [paciente, setPaciente] = useState<PacienteDetalle | null>(null);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [cargando, setCargando] = useState(true);
  const [actualizando, setActualizando] = useState<string | null>(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        const [respPaciente, respCitas] = await Promise.all([
          api.get<RespuestaAPI<PacienteDetalle>>(`/auth/admin/pacientes/${id}`),
          api.get<RespuestaAPI<RespuestaCitasPaginada>>(`/citas/admin/todas?paciente=${id}&limite=100`),
        ]);
        setPaciente(respPaciente.datos ?? null);
        setCitas(respCitas.datos?.citas ?? []);
      } catch {
        router.push('/admin/pacientes');
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [id, router]);

  const toggleActivo = async () => {
    if (!paciente) return;
    const nuevoActivo = !paciente.activo;
    try {
      await api.patch(`/auth/admin/pacientes/${id}/activo`, { activo: nuevoActivo });
      setPaciente((p) => p ? { ...p, activo: nuevoActivo } : p);
      mostrarToast(nuevoActivo ? 'Paciente activado' : 'Paciente desactivado');
    } catch (err) {
      mostrarToast(err instanceof ErrorAPI ? err.message : 'Error al actualizar el estado', 'error');
    }
  };

  const cambiarEstado = async (citaId: string, nuevoEstado: EstadoCita) => {
    setActualizando(citaId);
    try {
      await api.patch(`/citas/admin/${citaId}/estado`, { estado: nuevoEstado });
      const resp = await api.get<RespuestaAPI<RespuestaCitasPaginada>>(`/citas/admin/todas?paciente=${id}&limite=100`);
      setCitas(resp.datos?.citas ?? []);
      mostrarToast(`Cita marcada como ${ETIQUETAS[nuevoEstado]}`);
    } catch (err) {
      mostrarToast(err instanceof ErrorAPI ? err.message : 'Error al actualizar', 'error');
    } finally {
      setActualizando(null);
    }
  };

  const ETIQUETAS: Record<EstadoCita, string> = {
    PENDIENTE: 'Pendiente',
    CONFIRMADA: 'Confirmada',
    CANCELADA: 'Cancelada',
    COMPLETADA: 'Completada',
    NO_ASISTIO: 'No asistió',
  };

  if (cargando) return <Cargando mensaje="Cargando paciente..." />;
  if (!paciente) return null;

  const citasActivas = citas.filter((c) => !['CANCELADA', 'COMPLETADA', 'NO_ASISTIO'].includes(c.estado));
  const citasHistorial = citas.filter((c) => ['CANCELADA', 'COMPLETADA', 'NO_ASISTIO'].includes(c.estado));

  const totalConfirmadas = citas.filter((c) => c.estado === 'CONFIRMADA' || c.estado === 'COMPLETADA').length;
  const totalPendientes = citas.filter((c) => c.estado === 'PENDIENTE').length;

  return (
    <div>
      {/* Encabezado con back */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.push('/admin/pacientes')}
          className="text-sm text-gray-400 hover:text-[#333333] transition-colors flex items-center gap-1.5"
        >
          ← Pacientes
        </button>
        <span className="text-gray-200">/</span>
        <span className="text-sm text-[#333333] font-medium truncate">{paciente.nombreCompleto}</span>
      </div>

      {/* Perfil del paciente */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm px-6 py-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-[#D4AF37]/15 flex items-center justify-center shrink-0">
              <span className="text-[#D4AF37] text-xl font-semibold">
                {paciente.nombreCompleto.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap mb-1">
                <h1 className="text-xl font-semibold text-[#333333]">{paciente.nombreCompleto}</h1>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                  paciente.activo ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {paciente.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                <span>{paciente.correoElectronico}</span>
                <span>{paciente.numeroWhatsApp}</span>
                <span>CC {paciente.documentoIdentidad}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Paciente desde {formatearFecha(paciente.creadoEn)}
              </p>
            </div>
          </div>

          {/* Stats rápidos */}
          <div className="flex gap-3 shrink-0">
            <div className="bg-[#FAFAFA] rounded-2xl border border-gray-100 px-4 py-2.5 text-center">
              <p className="text-xl font-semibold text-[#333333]">{citas.length}</p>
              <p className="text-xs text-gray-400">Total citas</p>
            </div>
            <div className="bg-[#FAFAFA] rounded-2xl border border-gray-100 px-4 py-2.5 text-center">
              <p className="text-xl font-semibold text-amber-600">{totalPendientes}</p>
              <p className="text-xs text-gray-400">Pendientes</p>
            </div>
            <div className="bg-[#FAFAFA] rounded-2xl border border-gray-100 px-4 py-2.5 text-center">
              <p className="text-xl font-semibold text-emerald-600">{totalConfirmadas}</p>
              <p className="text-xs text-gray-400">Atendidas</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-5 pt-5 border-t border-gray-50">
          <Link
            href={`https://wa.me/${paciente.numeroWhatsApp.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-emerald-400 hover:text-emerald-600 transition-colors"
          >
            <span>💬</span> WhatsApp
          </Link>
          <Link
            href={`/admin/agenda`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors"
          >
            <span>◎</span> Ver agenda
          </Link>
          <button
            onClick={toggleActivo}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm transition-colors ${
              paciente.activo
                ? 'border-red-200 text-red-500 hover:bg-red-50'
                : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
            }`}
          >
            {paciente.activo ? '✕ Desactivar' : '✓ Activar'}
          </button>
        </div>
      </div>

      {/* Historial de citas */}
      {citas.length === 0 ? (
        <Tarjeta className="text-center py-12">
          <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-3">
            <span className="text-[#D4AF37] text-lg">◎</span>
          </div>
          <p className="text-gray-400">Este paciente no tiene citas registradas</p>
        </Tarjeta>
      ) : (
        <div className="flex flex-col gap-6">
          {citasActivas.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold text-[#444444] uppercase tracking-wider mb-3">
                Citas activas
              </h2>
              <div className="flex flex-col gap-3">
                {citasActivas.map((cita) => (
                  <TarjetaCitaAdmin
                    key={cita._id}
                    cita={cita}
                    actualizando={actualizando === cita._id}
                    onCambiarEstado={cambiarEstado}
                  />
                ))}
              </div>
            </section>
          )}

          {citasHistorial.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Historial
              </h2>
              <div className="flex flex-col gap-3">
                {citasHistorial.map((cita) => (
                  <TarjetaCitaAdmin key={cita._id} cita={cita} historial />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

function TarjetaCitaAdmin({
  cita,
  actualizando = false,
  onCambiarEstado,
  historial = false,
}: {
  cita: Cita;
  actualizando?: boolean;
  onCambiarEstado?: (id: string, estado: EstadoCita) => void;
  historial?: boolean;
}) {
  return (
    <Tarjeta className={`transition-opacity ${actualizando ? 'opacity-60' : ''} ${historial ? 'opacity-70' : ''}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
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
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className="font-medium text-sm text-[#333333]">{cita.tratamiento.nombre}</span>
              <EtiquetaEstado estado={cita.estado} />
            </div>
            <p className="text-xs text-gray-400">
              {formatearFecha(cita.fecha + 'T12:00:00')} · {formatearHora(cita.horaInicio)} – {formatearHora(cita.horaFin)}
            </p>
            {cita.notasPaciente && (
              <p className="text-xs text-gray-400 italic mt-1">"{cita.notasPaciente}"</p>
            )}
          </div>
        </div>

        {!historial && onCambiarEstado && (
          <div className="flex flex-wrap gap-2 shrink-0">
            {cita.estado === 'PENDIENTE' && (
              <Boton
                variante="primario"
                tamano="sm"
                cargando={actualizando}
                onClick={() => onCambiarEstado(cita._id, 'CONFIRMADA')}
              >
                Confirmar
              </Boton>
            )}
            {cita.estado === 'CONFIRMADA' && (
              <>
                <Boton
                  variante="secundario"
                  tamano="sm"
                  cargando={actualizando}
                  onClick={() => onCambiarEstado(cita._id, 'COMPLETADA')}
                >
                  Completada
                </Boton>
                <Boton
                  variante="fantasma"
                  tamano="sm"
                  cargando={actualizando}
                  onClick={() => onCambiarEstado(cita._id, 'NO_ASISTIO')}
                >
                  No asistió
                </Boton>
              </>
            )}
            {['PENDIENTE', 'CONFIRMADA'].includes(cita.estado) && (
              <Boton
                variante="peligro"
                tamano="sm"
                cargando={actualizando}
                onClick={() => onCambiarEstado(cita._id, 'CANCELADA')}
              >
                Cancelar
              </Boton>
            )}
          </div>
        )}
      </div>
    </Tarjeta>
  );
}
