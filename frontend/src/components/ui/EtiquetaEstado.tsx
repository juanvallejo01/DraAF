import { EstadoCita } from '@/types';
import { cn } from '@/lib/utils';

const configuracionEstados: Record<EstadoCita, { etiqueta: string; clases: string }> = {
  PENDIENTE: {
    etiqueta: 'Pendiente',
    clases: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  CONFIRMADA: {
    etiqueta: 'Confirmada',
    clases: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  CANCELADA: {
    etiqueta: 'Cancelada',
    clases: 'bg-red-50 text-red-700 border-red-200',
  },
  COMPLETADA: {
    etiqueta: 'Completada',
    clases: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  NO_ASISTIO: {
    etiqueta: 'No asistió',
    clases: 'bg-gray-50 text-gray-600 border-gray-200',
  },
};

export const EtiquetaEstado = ({
  estado,
  className,
}: {
  estado: EstadoCita;
  className?: string;
}) => {
  const config = configuracionEstados[estado];
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        config.clases,
        className
      )}
    >
      {config.etiqueta}
    </span>
  );
};
