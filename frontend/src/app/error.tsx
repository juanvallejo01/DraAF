'use client';

import { useEffect } from 'react';

export default function ErrorGlobal({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[DraAF Error]', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-5 bg-[#FAFAFA]">
      <div className="text-center max-w-md">
        <span className="inline-block text-[#D4AF37] text-xs font-semibold tracking-[0.35em] uppercase mb-6 bg-[#D4AF37]/8 px-4 py-2 rounded-full">
          Error inesperado
        </span>
        <h1 className="text-3xl font-light text-[#333333] mb-3 mt-4">Algo salió mal</h1>
        <p className="text-gray-400 text-sm font-light leading-relaxed mb-8">
          Ocurrió un error inesperado. Por favor intenta de nuevo o vuelve al inicio.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#D4AF37] text-white text-sm font-medium hover:bg-[#C9A430] transition-colors"
          >
            Intentar nuevamente
          </button>
          <a
            href="/inicio"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-full border-2 border-gray-200 text-gray-500 text-sm font-medium hover:border-gray-300 transition-colors"
          >
            Ir al inicio
          </a>
        </div>
      </div>
    </div>
  );
}
