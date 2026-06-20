'use client';

import { useEffect } from 'react';

export default function ErrorPaciente({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[DraAF Paciente Error]', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center max-w-sm mx-auto">
      <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mb-5">
        <span className="text-red-400 text-xl">!</span>
      </div>
      <h2 className="text-lg font-semibold text-[#333333] mb-2">Ocurrió un error</h2>
      <p className="text-sm text-gray-400 mb-6 leading-relaxed">
        No pudimos cargar esta página. Intenta de nuevo o vuelve a tus citas.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-5 py-2 rounded-full bg-[#D4AF37] text-white text-sm font-medium hover:bg-[#C9A430] transition-colors"
        >
          Reintentar
        </button>
        <a
          href="/paciente/citas"
          className="px-5 py-2 rounded-full border border-gray-200 text-gray-500 text-sm font-medium hover:border-gray-300 transition-colors"
        >
          Mis citas
        </a>
      </div>
    </div>
  );
}
