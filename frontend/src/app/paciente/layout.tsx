'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { NavPaciente } from '@/components/layout/NavPaciente';
import { CargandoPantalla } from '@/components/ui/Cargando';

export default function LayoutPaciente({ children }: { children: React.ReactNode }) {
  const { autenticado, cargando, esAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!cargando && !autenticado) router.push('/auth/sesion');
    if (!cargando && esAdmin) router.push('/admin');
  }, [autenticado, cargando, esAdmin, router]);

  if (cargando) return <CargandoPantalla />;
  if (!autenticado) return null;

  return (
    <>
      <NavPaciente />
      <main className="pt-16 pb-20 sm:pb-0 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">{children}</div>
      </main>
    </>
  );
}
