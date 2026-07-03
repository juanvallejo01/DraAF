'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { RespuestaAPI } from '@/types';

export const Footer = () => {
  const [contacto, setContacto] = useState({
    whatsapp: '573164827229',
    direccion: 'Cl. 5 #45-20, Cali, Valle del Cauca',
    enlaceMaps: 'https://maps.app.goo.gl/7g3XNYnnd9J89hSG6',
  });

  useEffect(() => {
    api.get<RespuestaAPI<any>>('/configuracion/contacto', false)
      .then((r) => r.datos && setContacto((p) => ({ ...p, ...r.datos })))
      .catch(() => {});
  }, []);

  const numWa = contacto.whatsapp.replace(/\D/g, '');

  return (
    <footer className="bg-[#1A1A1A] text-white/70">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">

          {/* Logo */}
          <div className="md:col-span-2">
            <Link href="/inicio" className="inline-block mb-5">
              <Image
                src="/logo ana_Mesa de trabajo 1.PNG"
                alt="Dra. Ana Cristina Faber"
                width={180}
                height={105}
                className="h-14 w-auto object-contain brightness-0 invert opacity-90"
              />
            </Link>
            <p className="text-sm leading-[1.8] font-light max-w-xs text-white/50">
              Dra. Ana Cristina Faber — especialista en medicina estética y antiaging.
              Tratamientos de vanguardia con los más altos estándares en Cali, Colombia.
            </p>
          </div>

          {/* Navegación */}
          <div>
            <p className="text-white text-xs font-semibold tracking-[0.2em] uppercase mb-5">Navegación</p>
            <ul className="space-y-3">
              {[
                { label: 'Inicio', href: '/inicio' },
                { label: 'Tratamientos', href: '/inicio#tratamientos' },
                { label: 'Sobre la Dra. AF', href: '/inicio#doctora' },
                { label: 'Contacto', href: '/inicio#contacto' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm hover:text-[#D4AF37] transition-colors font-light">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <p className="text-white text-xs font-semibold tracking-[0.2em] uppercase mb-5">Contacto</p>
            <ul className="space-y-3 text-sm font-light">
              <li>
                <a href={contacto.enlaceMaps} target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF37] transition-colors leading-relaxed">
                  📍 {contacto.direccion}
                </a>
              </li>
              <li>
                <a href={`https://wa.me/${numWa}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF37] transition-colors">
                  📞 +{numWa}
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} Dra. Ana Cristina Faber · Medicina Estética y Antiaging
          </p>
          <div className="flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-[#D4AF37] inline-block" />
            <span className="text-xs text-white/20 ml-1">Cali, Colombia</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
