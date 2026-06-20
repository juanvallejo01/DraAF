'use client';

import { Boton } from './Boton';

interface Props {
  abierto: boolean;
  titulo: string;
  mensaje: string;
  textoCancelar?: string;
  textoConfirmar?: string;
  variante?: 'peligro' | 'primario';
  cargando?: boolean;
  onCancelar: () => void;
  onConfirmar: () => void;
}

export const DialogoConfirmar = ({
  abierto,
  titulo,
  mensaje,
  textoCancelar = 'No, volver',
  textoConfirmar = 'Sí, confirmar',
  variante = 'peligro',
  cargando = false,
  onCancelar,
  onConfirmar,
}: Props) => {
  if (!abierto) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animar-fade"
      onClick={(e) => { if (e.target === e.currentTarget) onCancelar(); }}
    >
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 animar-slide">
        <div className="mb-1">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-4 ${
            variante === 'peligro' ? 'bg-red-50' : 'bg-[#D4AF37]/10'
          }`}>
            <span className={`text-lg ${variante === 'peligro' ? 'text-red-500' : 'text-[#D4AF37]'}`}>
              {variante === 'peligro' ? '!' : '◈'}
            </span>
          </div>
          <h3 className="text-base font-semibold text-[#333333] mb-2">{titulo}</h3>
          <p className="text-sm text-gray-500 leading-relaxed">{mensaje}</p>
        </div>

        <div className="flex gap-3 mt-6">
          <Boton
            variante="fantasma"
            tamano="md"
            className="flex-1"
            onClick={onCancelar}
            disabled={cargando}
          >
            {textoCancelar}
          </Boton>
          <Boton
            variante={variante}
            tamano="md"
            className="flex-1"
            cargando={cargando}
            onClick={onConfirmar}
          >
            {textoConfirmar}
          </Boton>
        </div>
      </div>
    </div>
  );
};
