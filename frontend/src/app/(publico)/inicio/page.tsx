'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { BotonContactar } from '@/components/shared/BotonesReserva';
import { MarqueeGaleria } from '@/components/shared/MarqueeGaleria';
import { SeccionAntesDepues } from '@/components/shared/SeccionAntesDepues';
import type { RespuestaAPI } from '@/types';
import { api } from '@/lib/api';
import { TRATAMIENTOS_ESTATICOS, CATEGORIAS } from '@/data/tratamientos';

const SCHEMA_ORG = {
  '@context': 'https://schema.org',
  '@type': ['MedicalBusiness', 'LocalBusiness'],
  name: 'Dra. Ana Cristina Faber — Medicina Estética y Antiaging',
  alternateName: 'Dra. AF Medicina Estética Cali',
  description:
    'Clínica de medicina estética y antiaging en Cali, Colombia. Especializados en botox, ácido hialurónico, armonización facial, bioestimuladores de colágeno, peeling químico, depilación láser y rejuvenecimiento facial.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://draaf.vercel.app',
  telephone: '+573164827229',
  priceRange: '$$',
  image: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://draaf.vercel.app'}/README.jpeg`,
  logo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://draaf.vercel.app'}/logo%20ana_Mesa%20de%20trabajo%201.PNG`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Cl. 5 #45-20',
    addressLocality: 'Cali',
    addressRegion: 'Valle del Cauca',
    postalCode: '760001',
    addressCountry: 'CO',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 3.4423,
    longitude: -76.5399,
  },
  areaServed: {
    '@type': 'City',
    name: 'Cali',
    sameAs: 'https://www.wikidata.org/wiki/Q39984',
  },
  sameAs: ['https://www.instagram.com/dra.ana.faber/'],
  medicalSpecialty: 'Estetica',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Tratamientos Estéticos',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Armonización Facial' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Botox / Toxina Botulínica' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Ácido Hialurónico' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Relleno y perfilamiento de labios' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Bioestimuladores de colágeno' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Plasma rico en plaquetas (PRP)' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Peeling químico' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Depilación Láser 4D Vellux' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Rinomodelación' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Rejuvenecimiento Facial' } },
    ],
  },
};

const CREDENCIALES = [
  'Médica especialista en Medicina Estética y Antiaging',
  'Experta en técnicas no invasivas de rejuvenecimiento facial',
  'Amplia experiencia clínica en procedimientos estéticos',
  'Actualización continua en congresos internacionales de estética',
];

