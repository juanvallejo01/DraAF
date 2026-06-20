'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { EstadisticasDashboard, RespuestaAPI } from '@/types';
import { api } from '@/lib/api';
import { Tarjeta } from '@/components/ui/Tarjeta';
import { Cargando } from '@/components/ui/Cargando';

interface TarjetaMetricaProps {
  valor: number;
  etiqueta: string;
  subetiqueta?: string;
  destacado?: boolean;
  icono?: string;
}

const TarjetaMetrica = ({ valor, etiqueta, subetiqueta, destacado = false, icono }: TarjetaMetricaProps) => (
  <Tarjeta className="flex flex-col justify-between gap-3">
    <div className="flex items-start justify-between">
      <div>
        <p className={`text-4xl font-light leading-none mb-1 ${destacado ? 'text-[#D4AF37]' : 'text-[#333333]'}`}>
          {valor}
        </p>
        <p className="text-sm text-[#444444] font-medium">{etiqueta}</p>
        {subetiqueta && <p className="text-xs text-gray-400 mt-0.5">{subetiqueta}</p>}
      </div>
      {icono && (
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg ${destacado ? 'bg-[#D4AF37]/10' : 'bg-gray-100'}`}>
          <span className={destacado ? 'text-[#D4AF37]' : 'text-gray-500'}>{icono}</span>
        </div>
      )}
    </div>
  </Tarjeta>
);

const ACCESOS = [
  { href: '/admin/calendario', etiqueta: 'Calendario mensual', icono: '◉' },
  { href: '/admin/agenda', etiqueta: 'Agenda del día', icono: '◎' },
  { href: '/admin/citas', etiqueta: 'Gestionar citas', icono: '◈' },
  { href: '/admin/tratamientos', etiqueta: 'Tratamientos', icono: '◍' },
  { href: '/admin/configuracion', etiqueta: 'Configurar WhatsApp', icono: '◌' },
];

export default function PaginaDashboard() {
  const [stats, setStats] = useState<EstadisticasDashboard | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    api.get<RespuestaAPI<EstadisticasDashboard>>('/citas/admin/dashboard')
      .then((r) => setStats(r.datos ?? null))
      .finally(() => setCargando(false));
  }, []);

  if (cargando) return <Cargando mensaje="Cargando dashboard..." />;

  const semana = stats?.actividadSemanal ?? [];
  const maxTotal = Math.max(...semana.map(d => d.total), 1);

  return (
    <div>
      <div className="mb-8">
        <span className="inline-block text-[#D4AF37] text-xs font-semibold tracking-[0.3em] uppercase mb-2 bg-[#D4AF37]/8 px-3 py-1.5 rounded-full">
          Resumen general
        </span>
        <h1 className="text-3xl font-light text-[#333333] mt-2">Dashboard</h1>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <TarjetaMetrica
          valor={stats?.citasHoy ?? 0}
          etiqueta="Citas hoy"
          subetiqueta={`${stats?.citasConfirmadas ?? 0} confirmadas`}
          destacado
          icono="◈"
        />
        <TarjetaMetrica
          valor={stats?.citasPendientes ?? 0}
          etiqueta="Pendientes"
          subetiqueta="Sin confirmar"
          icono="⏳"
        />
        <TarjetaMetrica
          valor={stats?.totalPacientes ?? 0}
          etiqueta="Pacientes"
          subetiqueta="Registrados"
          icono="◍"
        />
        <TarjetaMetrica
          valor={stats?.totalCitas ?? 0}
          etiqueta="Citas totales"
          subetiqueta="Históricas"
          icono="◎"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Actividad semanal */}
        <Tarjeta className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-[#333333]">Actividad últimos 7 días</h2>
              <p className="text-xs text-gray-400 mt-0.5">Citas activas (sin canceladas)</p>
            </div>
          </div>

          {semana.length === 0 ? (
            <p className="text-sm text-gray-400 py-4">Sin datos disponibles</p>
          ) : (
            <div className="flex items-end gap-2 h-32">
              {semana.map((d) => {
                const alturaPct = maxTotal > 0 ? (d.total / maxTotal) * 100 : 0;
                const alturaConfPct = d.total > 0 ? (d.confirmadas / d.total) * 100 : 0;
                const hoyISO = new Date().toISOString().split('T')[0];
                const esHoy = d.fecha === hoyISO;

                return (
                  <div key={d.fecha} className="flex-1 flex flex-col items-center gap-1.5">
                    {/* Barra */}
                    <div className="w-full flex flex-col justify-end rounded-xl overflow-hidden bg-gray-100 transition-all"
                      style={{ height: '96px' }}>
                      {d.total > 0 && (
                        <div
                          className="w-full rounded-xl transition-all duration-500 relative overflow-hidden"
                          style={{ height: `${alturaPct}%`, minHeight: '8px' }}
                        >
                          {/* Fondo base (total) */}
                          <div className="absolute inset-0 bg-[#D4AF37]/30 rounded-xl" />
                          {/* Confirmadas superpuestas */}
                          <div
                            className="absolute bottom-0 left-0 right-0 bg-[#D4AF37] rounded-xl transition-all duration-700"
                            style={{ height: `${alturaConfPct}%`, minHeight: alturaConfPct > 0 ? '4px' : '0' }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Número */}
                    <span className={`text-xs font-semibold ${d.total > 0 ? 'text-[#444444]' : 'text-gray-300'}`}>
                      {d.total > 0 ? d.total : '–'}
                    </span>

                    {/* Día */}
                    <span className={`text-xs ${esHoy ? 'text-[#D4AF37] font-semibold' : 'text-gray-400'}`}>
                      {d.dia}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Leyenda */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-50">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-[#D4AF37]" />
              <span className="text-xs text-gray-400">Confirmadas</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-[#D4AF37]/30" />
              <span className="text-xs text-gray-400">Total</span>
            </div>
          </div>
        </Tarjeta>

        {/* Accesos rápidos */}
        <Tarjeta>
          <h2 className="text-base font-semibold text-[#333333] mb-4">Accesos rápidos</h2>
          <div className="flex flex-col gap-2">
            {ACCESOS.map(({ href, etiqueta, icono }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#D4AF37]/5 transition-colors group"
              >
                <span className="text-gray-400 group-hover:text-[#D4AF37] transition-colors text-base">
                  {icono}
                </span>
                <span className="text-sm text-[#444444] group-hover:text-[#333333] font-medium flex-1">
                  {etiqueta}
                </span>
                <span className="text-gray-300 group-hover:text-[#D4AF37] transition-colors text-sm">→</span>
              </Link>
            ))}
          </div>
        </Tarjeta>
      </div>
    </div>
  );
}
