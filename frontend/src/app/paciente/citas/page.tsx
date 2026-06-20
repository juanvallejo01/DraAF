'use client';

import Link from 'next/link';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Cita, RespuestaAPI, PoliticaCancelacion } from '@/types';
import { api, ErrorAPI } from '@/lib/api';
import { formatearFecha, formatearHora } from '@/lib/fecha';
import { Tarjeta } from '@/components/ui/Tarjeta';
import { Boton } from '@/components/ui/Boton';
import { EtiquetaEstado } from '@/components/ui/EtiquetaEstado';
import { Cargando } from '@/components/ui/Cargando';
import { DialogoConfirmar } from '@/components/ui/DialogoConfirmar';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

function ContenidoMisCitas() {
  const { usuario } = useAuth();
  const searchParams = useSearchParams();
  const reservadaExitosa = searchParams.get('reservada') === '1';

  const [citas, setCitas] = useState<Cita[]>([]);
  const [cargando, setCargando] = useState(true);
  const [cancelando, setCancelando] = useState<string | null>(null);
  const [citaACancelar, setCitaACancelar] = useState<string | null>(null);
  const [bannerVisible, setBannerVisible] = useState(reservadaExitosa);
  const [errorCancelacion, setErrorCancelacion] = useState('');
  const [politica, setPolitica] = useState<PoliticaCancelacion | null>(null);

  useEffect(() => {
    Promise.all([
      api.get<RespuestaAPI<Cita[]>>('/citas/mis-citas'),
      api.get<RespuestaAPI<PoliticaCancelacion>>('/configuracion/cancelacion', false),
    ]).then(([rCitas, rPol]) => {
      setCitas(rCitas.datos ?? []);
      if (rPol.datos) setPolitica(rPol.datos);
    }).finally(() => setCargando(false));
  }, []);

  useEffect(() => {
    if (!bannerVisible) return;
    const t = setTimeout(() => setBannerVisible(false), 6000);
    return () => clearTimeout(t);
  }, [bannerVisible]);

  const confirmarCancelar = async () => {
    if (!citaACancelar) return;
    setCancelando(citaACancelar);
    setCitaACancelar(null);
    setErrorCancelacion('');
    try {
      await api.patch(`/citas/${citaACancelar}/cancelar`, {});
      const resp = await api.get<RespuestaAPI<Cita[]>>('/citas/mis-citas');
      setCitas(resp.datos ?? []);
    } catch (err) {
      setErrorCancelacion(err instanceof ErrorAPI ? err.message : 'No se pudo cancelar la cita');
    } finally {
      setCancelando(null);
    }
  };

  const citasActivas = citas.filter(c => !['CANCELADA', 'COMPLETADA', 'NO_ASISTIO'].includes(c.estado));
  const citasHistorial = citas.filter(c => ['CANCELADA', 'COMPLETADA', 'NO_ASISTIO'].includes(c.estado));

  return (
    <div>
      {/* Diálogo de confirmación */}
      <DialogoConfirmar
        abierto={!!citaACancelar}
        titulo="Cancelar cita"
        mensaje="¿Estás segura de que deseas cancelar esta cita? Esta acción no se puede deshacer."
        textoConfirmar="Sí, cancelar"
        textoCancelar="Mantener cita"
        variante="peligro"
        onCancelar={() => setCitaACancelar(null)}
        onConfirmar={confirmarCancelar}
      />

      {/* Error al cancelar */}
      {errorCancelacion && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl px-5 py-4 flex items-start justify-between gap-3 animar-slide">
          <div className="flex items-start gap-3">
            <span className="text-red-400 text-xl shrink-0">✕</span>
            <p className="text-sm text-red-700">{errorCancelacion}</p>
          </div>
          <button
            onClick={() => setErrorCancelacion('')}
            className="text-red-300 hover:text-red-500 text-lg leading-none shrink-0"
          >
            ×
          </button>
        </div>
      )}

      {/* Banner de éxito */}
      {bannerVisible && (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4 flex items-start justify-between gap-3 animar-slide">
          <div className="flex items-start gap-3">
            <span className="text-emerald-500 text-xl shrink-0">✓</span>
            <div>
              <p className="text-sm font-semibold text-emerald-800">¡Cita reservada con éxito!</p>
              <p className="text-xs text-emerald-600 mt-0.5 leading-relaxed">
                Tu cita quedó en estado <strong>Pendiente</strong>. Recibirás un mensaje de WhatsApp cuando el equipo la confirme.
              </p>
            </div>
          </div>
          <button
            onClick={() => setBannerVisible(false)}
            className="text-emerald-400 hover:text-emerald-600 text-lg leading-none shrink-0 mt-0.5"
          >
            ×
          </button>
        </div>
      )}

      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <span className="inline-block text-[#D4AF37] text-xs font-semibold tracking-[0.3em] uppercase mb-2 bg-[#D4AF37]/8 px-3 py-1.5 rounded-full">
            Portal Paciente
          </span>
          <h1 className="text-3xl font-light text-[#333333] mt-2">
            Hola, <span className="font-semibold">{usuario?.nombreCompleto.split(' ')[0]}</span>
          </h1>
        </div>
        <Link href="/paciente/reservar">
          <Boton variante="primario" tamano="md">+ Reservar cita</Boton>
        </Link>
      </div>

      {cargando ? (
        <Cargando mensaje="Cargando tus citas..." />
      ) : citas.length === 0 ? (
        <Tarjeta className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-[#D4AF37] text-2xl">◎</span>
          </div>
          <p className="text-xl font-light text-gray-400 mb-1">Sin citas registradas</p>
          <p className="text-sm text-gray-400 mb-6">Reserva tu primera cita con nosotros</p>
          <Link href="/paciente/reservar">
            <Boton variante="primario">Reservar ahora</Boton>
          </Link>
        </Tarjeta>
      ) : (
        <div className="flex flex-col gap-8">
          {citasActivas.length > 0 && (
            <section>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-3">
                <h2 className="text-sm font-semibold text-[#444444] uppercase tracking-wider">
                  Próximas citas
                </h2>
                {politica && politica.horasMinimas > 0 && (
                  <p className="text-xs text-gray-400">
                    Cancelación hasta {politica.horasMinimas}h antes
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-3">
                {citasActivas.map((cita) => (
                  <TarjetaCita
                    key={cita._id}
                    cita={cita}
                    cancelando={cancelando === cita._id}
                    onCancelar={() => setCitaACancelar(cita._id)}
                  />
                ))}
              </div>
            </section>
          )}

          {citasHistorial.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Historial
              </h2>
              <div className="flex flex-col gap-3">
                {citasHistorial.map((cita) => (
                  <TarjetaCita key={cita._id} cita={cita} historial />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

export default function PaginaMisCitas() {
  return (
    <Suspense fallback={<Cargando mensaje="Cargando tus citas..." />}>
      <ContenidoMisCitas />
    </Suspense>
  );
}

function TarjetaCita({
  cita,
  cancelando = false,
  onCancelar,
  historial = false,
}: {
  cita: Cita;
  cancelando?: boolean;
  onCancelar?: () => void;
  historial?: boolean;
}) {
  const puedeCancel = ['PENDIENTE', 'CONFIRMADA'].includes(cita.estado) && !historial;

  return (
    <Tarjeta className={cn('transition-shadow duration-200 hover:shadow-md', historial && 'opacity-70')}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="shrink-0 text-center bg-[#FAFAFA] border border-gray-100 rounded-2xl px-3 py-2 min-w-[56px]">
            <p className="text-xs text-[#D4AF37] font-semibold uppercase leading-none mb-1">
              {new Date(cita.fecha + 'T12:00:00').toLocaleString('es', { month: 'short' })}
            </p>
            <p className="text-xl font-bold text-[#333333] leading-none">
              {new Date(cita.fecha + 'T12:00:00').getDate()}
            </p>
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="font-semibold text-[#333333]">{cita.tratamiento.nombre}</h3>
              <EtiquetaEstado estado={cita.estado} />
            </div>
            <p className="text-sm text-gray-500">
              {formatearFecha(cita.fecha + 'T12:00:00')} · {formatearHora(cita.horaInicio)} – {formatearHora(cita.horaFin)}
            </p>
            {cita.notasPaciente && (
              <p className="text-xs text-gray-400 mt-1.5 italic">"{cita.notasPaciente}"</p>
            )}
            {cita.estado === 'CONFIRMADA' && cita.mensajeWhatsAppEnviado && (
              <p className="text-xs text-emerald-600 mt-1.5 flex items-center gap-1">
                <span>✓</span> Confirmación enviada por WhatsApp
              </p>
            )}
          </div>
        </div>

        {puedeCancel && (
          <Boton
            variante="peligro"
            tamano="sm"
            cargando={cancelando}
            onClick={onCancelar}
            className="shrink-0"
          >
            Cancelar
          </Boton>
        )}
      </div>
    </Tarjeta>
  );
}
