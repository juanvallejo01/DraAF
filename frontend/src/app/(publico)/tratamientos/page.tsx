'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Tratamiento, RespuestaAPI } from '@/types';
import { api } from '@/lib/api';
import { BotonReservar } from '@/components/shared/BotonesReserva';

export default function PaginaTratamientos() {
  const [tratamientos, setTratamientos] = useState<Tratamiento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    api.get<RespuestaAPI<Tratamiento[]>>('/tratamientos', false)
      .then((r) => setTratamientos(r.datos ?? []))
      .finally(() => setCargando(false));
  }, []);

  const filtrados = tratamientos.filter((t) =>
    t.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    t.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      {/* Hero section */}
      <section className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block text-[#D4AF37] text-xs font-semibold tracking-[0.35em] uppercase mb-5 bg-[#D4AF37]/8 px-4 py-2 rounded-full">
              Catálogo completo
            </span>
            <h1 className="text-4xl sm:text-5xl font-light text-[#333333] mb-5 leading-tight">
              Nuestros <span className="text-[#D4AF37] font-semibold">tratamientos</span>
            </h1>
            <p className="text-gray-500 text-lg font-light leading-relaxed">
              Procedimientos estéticos de vanguardia con los más altos estándares médicos,
              diseñados para realzar tu belleza natural.
            </p>
          </div>

          {/* Búsqueda */}
          <div className="relative max-w-md mx-auto mb-12">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">◎</span>
            <input
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar tratamiento..."
              className="w-full rounded-2xl border border-gray-200 bg-white pl-10 pr-5 py-3.5 text-sm text-[#333333] placeholder:text-gray-400 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/15 transition-all shadow-sm"
            />
          </div>

          {/* Grid de tratamientos */}
          {cargando ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-3xl p-8 border border-gray-100 animate-pulse">
                  <div className="w-7 h-0.5 bg-gray-100 mb-5" />
                  <div className="h-4 bg-gray-100 rounded mb-3 w-2/3" />
                  <div className="h-3 bg-gray-50 rounded mb-2" />
                  <div className="h-3 bg-gray-50 rounded mb-2 w-4/5" />
                  <div className="h-3 bg-gray-50 rounded w-3/5 mb-6" />
                  <div className="h-9 bg-gray-50 rounded-full w-1/3" />
                </div>
              ))}
            </div>
          ) : filtrados.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg font-light mb-2">
                {busqueda ? `Sin resultados para "${busqueda}"` : 'No hay tratamientos disponibles'}
              </p>
              {busqueda && (
                <button
                  onClick={() => setBusqueda('')}
                  className="text-sm text-[#D4AF37] hover:underline"
                >
                  Limpiar búsqueda
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtrados.map((t) => (
                <div
                  key={t._id}
                  className="group bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#D4AF37]/20 transition-all duration-300 flex flex-col"
                >
                  {t.imagen && (
                    <div className="relative w-full h-44 mb-5 rounded-2xl overflow-hidden -mx-0">
                      <Image
                        src={t.imagen}
                        alt={t.nombre}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                  )}

                  {!t.imagen && (
                    <div className="w-7 h-0.5 bg-[#D4AF37] mb-5 group-hover:w-14 transition-all duration-300 ease-out" />
                  )}

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-[#333333] leading-snug">{t.nombre}</h3>
                      <span className="shrink-0 text-xs bg-[#D4AF37]/10 text-[#D4AF37] px-2.5 py-1 rounded-full font-medium whitespace-nowrap">
                        {t.duracionMinutos} min
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 leading-[1.8] font-light">{t.descripcion}</p>
                  </div>

                  <div className="mt-7 pt-5 border-t border-gray-50">
                    <BotonReservar tamano="md" textoBoton="Reservar cita" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Contador */}
          {!cargando && filtrados.length > 0 && (
            <p className="text-center text-sm text-gray-400 mt-10">
              {filtrados.length} {filtrados.length === 1 ? 'tratamiento disponible' : 'tratamientos disponibles'}
            </p>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#2E2E2E]">
        <div className="max-w-xl mx-auto px-5 text-center">
          <h2 className="text-3xl font-light text-white mb-4 leading-tight">
            ¿Lista para comenzar?
          </h2>
          <p className="text-white/50 font-light mb-8 leading-relaxed">
            Reserva tu cita en minutos. Recibirás confirmación por WhatsApp.
          </p>
          <BotonReservar tamano="lg" textoBoton="Reservar mi cita" />
        </div>
      </section>
    </div>
  );
}
