'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PropiedadesBoton extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: 'primario' | 'secundario' | 'fantasma' | 'peligro';
  tamano?: 'sm' | 'md' | 'lg';
  cargando?: boolean;
  children: ReactNode;
}

const variantes = {
  primario: 'bg-[#D4AF37] hover:bg-[#C9A430] active:bg-[#B8962E] text-white shadow-sm hover:shadow-md',
  secundario: 'border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/8',
  fantasma: 'text-[#555555] hover:bg-[#333333]/6 hover:text-[#333333]',
  peligro: 'bg-red-500 hover:bg-red-600 active:bg-red-700 text-white shadow-sm',
};

const tamanos = {
  sm: 'px-4 py-2 text-sm font-medium tracking-wide',
  md: 'px-6 py-2.5 text-sm font-medium tracking-wide',
  lg: 'px-8 py-3.5 text-base font-medium tracking-wide',
};

export const Boton = ({
  variante = 'primario',
  tamano = 'md',
  cargando = false,
  disabled,
  className,
  children,
  ...props
}: PropiedadesBoton) => {
  return (
    <button
      disabled={disabled || cargando}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:ring-offset-1',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantes[variante],
        tamanos[tamano],
        className
      )}
      {...props}
    >
      {cargando && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
};
