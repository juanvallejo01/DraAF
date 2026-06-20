'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { CargandoPantalla } from '@/components/ui/Cargando';

export default function LayoutAuth({ children }: { children: React.ReactNode }) {
  const { autenticado, cargando, esAdmin } = useAuth();
  const router = useRouter();

  // Si ya está autenticado, redirigir al área correspondiente
  useEffect(() => {
    if (!cargando && autenticado) {
      router.replace(esAdmin ? '/admin' : '/paciente/citas');
    }
  }, [autenticado, cargando, esAdmin, router]);

  if (cargando) return <CargandoPantalla />;
  if (autenticado) return null;

  return (
    <div className="min-h-screen flex">
      {/* Panel izquierdo decorativo */}
      <div className="hidden lg:flex lg:w-5/12 bg-[#2E2E2E] items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/8 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full border border-[#D4AF37]/10" />
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 rounded-full border border-[#D4AF37]/8" />
        <div className="relative z-10 text-center px-14">
          <p className="text-[#D4AF37] text-xs font-semibold tracking-[0.4em] uppercase mb-8">
            Bienvenida
          </p>
          <h1 className="text-6xl font-light text-white leading-none mb-2 tracking-tight">
            Dra.
          </h1>
          <h1 className="text-6xl font-semibold text-[#D4AF37] leading-none tracking-tight">
            AF
          </h1>
          <div className="w-14 h-0.5 bg-[#D4AF37]/40 mx-auto my-8" />
          <p className="text-white/35 text-sm font-light leading-[1.9] max-w-[220px] mx-auto">
            Medicina Estética de Alta Gama.
            <br />
            Excelencia, exclusividad y confianza.
          </p>
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
