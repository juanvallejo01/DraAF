export const Cargando = ({ mensaje = 'Cargando...' }: { mensaje?: string }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-12">
    <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
    <p className="text-sm text-gray-500">{mensaje}</p>
  </div>
);

export const CargandoPantalla = () => (
  <div className="fixed inset-0 bg-[#FAFAFA] flex items-center justify-center z-50">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-gray-500 tracking-wide">Cargando plataforma...</p>
    </div>
  </div>
);
