'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type TipoToast = 'exito' | 'error' | 'info';

export interface Toast {
  id: number;
  mensaje: string;
  tipo: TipoToast;
}

interface ContextoToast {
  mostrarToast: (mensaje: string, tipo?: TipoToast) => void;
}

const ContextoToast = createContext<ContextoToast | null>(null);

let contadorId = 0;

export const ProveedorToast = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const mostrarToast = useCallback((mensaje: string, tipo: TipoToast = 'exito') => {
    const id = ++contadorId;
    setToasts((prev) => [...prev, { id, mensaje, tipo }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const cerrar = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ContextoToast.Provider value={{ mostrarToast }}>
      {children}
      {/* Contenedor de toasts */}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`
              flex items-start gap-3 px-4 py-3.5 rounded-2xl shadow-lg pointer-events-auto
              min-w-[260px] max-w-[360px] animar-slide
              ${t.tipo === 'exito' ? 'bg-[#1a1a1a] text-white' : ''}
              ${t.tipo === 'error' ? 'bg-red-600 text-white' : ''}
              ${t.tipo === 'info' ? 'bg-[#2E2E2E] text-white' : ''}
            `}
          >
            <span className="shrink-0 mt-0.5 text-base">
              {t.tipo === 'exito' && '✓'}
              {t.tipo === 'error' && '✕'}
              {t.tipo === 'info' && '◎'}
            </span>
            <p className="text-sm leading-snug flex-1">{t.mensaje}</p>
            <button
              onClick={() => cerrar(t.id)}
              className="shrink-0 text-white/50 hover:text-white/80 transition-colors text-lg leading-none mt-0.5"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ContextoToast.Provider>
  );
};

export const useToast = (): ContextoToast => {
  const ctx = useContext(ContextoToast);
  if (!ctx) throw new Error('useToast debe usarse dentro de ProveedorToast');
  return ctx;
};
