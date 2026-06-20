import Link from 'next/link';

export default function PaginaNoEncontrada() {
  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <div className="text-center max-w-md">
        <p className="text-[#D4AF37] text-xs font-semibold tracking-[0.35em] uppercase mb-6 bg-[#D4AF37]/8 px-4 py-2 rounded-full inline-block">
          Error 404
        </p>
        <h1 className="text-6xl font-light text-[#333333] mb-4">
          Dra. <span className="text-[#D4AF37] font-semibold">AF</span>
        </h1>
        <p className="text-gray-400 text-lg font-light mb-2">Página no encontrada</p>
        <p className="text-gray-400 text-sm font-light leading-relaxed mb-10">
          La página que buscas no existe o fue movida.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/inicio"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#D4AF37] text-white text-sm font-medium hover:bg-[#C9A430] transition-colors"
          >
            Ir al inicio
          </Link>
          <Link
            href="/paciente/citas"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-full border-2 border-[#D4AF37] text-[#D4AF37] text-sm font-medium hover:bg-[#D4AF37]/8 transition-colors"
          >
            Mis citas
          </Link>
        </div>
      </div>
    </div>
  );
}
