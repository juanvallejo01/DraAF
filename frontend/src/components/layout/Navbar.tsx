'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Boton } from '@/components/ui/Boton';
import { ModalAuth } from '@/components/ui/ModalAuth';

export const Navbar = () => {
  const { usuario, autenticado, cerrarSesion, esAdmin } = useAuth();
  const router = useRouter();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);

  const manejarCerrarSesion = () => {
    cerrarSesion();
    router.push('/');
  };

  const manejarReservar = () => {
    setMenuAbierto(false);
    if (autenticado) {
      router.push('/paciente/reservar');
    } else {
      setModalAbierto(true);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/92 backdrop-blur-md border-b border-gray-100/80">
        <nav className="max-w-6xl mx-auto px-5 sm:px-8 h-18 flex items-center justify-between" style={{ height: '4.5rem' }}>

          <Link href="/inicio" className="flex items-center gap-2 shrink-0">
            <span className="text-lg font-light tracking-[0.2em] text-[#333333]">
              Dra. <span className="text-[#D4AF37] font-semibold">AF</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-9">
            <Link href="/tratamientos" className="text-sm text-gray-500 hover:text-[#D4AF37] transition-colors font-medium">
              Tratamientos
            </Link>
            <Link href="/inicio#contacto" className="text-sm text-gray-500 hover:text-[#D4AF37] transition-colors font-medium">
              Contacto
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {autenticado ? (
              <>
                <span className="text-sm text-gray-500 font-medium">
                  {usuario?.nombreCompleto.split(' ')[0]}
                </span>
                {esAdmin ? (
                  <Boton variante="primario" tamano="sm" onClick={() => router.push('/admin')}>
                    Panel Admin
                  </Boton>
                ) : (
                  <Boton variante="secundario" tamano="sm" onClick={() => router.push('/paciente/citas')}>
                    Mis citas
                  </Boton>
                )}
                <Boton variante="fantasma" tamano="sm" onClick={manejarCerrarSesion}>
                  Salir
                </Boton>
              </>
            ) : (
              <>
                <Boton variante="fantasma" tamano="sm" onClick={() => router.push('/auth/sesion')}>
                  Iniciar sesión
                </Boton>
                <Boton variante="primario" tamano="sm" onClick={manejarReservar}>
                  Reservar cita
                </Boton>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2 text-gray-600"
            onClick={() => setMenuAbierto(!menuAbierto)}
            aria-label="Menú"
          >
            <span className={`block w-5 h-0.5 bg-current transition-all duration-200 ${menuAbierto ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-current transition-all duration-200 ${menuAbierto ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-current transition-all duration-200 ${menuAbierto ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </nav>

        {/* Menú móvil */}
        {menuAbierto && (
          <div className="md:hidden bg-white border-t border-gray-100 px-5 py-5 flex flex-col gap-4">
            <Link href="/tratamientos" className="text-sm text-gray-600 font-medium py-1" onClick={() => setMenuAbierto(false)}>Tratamientos</Link>
            <Link href="/inicio#contacto" className="text-sm text-gray-600 font-medium py-1" onClick={() => setMenuAbierto(false)}>Contacto</Link>
            <hr className="border-gray-100" />
            {autenticado ? (
              <>
                {esAdmin && (
                  <Boton variante="primario" tamano="md" onClick={() => { router.push('/admin'); setMenuAbierto(false); }}>
                    Panel Admin
                  </Boton>
                )}
                <Boton variante="secundario" tamano="md" onClick={() => { router.push('/paciente/citas'); setMenuAbierto(false); }}>
                  Mis citas
                </Boton>
                <Boton variante="fantasma" tamano="md" onClick={manejarCerrarSesion}>
                  Cerrar sesión
                </Boton>
              </>
            ) : (
              <>
                <Boton variante="fantasma" tamano="md" onClick={() => { router.push('/auth/sesion'); setMenuAbierto(false); }}>
                  Iniciar sesión
                </Boton>
                <Boton variante="primario" tamano="md" onClick={manejarReservar}>
                  Reservar cita
                </Boton>
              </>
            )}
          </div>
        )}
      </header>

      <ModalAuth
        abierto={modalAbierto}
        onCerrar={() => setModalAbierto(false)}
        destino="/paciente/reservar"
      />
    </>
  );
};
