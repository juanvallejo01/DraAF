'use client';

import { useEffect } from 'react';

export default function ErrorAdmin({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[DraAF Admin Error]', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mb-5">
        <span className="text-red-400 text-xl">!</span>
      </div>
      <h2 className="text-lg font-semibold text-[#333333] mb-2">Error al cargar</h2>
      <p className="text-sm text-gray-400 mb-6 max-w-xs leading-relaxed">
        No se pudo cargar esta sección. Verifica tu conexión e intenta de nuevo.
      </p>
      <button
        onClick={reset}
        className="px-5 py-2 rounded-full bg-[#D4AF37] text-white text-sm font-medium hover:bg-[#C9A430] transition-colors"
      >
        Reintentar
      </button>
    </div>
  );
}
