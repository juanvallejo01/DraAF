'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Boton } from '@/components/ui/Boton';
import { BotonReservar } from '@/components/shared/BotonesReserva';
import { Tratamiento, RespuestaAPI } from '@/types';
import { api } from '@/lib/api';

const VALORES = [
  { titulo: 'Exclusividad', descripcion: 'Atención personalizada y privada para cada paciente en un ambiente de total confort.' },
  { titulo: 'Seguridad', descripcion: 'Procedimientos avalados con los más altos estándares médicos y de bioseguridad.' },
  { titulo: 'Resultados', descripcion: 'Tratamientos con resultados visibles, naturales y duraderos que transforman tu bienestar.' },
];

export default function PaginaInicio() {
  const [tratamientos, setTratamientos] = useState<Tratamiento[]>([]);
  const [contacto, setContacto] = useState({ whatsapp: '573000000000', direccion: 'Calle 10 #5-20, Cali, Colombia', enlaceMaps: 'https://maps.google.com/' });
  const [horarios, setHorarios] = useState({ apertura: '08:00', cierre: '18:00' });

  useEffect(() => {
    api.get<RespuestaAPI<Tratamiento[]>>('/tratamientos', false)
      .then((r) => setTratamientos(r.datos ?? []))
      .catch(() => setTratamientos([]));

    api.get<RespuestaAPI<any>>('/configuracion/contacto', false)
      .then((r) => r.datos && setContacto(r.datos))
      .catch(() => {});

    api.get<RespuestaAPI<any>>('/configuracion/horarios', false)
      .then((r) => {
        if (r.datos) {
          setHorarios({
            apertura: r.datos.clinica_hora_apertura,
            cierre: r.datos.clinica_hora_cierre,
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen">

      {/* ── Hero ── */}
      <section className="relative min-h-[92vh] flex items-center">
        <div className="absolute right-0 top-0 bottom-0 hidden lg:block w-[45%] bg-gradient-to-l from-[#D4AF37]/8 via-[#D4AF37]/4 to-transparent" />
        <div className="absolute right-16 top-1/2 -translate-y-1/2 hidden lg:block w-72 h-72 rounded-full border border-[#D4AF37]/12" />
        <div className="absolute right-28 top-1/2 -translate-y-1/2 hidden lg:block w-48 h-48 rounded-full border border-[#D4AF37]/8" />

        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 w-full pt-10">
          <div className="max-w-xl">
            <span className="inline-block text-[#D4AF37] text-xs font-semibold tracking-[0.35em] uppercase mb-7 bg-[#D4AF37]/8 px-4 py-2 rounded-full">
              Medicina Estética de Alta Gama
            </span>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light text-[#333333] leading-[1.08] mb-6 tracking-tight">
              Tu belleza,
              <br />
              <span className="text-[#D4AF37] font-semibold">nuestra ciencia.</span>
            </h1>
            <p className="text-gray-500 text-lg font-light leading-[1.75] mb-10 max-w-md">
              Tratamientos estéticos de vanguardia con los más altos estándares de seguridad y exclusividad.
              Reserva tu cita en minutos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <BotonReservar tamano="lg" textoBoton="Reservar mi cita" />
              <Link href="#tratamientos">
                <Boton variante="secundario" tamano="lg">
                  Ver tratamientos
                </Boton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Valores ── */}
      <section className="py-24 bg-white/70">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {VALORES.map(({ titulo, descripcion }) => (
              <div key={titulo} className="text-center px-4">
                <div className="w-10 h-0.5 bg-[#D4AF37] mx-auto mb-5" />
                <h3 className="text-xl font-semibold text-[#333333] mb-3">{titulo}</h3>
                <p className="text-sm text-gray-500 leading-[1.8] font-light">{descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tratamientos dinámicos ── */}
      <section id="tratamientos" className="py-28">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-[#D4AF37] text-xs font-semibold tracking-[0.35em] uppercase mb-4 bg-[#D4AF37]/8 px-4 py-2 rounded-full">
              Nuestros servicios
            </span>
            <h2 className="text-4xl font-light text-[#333333] mt-2">Tratamientos</h2>
          </div>

          {tratamientos.length === 0 ? (
            /* Skeleton mientras carga */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-3xl p-8 border border-gray-100 animate-pulse">
                  <div className="w-7 h-0.5 bg-gray-100 mb-5" />
                  <div className="h-4 bg-gray-100 rounded mb-3 w-2/3" />
                  <div className="h-3 bg-gray-50 rounded mb-2" />
                  <div className="h-3 bg-gray-50 rounded mb-2 w-4/5" />
                  <div className="h-3 bg-gray-50 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tratamientos.map((t) => (
                <div
                  key={t._id}
                  className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-[#D4AF37]/25 transition-all duration-300 overflow-hidden"
                >
                  {t.imagen && (
                    <div className="relative w-full h-44">
                      <Image
                        src={t.imagen}
                        alt={t.nombre}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-8">
                    {!t.imagen && (
                      <div className="w-7 h-0.5 bg-[#D4AF37] mb-5 group-hover:w-12 transition-all duration-300 ease-out" />
                    )}
                    <h3 className="text-lg font-semibold text-[#333333] mb-2">{t.nombre}</h3>
                    <p className="text-xs text-[#D4AF37] font-medium mb-3">{t.duracionMinutos} min</p>
                    <p className="text-sm text-gray-500 leading-[1.8] font-light">{t.descripcion}</p>
                    <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <BotonReservar tamano="md" textoBoton="Reservar" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Proceso ── */}
      <section className="py-24 bg-white/70">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <span className="inline-block text-[#D4AF37] text-xs font-semibold tracking-[0.35em] uppercase mb-4 bg-[#D4AF37]/8 px-4 py-2 rounded-full">
            Así funciona
          </span>
          <h2 className="text-4xl font-light text-[#333333] mt-2 mb-14">Reserva en 3 pasos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { paso: '01', titulo: 'Regístrate', desc: 'Crea tu cuenta con tus datos básicos en menos de 2 minutos.' },
              { paso: '02', titulo: 'Elige tu cita', desc: 'Selecciona el tratamiento, la fecha y el horario que prefieras.' },
              { paso: '03', titulo: 'Recibe confirmación', desc: 'Te llegará un mensaje por WhatsApp cuando tu cita sea confirmada.' },
            ].map(({ paso, titulo, desc }) => (
              <div key={paso} className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full border-2 border-[#D4AF37] flex items-center justify-center mb-5">
                  <span className="text-[#D4AF37] text-sm font-semibold">{paso}</span>
                </div>
                <h3 className="text-base font-semibold text-[#333333] mb-2">{titulo}</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-light">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-[#2E2E2E]">
        <div className="max-w-2xl mx-auto px-5 text-center">
          <span className="inline-block text-[#D4AF37] text-xs font-semibold tracking-[0.35em] uppercase mb-5 bg-[#D4AF37]/10 px-4 py-2 rounded-full">
            Agenda tu cita
          </span>
          <h2 className="text-4xl font-light text-white mb-5 leading-tight">
            Comienza tu transformación hoy
          </h2>
          <p className="text-white/50 leading-[1.8] mb-10 font-light text-base">
            Reserva en minutos y recibe confirmación por WhatsApp.
            Tu bienestar y tu belleza merecen atención de primer nivel.
          </p>
          <BotonReservar tamano="lg" textoBoton="Reservar ahora" />
        </div>
      </section>

      {/* ── Contacto ── */}
      <section id="contacto" className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-[#D4AF37] text-xs font-semibold tracking-[0.35em] uppercase mb-4 bg-[#D4AF37]/8 px-4 py-2 rounded-full">
              Contáctanos
            </span>
            <h2 className="text-4xl font-light text-[#333333] mt-2">
              Estamos aquí para <span className="text-[#D4AF37] font-semibold">ti</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* WhatsApp */}
            <div className="bg-[#FAFAFA] rounded-3xl p-8 border border-gray-100 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-5">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-base font-semibold text-[#333333] mb-2">WhatsApp</h3>
              <p className="text-sm text-gray-400 font-light mb-5 leading-relaxed">
                Escríbenos directamente para resolver cualquier duda antes de tu cita.
              </p>
              <a
                href={`https://wa.me/${contacto.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors"
              >
                Abrir WhatsApp
              </a>
            </div>

            {/* Ubicación */}
            <div className="bg-[#FAFAFA] rounded-3xl p-8 border border-gray-100 text-center">
              <div className="w-14 h-14 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-5">
                <span className="text-2xl">📍</span>
              </div>
              <h3 className="text-base font-semibold text-[#333333] mb-2">Ubicación</h3>
              <p className="text-sm text-gray-400 font-light mb-5 leading-relaxed">
                {contacto.direccion}
              </p>
              <a
                href={contacto.enlaceMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#333333] hover:bg-[#444444] text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors"
              >
                Ver en Maps
              </a>
            </div>

            {/* Horarios */}
            <div className="bg-[#FAFAFA] rounded-3xl p-8 border border-gray-100 text-center">
              <div className="w-14 h-14 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-5">
                <span className="text-2xl">🕐</span>
              </div>
              <h3 className="text-base font-semibold text-[#333333] mb-2">Horarios</h3>
              <div className="text-sm text-gray-400 font-light space-y-1.5 mb-5">
                <p>Lunes a Viernes</p>
                <p className="text-[#333333] font-medium">{horarios.apertura} – {horarios.cierre}</p>
                <p className="text-xs text-gray-300 mt-2">Sábados y domingos: cerrado</p>
              </div>
              <BotonReservar tamano="md" textoBoton="Reservar cita" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