export default function PaginaInicio() {
  const [contacto, setContacto] = useState({
    whatsapp: '573164827229',
    instagram: 'https://www.instagram.com/dra.ana.faber/',
    direccion: 'Cl. 5 #45-20, Cali, Valle del Cauca',
    enlaceMaps: 'https://maps.app.goo.gl/7g3XNYnnd9J89hSG6',
  });

  useEffect(() => {
    api.get<RespuestaAPI<unknown[]>>('/tratamientos', false).catch(() => {});
    api.get<RespuestaAPI<any>>('/configuracion/contacto', false)
      .then((r) => r.datos && setContacto((prev) => ({ ...prev, ...r.datos })))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen">

      {/* JSON-LD Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA_ORG) }}
      />

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#FAFAFA] via-white to-[#F7F3ED]">
        {/* H1 visible solo para buscadores — no afecta el diseño */}
        <h1 className="sr-only">
          Dra. Ana Cristina Faber — Medicina Estética y Antiaging en Cali, Colombia. Botox, ácido hialurónico, armonización facial y bioestimuladores.
        </h1>

        {/* Círculos — solo visible en pantallas medianas+ */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(700px,90vw)] h-[min(700px,90vw)] rounded-full border border-[#D4AF37]/8 pointer-events-none hidden sm:block" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(500px,70vw)] h-[min(500px,70vw)] rounded-full border border-[#D4AF37]/6 pointer-events-none hidden sm:block" />

        {/* Esquinas — solo md+ */}
        <div className="absolute top-12 left-6 sm:left-10 w-10 sm:w-16 h-10 sm:h-16 border-t border-l border-[#D4AF37]/25 pointer-events-none" />
        <div className="absolute top-12 right-6 sm:right-10 w-10 sm:w-16 h-10 sm:h-16 border-t border-r border-[#D4AF37]/25 pointer-events-none" />
        <div className="absolute bottom-12 left-6 sm:left-10 w-10 sm:w-16 h-10 sm:h-16 border-b border-l border-[#D4AF37]/25 pointer-events-none" />
        <div className="absolute bottom-12 right-6 sm:right-10 w-10 sm:w-16 h-10 sm:h-16 border-b border-r border-[#D4AF37]/25 pointer-events-none" />

        <div className="relative flex flex-col items-center gap-8 px-6 sm:px-12 lg:px-16 w-full max-w-4xl">
          <div className="flex items-center gap-4 w-full max-w-[200px] sm:max-w-xs">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#D4AF37]/50" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/60 shrink-0" />
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#D4AF37]/50" />
          </div>

          <Image
            src="/logo ana_Mesa de trabajo 1.PNG"
            alt="Dra. Ana Cristina Faber — Medicina Estética"
            width={900}
            height={526}
            className="w-full h-auto drop-shadow-[0_8px_32px_rgba(212,175,55,0.12)]"
            priority
          />

          <div className="flex items-center gap-4 w-full max-w-[200px] sm:max-w-xs">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#D4AF37]/50" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/60 shrink-0" />
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#D4AF37]/50" />
          </div>
        </div>

        <div className="absolute bottom-8 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37]/60 font-medium">Scroll</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[#D4AF37]/50">
            <path d="M8 3v10M3 9l5 5 5-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </section>

      {/* ── Sobre la Doctora ── */}
      <section id="doctora" className="py-16 lg:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* Foto */}
            <div className="relative flex justify-center lg:justify-start">
              <div className="relative w-full max-w-xs sm:max-w-sm aspect-[3/4] rounded-3xl overflow-hidden shadow-xl">
                <Image
                  src="/README.jpeg"
                  alt="Dra. Ana Cristina Faber"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 640px) 80vw, (max-width: 1024px) 50vw, 40vw"
                  priority
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 sm:px-5 py-3 sm:py-4 w-full border border-[#D4AF37]/20">
                    <p className="text-[10px] sm:text-xs text-[#D4AF37] font-semibold tracking-widest uppercase mb-1">
                      Fundadora & Directora Médica
                    </p>
                    <p className="text-[#333333] font-semibold text-sm sm:text-base">Dra. Ana Cristina Faber</p>
                    <p className="text-gray-400 text-xs font-light mt-0.5">Medicina Estética y Antiaging · Cali</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full border-2 border-[#D4AF37]/15 hidden lg:block pointer-events-none" />
              <div className="absolute -top-6 -left-6 w-20 h-20 rounded-full border border-[#D4AF37]/10 hidden lg:block pointer-events-none" />
            </div>

            {/* Texto */}
            <div className="mt-6 lg:mt-0">
              <span className="inline-block text-[#D4AF37] text-xs font-semibold tracking-[0.35em] uppercase mb-5 bg-[#D4AF37]/8 px-4 py-2 rounded-full">
                Fundadora & Directora Médica
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-[#333333] mb-5 leading-tight">
                Conoce a la<br />
                <span className="text-[#D4AF37] font-semibold">Dra. Ana Cristina</span>
              </h2>
              <p className="text-gray-500 text-sm sm:text-base font-light leading-[1.9] mb-4">
                Especialista en medicina estética y antiaging, dedicada a realzar la belleza
                natural de cada paciente con tratamientos de vanguardia. Su filosofía combina
                ciencia, arte y honestidad: si algo no es para ti, te lo dice.
              </p>
              <p className="text-gray-500 text-sm sm:text-base font-light leading-[1.9] mb-8">
                Cada procedimiento es diseñado a la medida — porque ninguna paciente es igual
                y los resultados deben verse naturales, no intervenidos. Tu confianza es el
                pilar de todo lo que hacemos.
              </p>
              <ul className="space-y-3">
                {CREDENCIALES.map((c) => (
                  <li key={c} className="flex items-start gap-3">
                    <span className="mt-1.5 shrink-0 w-4 h-0.5 bg-[#D4AF37]" />
                    <span className="text-sm text-gray-600 font-light">{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tratamientos ── */}
      <section id="tratamientos" className="py-16 lg:py-24 bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-10 lg:mb-14">
            <span className="inline-block text-[#D4AF37] text-xs font-semibold tracking-[0.35em] uppercase mb-4 bg-[#D4AF37]/8 px-4 py-2 rounded-full">
              Nuestros servicios
            </span>
            <h2 className="text-3xl sm:text-4xl font-light text-[#333333] mt-2">Tratamientos</h2>
          </div>

          <div className="flex flex-col gap-8 lg:gap-10">
            {CATEGORIAS.slice(1).map((cat) => {
              const items = TRATAMIENTOS_ESTATICOS.filter((t) => t.categoria === cat);
              return (
                <div key={cat}>
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-xs sm:text-sm font-semibold text-[#333333] tracking-wide uppercase whitespace-nowrap">{cat}</h3>
                    <div className="flex-1 h-px bg-gradient-to-r from-[#D4AF37]/25 to-transparent" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                    {items.map((t) => (
                      <div
                        key={t.nombre}
                        className="group bg-white rounded-xl px-4 sm:px-5 py-3 sm:py-4 border border-gray-100 hover:border-[#D4AF37]/30 hover:shadow-sm transition-all duration-200 flex items-center gap-3"
                      >
                        <span className="shrink-0 w-1 h-1 rounded-full bg-[#D4AF37]" />
                        <p className="text-xs sm:text-sm text-[#333333] font-light leading-snug">{t.nombre}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Antes & Después ── */}
      <SeccionAntesDepues />

      {/* ── Galería Marquee ── */}
      <MarqueeGaleria />

      {/* ── Facilidades de pago ── */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <span className="inline-block text-[#D4AF37] text-xs font-semibold tracking-[0.35em] uppercase mb-5 bg-[#D4AF37]/8 px-4 py-2 rounded-full">
            Facilidades de pago
          </span>
          <h2 className="text-3xl sm:text-4xl font-light text-[#333333] mb-5 leading-tight">
            Financia tu <span className="text-[#D4AF37] font-semibold">tratamiento</span>
          </h2>
          <p className="text-gray-500 text-sm sm:text-base font-light leading-relaxed max-w-2xl mx-auto mb-10">
            Disponemos de opciones de financiación con Sistecrédito, Welli y Meddipay.
            Consulta con nuestro equipo las condiciones y elige la alternativa que mejor
            se adapte a tus necesidades.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {['Sistecrédito', 'Welli', 'Meddipay'].map((entidad) => (
              <div
                key={entidad}
                className="bg-[#FAFAFA] border border-gray-100 rounded-2xl px-8 py-5 text-sm font-medium text-[#333333] hover:border-[#D4AF37]/30 hover:shadow-sm transition-all duration-300"
              >
                {entidad}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contacto ── */}
      <section id="contacto" className="grid grid-cols-1 lg:grid-cols-2">

        {/* Izquierda — info */}
        <div className="bg-[#111111] flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-14 lg:py-20 gap-8">

          <div>
            <span className="inline-block text-[#D4AF37] text-xs font-semibold tracking-[0.35em] uppercase mb-5 border border-[#D4AF37]/30 px-4 py-2 rounded-full">
              Contáctanos
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white leading-tight">
              Encuéntranos
            </h2>
            <p className="text-white/40 text-sm font-light mt-3 leading-relaxed">
              {contacto.direccion}
            </p>
            <a
              href={contacto.enlaceMaps}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#D4AF37]/70 hover:text-[#D4AF37] text-xs font-medium mt-2 transition-colors"
            >
              Ver en Google Maps
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>

          <div className="flex flex-col gap-3">
            {/* WhatsApp */}
            <a
              href={`https://wa.me/${contacto.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 bg-white/5 hover:bg-white/9 border border-white/8 hover:border-[#25D366]/30 rounded-2xl px-5 py-4 transition-all duration-300"
            >
              <div className="shrink-0 w-10 h-10 rounded-full bg-[#25D366]/15 group-hover:bg-[#25D366]/25 flex items-center justify-center transition-colors">
                <svg viewBox="0 0 24 24" fill="#25D366" className="w-5 h-5">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-medium">WhatsApp</p>
                <p className="text-white/40 text-xs font-light mt-0.5">Escríbenos directamente</p>
              </div>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="ml-auto shrink-0 text-white/20 group-hover:text-[#25D366]/60 transition-colors">
                <path d="M3 11L11 3M11 3H5M11 3V9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>

            {/* Instagram */}
            <a
              href={contacto.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 bg-white/5 hover:bg-white/9 border border-white/8 hover:border-purple-400/30 rounded-2xl px-5 py-4 transition-all duration-300"
            >
              <div className="shrink-0 w-10 h-10 rounded-full bg-purple-500/10 group-hover:bg-purple-500/20 flex items-center justify-center transition-colors">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="url(#ig-grad)">
                  <defs>
                    <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#f09433"/>
                      <stop offset="25%" stopColor="#e6683c"/>
                      <stop offset="50%" stopColor="#dc2743"/>
                      <stop offset="75%" stopColor="#cc2366"/>
                      <stop offset="100%" stopColor="#bc1888"/>
                    </linearGradient>
                  </defs>
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-medium">Instagram</p>
                <p className="text-white/40 text-xs font-light mt-0.5">Síguenos y ve nuestros resultados</p>
              </div>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="ml-auto shrink-0 text-white/20 group-hover:text-purple-400/60 transition-colors">
                <path d="M3 11L11 3M11 3H5M11 3V9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>

        </div>

        {/* Derecha — mapa */}
        <div className="h-[320px] sm:h-[400px] lg:h-auto lg:min-h-[560px]">
          <iframe
            src="https://maps.google.com/maps?q=Cl.+5+%2345-20%2C+Cali%2C+Valle+del+Cauca%2C+Colombia&output=embed&hl=es&z=17"
            className="w-full h-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación Dra. Ana Cristina Faber"
          />
        </div>

      </section>
    </div>
  );
}
