import Image from 'next/image';

const CASOS = [
  { src: '/antes1.jpeg', w: 1442, h: 1600, label: 'Tratamiento facial', alt: 'Antes y después tratamiento facial — Dra. Ana Cristina Faber, medicina estética Cali' },
  { src: '/antes2.jpeg', w: 1600, h: 1600, label: 'Perfilamiento de labios', alt: 'Antes y después perfilamiento de labios con ácido hialurónico — Dra. Ana Faber Cali' },
  { src: '/antes3.jpeg', w: 1600, h: 1214, label: 'Tratamiento corporal', alt: 'Antes y después tratamiento corporal estético — Dra. Ana Cristina Faber Cali' },
  { src: '/antes4.jpeg', w: 1600, h: 1334, label: 'Renovación cutánea', alt: 'Antes y después renovación cutánea y rejuvenecimiento facial — Dra. Ana Faber Cali' },
];

export const SeccionAntesDepues = () => (
  <section className="py-16 lg:py-24 bg-[#111111]">
    <div className="max-w-6xl mx-auto px-5 sm:px-8">

      {/* Header */}
      <div className="text-center mb-10 lg:mb-14">
        <span className="inline-block text-[#D4AF37] text-xs font-semibold tracking-[0.35em] uppercase mb-4 border border-[#D4AF37]/30 px-4 py-2 rounded-full">
          Resultados reales
        </span>
        <h2 className="text-3xl sm:text-4xl font-light text-white mt-2">
          Antes <span className="text-[#D4AF37]">&</span> Después
        </h2>
        <p className="text-white/35 text-sm font-light mt-3 max-w-sm mx-auto leading-relaxed">
          Resultados obtenidos por pacientes reales de la Dra. Ana Cristina Faber.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {CASOS.map(({ src, w, h, label, alt }) => (
          <div
            key={src}
            className="group relative overflow-hidden rounded-2xl"
            style={{ boxShadow: '0 0 0 1px rgba(212,175,55,0.12), 0 8px 32px rgba(0,0,0,0.35)' }}
          >
            <Image
              src={src}
              alt={alt}
              width={w}
              height={h}
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              sizes="(max-width: 640px) 100vw, 50vw"
              loading="lazy"
              decoding="async"
            />
            {/* Overlay inferior */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-5 py-4 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
              <p className="text-white text-xs font-medium tracking-wide">{label}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[#D4AF37] text-[10px] font-semibold tracking-widest uppercase">Dra. Ana Cristina Faber</span>
              </div>
            </div>

            {/* Marco dorado en hover */}
            <div className="absolute inset-[3px] rounded-xl border border-[#D4AF37]/0 group-hover:border-[#D4AF37]/20 transition-colors duration-500 pointer-events-none" />
          </div>
        ))}
      </div>

    </div>
  </section>
);
