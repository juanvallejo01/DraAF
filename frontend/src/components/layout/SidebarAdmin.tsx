'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { RespuestaAPI } from '@/types';
import { cn } from '@/lib/utils';

const ENLACES = [
  { href: '/admin', etiqueta: 'Dashboard', icono: '◈', exacto: true },
  { href: '/admin/calendario', etiqueta: 'Calendario', icono: '◉', exacto: false },
  { href: '/admin/agenda', etiqueta: 'Agenda del día', icono: '◎', exacto: false },
  { href: '/admin/citas', etiqueta: 'Citas', icono: '◍', exacto: false, badge: true },
  { href: '/admin/pacientes', etiqueta: 'Pacientes', icono: '◌', exacto: false },
  { href: '/admin/tratamientos', etiqueta: 'Tratamientos', icono: '◈', exacto: false },
  { href: '/admin/configuracion', etiqueta: 'Configuración', icono: '◌', exacto: false },
  { href: '/admin/perfil', etiqueta: 'Mi perfil', icono: '◌', exacto: false },
];

interface Props {
  abierto?: boolean;
  onCerrar?: () => void;
}

export const SidebarAdmin = ({ abierto = false, onCerrar }: Props) => {
  const ruta = usePathname();
  const router = useRouter();
  const { usuario, cerrarSesion } = useAuth();
  const [pendientes, setPendientes] = useState(0);

  useEffect(() => {
    api.get<RespuestaAPI<{ pendientes: number }>>('/citas/admin/conteo-pendientes')
      .then((r) => setPendientes(r.datos?.pendientes ?? 0))
      .catch(() => setPendientes(0));
  }, [ruta]);

  // Cerrar sidebar en móvil al navegar
  useEffect(() => {
    onCerrar?.();
  }, [ruta]); // eslint-disable-line react-hooks/exhaustive-deps

  const manejarSalir = () => {
    cerrarSesion();
    router.push('/');
  };

  return (
    <aside className={cn(
      'fixed left-0 top-0 h-full w-60 bg-[#2E2E2E] flex flex-col z-30 shadow-xl transition-transform duration-200',
      abierto ? 'translate-x-0' : '-translate-x-full',
      'md:translate-x-0',
    )}>
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/8 flex items-start justify-between">
        <div>
          <span className="text-lg font-light tracking-[0.2em] text-white">
            Dra. <span className="text-[#D4AF37] font-semibold">AF</span>
          </span>
          <p className="text-xs text-white/30 mt-1 font-light">Panel Administrativo</p>
        </div>
        <button
          onClick={onCerrar}
          className="md:hidden text-white/30 hover:text-white/70 transition-colors p-1 -mr-1 mt-0.5"
          aria-label="Cerrar menú"
        >
          ✕
        </button>
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {ENLACES.map(({ href, etiqueta, icono, exacto, badge }) => {
          const activo = exacto ? ruta === href : ruta === href || ruta.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm mb-1 transition-all duration-150',
                activo
                  ? 'bg-[#D4AF37] text-white font-semibold shadow-sm'
                  : 'text-white/50 hover:bg-white/8 hover:text-white/90'
              )}
            >
              <span className={cn('text-base shrink-0', activo ? 'opacity-100' : 'opacity-70')}>
                {icono}
              </span>
              <span className="flex-1">{etiqueta}</span>
              {badge && pendientes > 0 && (
                <span className={cn(
                  'text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center leading-tight',
                  activo
                    ? 'bg-white/25 text-white'
                    : 'bg-amber-400 text-white'
                )}>
                  {pendientes > 99 ? '99+' : pendientes}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Usuario */}
      <div className="px-4 py-5 border-t border-white/8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center shrink-0">
            <span className="text-[#D4AF37] text-xs font-semibold">
              {usuario?.nombreCompleto.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-xs text-white/70 font-medium truncate">{usuario?.nombreCompleto}</p>
            <p className="text-xs text-white/30 truncate">{usuario?.correoElectronico}</p>
          </div>
        </div>
        <button
          onClick={manejarSalir}
          className="w-full text-left text-xs text-white/30 hover:text-white/60 transition-colors py-1"
        >
          Cerrar sesión →
        </button>
      </div>
    </aside>
  );
};
