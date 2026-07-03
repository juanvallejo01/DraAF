'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Boton } from '@/components/ui/Boton';

export const Navbar = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'bg-white/92 backdrop-blur-md border-b border-gray-100/80 shadow-sm'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between" style={{ height: '4.5rem' }}>

        {/* Logo PNG */}
        <Link href="/inicio" className="shrink-0">
          <Image
            src="/logo ana_Mesa de trabajo 1.PNG"
            alt="Dra. Ana Cristina Faber"
            width={160}
            height={94}
            className="h-12 w-auto object-contain"
            priority
          />
        </Link>

        {/* Botón Contáctanos — desktop */}
        <div className="hidden md:flex items-center">
          <Link href="/inicio#contacto">
            <Boton variante="primario" tamano="sm">Contáctanos</Boton>
          </Link>
        </div>

        {/* Hamburger — mobile */}
        <button
          className={`md:hidden flex flex-col gap-1.5 p-2 transition-colors ${scrolled ? 'text-gray-600' : 'text-gray-700'}`}
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
          <Link href="/inicio#contacto" onClick={() => setMenuAbierto(false)}>
            <Boton variante="primario" tamano="md">Contáctanos</Boton>
          </Link>
        </div>
      )}
    </header>
  );
};
