'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SidebarAdmin } from '@/components/layout/SidebarAdmin';
import { CargandoPantalla } from '@/components/ui/Cargando';

export default function LayoutAdmin({ children }: { children: React.ReactNode }) {
  const { autenticado, esAdmin, cargando } = useAuth();
  const router = useRouter();
  const [sidebarAbierto, setSidebarAbierto] = useState(false);

  useEffect(() => {
    if (!cargando && !autenticado) router.push('/auth/sesion');
    if (!cargando && autenticado && !esAdmin) router.push('/paciente/citas');
  }, [autenticado, esAdmin, cargando, router]);

  if (cargando) return <CargandoPantalla />;
  if (!autenticado || !esAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Overlay móvil */}
      {sidebarAbierto && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setSidebarAbierto(false)}
        />
      )}

      <SidebarAdmin
        abierto={sidebarAbierto}
        onCerrar={() => setSidebarAbierto(false)}
      />

      {/* Barra superior móvil */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-[#2E2E2E] flex items-center justify-between px-4 z-10 md:hidden shadow-md">
        <button
          onClick={() => setSidebarAbierto(true)}
          className="text-white/60 hover:text-white transition-colors p-1"
          aria-label="Abrir menú"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <rect y="3" width="20" height="2" rx="1" />
            <rect y="9" width="20" height="2" rx="1" />
            <rect y="15" width="20" height="2" rx="1" />
          </svg>
        </button>
        <span className="text-base font-light tracking-[0.2em] text-white">
          Dra. <span className="text-[#D4AF37] font-semibold">AF</span>
        </span>
        <div className="w-8" />
      </div>

      <main className="md:ml-60 pt-14 md:pt-0 p-4 sm:p-6 md:p-8 min-h-screen">
        {children}
      </main>
    </div>
  );
}
