import Image from 'next/image';

const IMAGENES = [
  'IMG_7514.jpeg',
  'IMG_7515.jpeg',
  'IMG_7516.jpeg',
  'IMG_7517.jpeg',
  'IMG_7518.jpeg',
  'IMG_7519.jpeg',
  'IMG_7520.jpeg',
  'IMG_7521.jpeg',
  'IMG_7522.jpeg',
  'IMG_7523.jpeg',
  'IMG_7524.jpeg',
  'IMG_7525.jpeg',
  'IMG_7526.jpeg',
];

const Fila = ({ invertir = false }: { invertir?: boolean }) => {
  const lista = invertir ? [...IMAGENES].reverse() : IMAGENES;
  const doble = [...lista, ...lista];

  return (
    <div className="relative overflow-hidden">
      {/* Fades laterales */}
      <div className="absolute left-0 top-0 bottom-0 w-10 z-10 bg-gradient-to-r from-[#FAFAFA] to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-10 z-10 bg-gradient-to-l from-[#FAFAFA] to-transparent pointer-events-none" />

      <div className={invertir ? 'marquee-track gap-3' : 'marquee-ltr-track gap-3'}>
        {doble.map((img, i) => (
          <div
            key={i}
            className="group relative shrink-0 rounded-xl overflow-hidden"
            style={{
              width: '220px',
              height: '157px',
              boxShadow: '0 0 0 1px rgba(212,175,55,0.18), 0 4px 14px rgba(0,0,0,0.07)',
            }}
          >
            <Image
              src={`/${img}`}
              alt={`Resultado ${(i % IMAGENES.length) + 1}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="220px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
            <div className="absolute inset-[2px] rounded-xl border border-[#D4AF37]/0 group-hover:border-[#D4AF37]/35 transition-colors duration-500" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const MarqueeGaleria = () => (
  <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[560px]">

    {/* ── Izquierda: marquee horizontal LTR ── */}
    <div className="flex flex-col justify-center gap-4 py-10 lg:py-12 bg-[#FAFAFA] overflow-hidden">
      <div className="px-0">
        <div className="mb-5 px-5 sm:px-8">
          <span className="inline-block text-[#D4AF37] text-xs font-semibold tracking-[0.35em] uppercase bg-[#D4AF37]/8 px-4 py-2 rounded-full">
            Galería
          </span>
        </div>
        <div className="flex flex-col gap-4">
          <Fila />
          <Fila invertir />
        </div>
      </div>
    </div>

    {/* ── Derecha: certificado ── */}
    <div className="relative flex items-center justify-center bg-white px-5 py-10 sm:p-8 lg:p-14">
      <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/4 via-transparent to-[#D4AF37]/3 pointer-events-none" />

      <div className="relative w-full max-w-lg">
        <div className="mb-6">
          <span className="inline-block text-[#D4AF37] text-xs font-semibold tracking-[0.35em] uppercase bg-[#D4AF37]/8 px-4 py-2 rounded-full">
            Certificaciones
          </span>
          <h3 className="text-2xl font-light text-[#333333] mt-3 leading-snug">
            Formación avalada <br />
            <span className="text-[#D4AF37] font-semibold">internacionalmente</span>
          </h3>
        </div>

        <div
          className="relative w-full rounded-2xl overflow-hidden"
          style={{ boxShadow: '0 0 0 1px rgba(212,175,55,0.25), 0 20px 60px rgba(0,0,0,0.12)' }}
        >
          <Image
            src="/certificadopro.jpeg"
            alt="Certificado profesional Dra. Ana Cristina Faber"
            width={1972}
            height={1408}
            className="w-full h-auto"
            sizes="(max-width: 1024px) 90vw, 45vw"
          />
        </div>
      </div>
    </div>

  </section>
);
