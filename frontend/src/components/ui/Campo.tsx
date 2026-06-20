'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface PropiedadesCampo extends InputHTMLAttributes<HTMLInputElement> {
  etiqueta?: string;
  error?: string;
  descripcion?: string;
}

export const Campo = forwardRef<HTMLInputElement, PropiedadesCampo>(
  ({ etiqueta, error, descripcion, className, id, ...props }, ref) => {
    const campoId = id ?? etiqueta?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-2">
        {etiqueta && (
          <label htmlFor={campoId} className="text-sm font-medium text-[#444444]">
            {etiqueta}
            {props.required && <span className="text-[#D4AF37] ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={campoId}
          className={cn(
            'w-full rounded-2xl border bg-white px-4 py-3 text-sm text-[#333333] placeholder:text-gray-400 leading-relaxed',
            'transition-all duration-200 outline-none',
            'focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20',
            error
              ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
              : 'border-gray-200 hover:border-gray-300',
            className
          )}
          {...props}
        />
        {descripcion && !error && (
          <p className="text-xs text-gray-400 leading-relaxed">{descripcion}</p>
        )}
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Campo.displayName = 'Campo';
