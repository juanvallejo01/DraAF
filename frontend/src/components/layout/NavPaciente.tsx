'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const TABS = [
  { href: '/paciente/citas', etiqueta: 'Mis citas', icono: '◎' },
  { href: '/paciente/reservar', etiqueta: 'Reservar', icono: '◈' },
  { href: '/paciente/perfil', etiqueta: 'Perfil', icono: '◌' },
];

export const NavPaciente = () => {
  const ruta = usePathname();
  const router = useRouter();
  const { usuario, cerrarSesion } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const manejarSalir = () => {
    cerrarSesion();
    router.push('/');
  };

  useEffect(() => {
    const manejarFuera = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuAbierto(false);
      }
    };
    if (menuAbierto) document.addEventListener('mousedown', manejarFuera);
    return () => document.removeEventListener('mousedown', manejarFuera);
  }, [menuAbierto]);

  const inicial = usuario?.nombreCompleto.charAt(0).toUpperCase() ?? 'P';
  const nombre = usuario?.nombreCompleto.split(' ')[0] ?? '';

  return (
    <>
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100/80">
        <nav className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between" style={{ height: '4rem' }}>

          {/* Logo */}
          <Link href="/inicio" className="flex items-center shrink-0">
            <span className="text-base font-light tracking-[0.2em] text-[#333333]">
              Dra. <span className="text-[#D4AF37] font-semibold">AF</span>
            </span>
          </Link>

          {/* Links desktop */}
          <div className="hidden sm:flex items-center gap-1">
            {TABS.map(({ href, etiqueta, icono }) => {
              const activo = ruta === href || ruta.startsWith(href + '/');
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150',
                    activo
                      ? 'bg-[#D4AF37] text-white shadow-sm'
                      : 'text-gray-500 hover:bg-[#D4AF37]/8 hover:text-[#333333]'
                  )}
                >
                  <span className="text-sm">{icono}</span>
                  {etiqueta}
                </Link>
              );
            })}
          </div>

          {/* Avatar dropdown (desktop) */}
          <div className="hidden sm:block relative" ref={menuRef}>
            <button
              onClick={() => setMenuAbierto(!menuAbierto)}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-[#D4AF37]/15 flex items-center justify-center">
                <span className="text-[#D4AF37] text-sm font-semibold">{inicial}</span>
              </div>
              <span className="text-sm font-medium text-[#333333]">{nombre}</span>
              <span className={`text-gray-400 text-xs transition-transform duration-150 ${menuAbierto ? 'rotate-180' : ''}`}>
                ▾
              </span>
            </button>

            {menuAbierto && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl border border-gray-100 shadow-lg py-2 animar-slide">
                <div className="border-t border-gray-50 mt-1 pt-1">
                  <button
                    onClick={manejarSalir}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:text-red-500 hover:bg-red-50/50 transition-colors"
                  >
                    <span>↩</span>
                    Cerrar sesión
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Avatar simple en mobile */}
          <div className="sm:hidden">
            <div className="w-8 h-8 rounded-full bg-[#D4AF37]/15 flex items-center justify-center">
              <span className="text-[#D4AF37] text-sm font-semibold">{inicial}</span>
            </div>
          </div>
        </nav>
      </header>

      {/* Bottom nav — solo mobile */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-100/80 safe-area-inset-bottom">
        <div className="grid grid-cols-4" style={{ height: '4rem' }}>
          {TABS.map(({ href, etiqueta, icono }) => {
            const activo = ruta === href || ruta.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 transition-colors',
                  activo ? 'text-[#D4AF37]' : 'text-gray-400 hover:text-gray-600'
                )}
              >
                <span className={cn('text-lg leading-none', activo ? 'opacity-100' : 'opacity-60')}>
                  {icono}
                </span>
                <span className="text-[10px] font-medium leading-none">{etiqueta}</span>
              </Link>
            );
          })}

          {/* Cerrar sesión en mobile bottom nav */}
          <button
            onClick={manejarSalir}
            className="flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-red-400 transition-colors"
          >
            <span className="text-lg leading-none opacity-60">↩</span>
            <span className="text-[10px] font-medium leading-none">Salir</span>
          </button>
        </div>
      </nav>
    </>
  );
};
