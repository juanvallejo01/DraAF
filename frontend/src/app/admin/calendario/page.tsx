'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ResumenMes, ResumenDia, RespuestaAPI } from '@/types';
import { api } from '@/lib/api';
import { Cargando } from '@/components/ui/Cargando';
import { cn } from '@/lib/utils';

const DIAS_SEMANA = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];
const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

function obtenerDiasGrid(year: number, month: number): (number | null)[] {
  const primerDia = new Date(year, month - 1, 1).getDay();
  const offset = primerDia === 0 ? 6 : primerDia - 1;
  const totalDias = new Date(year, month, 0).getDate();
  return [
    ...Array<null>(offset).fill(null),
    ...Array.from({ length: totalDias }, (_, i) => i + 1),
  ];
}

function toISO(y: number, m: number, d: number) {
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

const ChipsDia = ({ resumen }: { resumen: ResumenDia }) => (
  <div className="flex flex-wrap gap-0.5 mt-1 justify-center">
    {resumen.pendientes > 0 && (
      <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" title={`${resumen.pendientes} pendiente(s)`} />
    )}
    {resumen.confirmadas > 0 && (
      <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" title={`${resumen.confirmadas} confirmada(s)`} />
    )}
    {(resumen.completadas + resumen.noAsistio) > 0 && (
      <span className="w-2 h-2 rounded-full bg-gray-300 shrink-0" title="Completadas/No asistió" />
    )}
  </div>
);

export default function PaginaCalendario() {
  const router = useRouter();
  const hoy = new Date();
  const [year, setYear] = useState(hoy.getFullYear());
  const [month, setMonth] = useState(hoy.getMonth() + 1);
  const [resumen, setResumen] = useState<ResumenMes>({});
  const [cargando, setCargando] = useState(true);

  const cargarResumen = useCallback(async () => {
    setCargando(true);
    try {
      const resp = await api.get<RespuestaAPI<ResumenMes>>(
        `/citas/admin/resumen-mes?year=${year}&month=${month}`
      );
      setResumen(resp.datos ?? {});
    } finally {
      setCargando(false);
    }
  }, [year, month]);

  useEffect(() => { cargarResumen(); }, [cargarResumen]);

  const irMesAnterior = () => {
    if (month === 1) { setMonth(12); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };

  const irMesSiguiente = () => {
    if (month === 12) { setMonth(1); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const irAHoy = () => {
    setYear(hoy.getFullYear());
    setMonth(hoy.getMonth() + 1);
  };

  const hoyISO = toISO(hoy.getFullYear(), hoy.getMonth() + 1, hoy.getDate());
  const dias = obtenerDiasGrid(year, month);

  // Totales del mes
  const totalMes = Object.values(resumen).reduce((acc, d) => ({
    total: acc.total + d.total,
    pendientes: acc.pendientes + d.pendientes,
    confirmadas: acc.confirmadas + d.confirmadas,
  }), { total: 0, pendientes: 0, confirmadas: 0 });

  return (
    <div>
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <span className="inline-block text-[#D4AF37] text-xs font-semibold tracking-[0.3em] uppercase mb-2 bg-[#D4AF37]/8 px-3 py-1.5 rounded-full">
            Vista mensual
          </span>
          <h1 className="text-3xl font-light text-[#333333] mt-2">Calendario</h1>
        </div>

        {/* Métricas del mes */}
        <div className="flex gap-3">
          {[
            { label: 'Total', valor: totalMes.total, color: 'text-[#333333]' },
            { label: 'Pendientes', valor: totalMes.pendientes, color: 'text-amber-600' },
            { label: 'Confirmadas', valor: totalMes.confirmadas, color: 'text-emerald-600' },
          ].map(({ label, valor, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 px-4 py-2.5 text-center shadow-sm">
              <p className={`text-xl font-semibold ${color}`}>{valor}</p>
              <p className="text-xs text-gray-400">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Navegación del mes */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <button
            onClick={irMesAnterior}
            className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-[#333333] transition-colors text-lg"
          >
            ‹
          </button>

          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-[#333333]">
              {MESES[month - 1]} {year}
            </h2>
            <button
              onClick={irAHoy}
              className="text-xs text-[#D4AF37] hover:underline font-medium"
            >
              Hoy
            </button>
          </div>

          <button
            onClick={irMesSiguiente}
            className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-[#333333] transition-colors text-lg"
          >
            ›
          </button>
        </div>

        {/* Nombres días */}
        <div className="grid grid-cols-7 border-b border-gray-50 bg-[#FAFAFA]">
          {DIAS_SEMANA.map((d) => (
            <div key={d} className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider py-3">
              {d}
            </div>
          ))}
        </div>

        {/* Grid */}
        {cargando ? (
          <div className="py-20">
            <Cargando mensaje="Cargando calendario..." />
          </div>
        ) : (
          <div className="grid grid-cols-7 divide-x divide-y divide-gray-50">
            {dias.map((dia, idx) => {
              if (dia === null) {
                return (
                  <div key={`v-${idx}`} className="h-24 bg-[#FAFAFA]/50" />
                );
              }

              const fechaISO = toISO(year, month, dia);
              const dataDia = resumen[fechaISO];
              const esHoy = fechaISO === hoyISO;
              const esPasado = fechaISO < hoyISO;
              const tienesCitas = !!dataDia && dataDia.total > 0;

              return (
                <button
                  key={fechaISO}
                  onClick={() => router.push(`/admin/agenda?fecha=${fechaISO}`)}
                  className={cn(
                    'h-24 p-2 flex flex-col items-center group transition-all duration-150',
                    tienesCitas
                      ? 'hover:bg-[#D4AF37]/5 cursor-pointer'
                      : 'hover:bg-gray-50/80 cursor-default',
                    esPasado && 'opacity-50',
                  )}
                >
                  <span className={cn(
                    'w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium transition-all',
                    esHoy
                      ? 'bg-[#D4AF37] text-white font-semibold'
                      : 'text-[#444444] group-hover:text-[#333333]',
                  )}>
                    {dia}
                  </span>

                  {dataDia && dataDia.total > 0 && (
                    <>
                      <span className="text-xs text-gray-500 mt-1 leading-none">
                        {dataDia.total} {dataDia.total === 1 ? 'cita' : 'citas'}
                      </span>
                      <ChipsDia resumen={dataDia} />
                    </>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Leyenda */}
      <div className="flex items-center gap-5 mt-4 px-1">
        <p className="text-xs text-gray-400 font-medium">Leyenda:</p>
        {[
          { color: 'bg-amber-400', label: 'Pendiente' },
          { color: 'bg-emerald-400', label: 'Confirmada' },
          { color: 'bg-gray-300', label: 'Completada / No asistió' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
            <span className="text-xs text-gray-400">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
