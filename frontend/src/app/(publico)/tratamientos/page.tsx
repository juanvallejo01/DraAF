'use client';

import { useState } from 'react';
import { BotonContactar } from '@/components/shared/BotonesReserva';
import { TRATAMIENTOS_ESTATICOS, CATEGORIAS } from '@/data/tratamientos';

const ICONOS: Record<string, string> = {
  'Facial': '✦',
  'Rejuvenecimiento': '◈',
  'Corporal & Láser': '◉',
  'Especialidad': '◇',
  'Capilar': '❋',
  'Glúteos': '◆',
  'Vaginal': '❁',
  'Faloplastia': '⬢',
};

export default function PaginaTratamientos() {
  const [categoria, setCategoria] = useState<string>('Todos');
  const [busqueda, setBusqueda] = useState('');

  const filtrados = TRATAMIENTOS_ESTATICOS.filter((t) => {
    const coincideCategoria = categoria === 'Todos' || t.categoria === categoria;
    const coincideBusqueda = t.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return coincideCategoria && coincideBusqueda;
  });

  const porCategoria = CATEGORIAS.slice(1).reduce<Record<string, typeof TRATAMIENTOS_ESTATICOS>>((acc, cat) => {
    acc[cat] = filtrados.filter((t) => t.categoria === cat);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#FAFAFA]">

      {/* Hero */}
      <section className="pt-32 pb-16 text-center px-5">
        <span className="inline-block text-[#D4AF37] text-xs font-semibold tracking-[0.35em] uppercase mb-5 bg-[#D4AF37]/8 px-4 py-2 rounded-full">
          Catálogo completo
        </span>
        <h1 className="text-4xl sm:text-5xl font-light text-[#333333] mb-4 leading-tight">
          Nuestros <span className="text-[#D4AF37] font-semibold">tratamientos</span>
        </h1>
        <p className="text-gray-400 text-base font-light max-w-md mx-auto leading-relaxed">
          Procedimientos estéticos de vanguardia diseñados para realzar tu belleza natural.
        </p>
      </section>

      {/* Filtros */}
      <div className="sticky top-[4.5rem] z-30 bg-[#FAFAFA]/95 backdrop-blur-sm border-b border-gray-100 px-5 py-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">

          {/* Tabs categoría */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIAS.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoria(cat)}
                className={`text-xs font-medium px-4 py-2 rounded-full transition-all duration-200 ${
                  categoria === cat
                    ? 'bg-[#D4AF37] text-white shadow-sm'
                    : 'bg-white text-gray-500 border border-gray-200 hover:border-[#D4AF37]/40 hover:text-[#D4AF37]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Búsqueda */}
          <div className="relative w-full sm:w-60">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs">◎</span>
            <input
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar tratamiento..."
              className="w-full rounded-xl border border-gray-200 bg-white pl-8 pr-4 py-2.5 text-sm text-[#333333] placeholder:text-gray-400 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12">

        {filtrados.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-base font-light mb-3">Sin resultados para &ldquo;{busqueda}&rdquo;</p>
            <button onClick={() => setBusqueda('')} className="text-sm text-[#D4AF37] hover:underline">
              Limpiar búsqueda
            </button>
          </div>
        ) : categoria !== 'Todos' ? (
          /* Vista de categoría única — grid simple */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtrados.map((t) => (
              <TarjetaTratamiento key={t.nombre} nombre={t.nombre} categoria={t.categoria} />
            ))}
          </div>
        ) : (
          /* Vista "Todos" — agrupado por categoría */
          <div className="flex flex-col gap-14">
            {CATEGORIAS.slice(1).map((cat) => {
              const items = porCategoria[cat];
              if (!items || items.length === 0) return null;
              return (
                <div key={cat}>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-[#D4AF37] text-base">{ICONOS[cat]}</span>
                    <h2 className="text-lg font-semibold text-[#333333] tracking-wide">{cat}</h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-[#D4AF37]/20 to-transparent ml-2" />
                    <span className="text-xs text-gray-400 font-light">{items.length} tratamientos</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((t) => (
                      <TarjetaTratamiento key={t.nombre} nombre={t.nombre} categoria={t.categoria} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Contador */}
        {filtrados.length > 0 && (
          <p className="text-center text-xs text-gray-400 mt-12 font-light">
            {filtrados.length} {filtrados.length === 1 ? 'tratamiento' : 'tratamientos'}
          </p>
        )}
      </div>

      {/* CTA */}
      <section className="py-20 bg-[#2E2E2E]">
        <div className="max-w-xl mx-auto px-5 text-center">
          <h2 className="text-3xl font-light text-white mb-4 leading-tight">
            ¿Lista para comenzar?
          </h2>
          <p className="text-white/50 font-light mb-8 leading-relaxed">
            Escríbenos por WhatsApp y con gusto te asesoramos.
          </p>
          <BotonContactar tamano="lg" textoBoton="Contáctanos" />
        </div>
      </section>
    </div>
  );
}

function TarjetaTratamiento({ nombre, categoria }: { nombre: string; categoria: string }) {
  return (
    <div className="group bg-white rounded-2xl px-6 py-5 border border-gray-100 hover:border-[#D4AF37]/30 hover:shadow-md transition-all duration-300 flex items-start gap-4">
      <span className="mt-0.5 shrink-0 text-[#D4AF37] text-xs opacity-60 group-hover:opacity-100 transition-opacity">
        {ICONOS[categoria]}
      </span>
      <div>
        <p className="text-sm font-medium text-[#333333] leading-snug">{nombre}</p>
        <p className="text-xs text-[#D4AF37]/70 font-light mt-1">{categoria}</p>
      </div>
    </div>
  );
}
