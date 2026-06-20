import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PropiedadesTarjeta {
  children: ReactNode;
  className?: string;
  padding?: boolean;
}

export const Tarjeta = ({ children, className, padding = true }: PropiedadesTarjeta) => {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-gray-100 shadow-sm',
        padding && 'p-6',
        className
      )}
    >
      {children}
    </div>
  );
};

export const EncabezadoTarjeta = ({
  titulo,
  descripcion,
  accion,
}: {
  titulo: string;
  descripcion?: string;
  accion?: ReactNode;
}) => (
  <div className="flex items-start justify-between mb-6">
    <div>
      <h2 className="text-lg font-semibold text-[#333333]">{titulo}</h2>
      {descripcion && <p className="text-sm text-gray-500 mt-0.5">{descripcion}</p>}
    </div>
    {accion && <div>{accion}</div>}
  </div>
);
