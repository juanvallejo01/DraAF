'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface Props {
  valorSeleccionado: string;          // YYYY-MM-DD
  onSeleccionar: (fecha: string) => void;
  fechaMinima?: string;               // YYYY-MM-DD, default hoy
  diasCerrados?: number[];            // JS getDay() values: 0=Dom, 1=Lun, ..., 6=Sab
  fechasBloqueadas?: string[];        // YYYY-MM-DD específicas (festivos, vacaciones)
  className?: string;
}

const DIAS_SEMANA = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];
const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

function toISO(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function obtenerDiasGrid(year: number, month: number): (number | null)[] {
  // month: 1-12
  const primerDia = new Date(year, month - 1, 1).getDay(); // 0=Dom
  const offset = primerDia === 0 ? 6 : primerDia - 1;     // Lunes primero
  const totalDias = new Date(year, month, 0).getDate();
  return [
    ...Array<null>(offset).fill(null),
    ...Array.from({ length: totalDias }, (_, i) => i + 1),
  ];
}

export const CalendarioPicker = ({
  valorSeleccionado,
  onSeleccionar,
  fechaMinima,
  diasCerrados = [],
  fechasBloqueadas = [],
  className,
}: Props) => {
  const hoyISO = new Date().toISOString().split('T')[0];
  const minimo = fechaMinima ?? hoyISO;

  // Inicializar vista en el mes del valor seleccionado o en hoy
  const fechaInicial = valorSeleccionado || hoyISO;
  const [year, setYear] = useState(() => parseInt(fechaInicial.split('-')[0], 10));
  const [month, setMonth] = useState(() => parseInt(fechaInicial.split('-')[1], 10));

  const dias = obtenerDiasGrid(year, month);

  const irMesAnterior = () => {
    if (month === 1) { setMonth(12); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };

  const irMesSiguiente = () => {
    if (month === 12) { setMonth(1); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const mesActualISO = toISO(year, month, 1).slice(0, 7);
  const minimoMes = minimo.slice(0, 7);
  const puedePrevio = mesActualISO > minimoMes;

  return (
    <div className={cn('bg-white rounded-2xl border border-gray-100 shadow-sm p-4 select-none', className)}>
      {/* Cabecera de navegación */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={irMesAnterior}
          disabled={!puedePrevio}
          className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-[#333333] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Mes anterior"
        >
          ‹
        </button>

        <span className="text-sm font-semibold text-[#333333]">
          {MESES[month - 1]} {year}
        </span>

        <button
          onClick={irMesSiguiente}
          className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-[#333333] transition-colors"
          aria-label="Mes siguiente"
        >
          ›
        </button>
      </div>

      {/* Nombres de días */}
      <div className="grid grid-cols-7 mb-2">
        {DIAS_SEMANA.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Grid de días */}
      <div className="grid grid-cols-7 gap-y-1">
        {dias.map((dia, idx) => {
          if (dia === null) {
            return <div key={`vacio-${idx}`} />;
          }

          const fechaISO = toISO(year, month, dia);
          const esSeleccionado = fechaISO === valorSeleccionado;
          const esHoy = fechaISO === hoyISO;
          const diaSemana = new Date(fechaISO + 'T12:00:00').getDay();
          const esDiaCerrado = diasCerrados.includes(diaSemana);
          const esFechaBloqueada = fechasBloqueadas.includes(fechaISO);
          const deshabilitado = fechaISO < minimo || esDiaCerrado || esFechaBloqueada;

          return (
            <button
              key={fechaISO}
              disabled={deshabilitado}
              onClick={() => onSeleccionar(fechaISO)}
              className={cn(
                'relative mx-auto w-9 h-9 flex items-center justify-center rounded-full text-sm transition-all duration-150',
                deshabilitado
                  ? esDiaCerrado || esFechaBloqueada
                    ? 'text-gray-200 cursor-not-allowed line-through'
                    : 'text-gray-300 cursor-not-allowed'
                  : 'cursor-pointer hover:bg-[#D4AF37]/12 hover:text-[#D4AF37]',
                esFechaBloqueada && !esSeleccionado && 'bg-red-50 text-red-200',
                esSeleccionado && 'bg-[#D4AF37] text-white font-semibold hover:bg-[#C9A430] hover:text-white',
                esHoy && !esSeleccionado && !deshabilitado && 'border-2 border-[#D4AF37] text-[#D4AF37] font-medium',
              )}
              aria-label={fechaISO}
              aria-pressed={esSeleccionado}
            >
              {dia}
            </button>
          );
        })}
      </div>
    </div>
  );
};
