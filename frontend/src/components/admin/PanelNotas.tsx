'use client';

import { useState } from 'react';
import { Cita } from '@/types';
import { api, ErrorAPI } from '@/lib/api';
import { Boton } from '@/components/ui/Boton';
import { useToast } from '@/contexts/ToastContext';

interface Props {
  cita: Cita;
  onActualizar: () => void;
}

export function PanelNotas({ cita, onActualizar }: Props) {
  const { mostrarToast } = useToast();
  const [abierto, setAbierto] = useState(false);
  const [texto, setTexto] = useState(cita.notasAdmin ?? '');
  const [guardando, setGuardando] = useState(false);

  const guardar = async () => {
    setGuardando(true);
    try {
      await api.patch(`/citas/admin/${cita._id}/notas`, { notasAdmin: texto });
      mostrarToast('Nota guardada', 'exito');
      setAbierto(false);
      onActualizar();
    } catch (err) {
      if (err instanceof ErrorAPI) mostrarToast(err.message, 'error');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="mt-3 pt-3 border-t border-gray-50">
      <button
        onClick={() => { setAbierto((p) => !p); setTexto(cita.notasAdmin ?? ''); }}
        className="text-xs text-gray-400 hover:text-[#333333] transition-colors flex items-center gap-1.5"
      >
        <span>{abierto ? '▲' : '▼'}</span>
        {cita.notasAdmin ? 'Ver / editar nota' : 'Agregar nota interna'}
        {cita.notasAdmin && !abierto && (
          <span className="ml-1 w-2 h-2 rounded-full bg-[#D4AF37] inline-block" />
        )}
      </button>
      {abierto && (
        <div className="mt-2 animar-slide">
          {cita.historialEstados && cita.historialEstados.length > 0 && (
            <div className="mb-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <h4 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Historial de estados</h4>
              <div className="flex flex-col gap-1.5">
                {cita.historialEstados.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
                    <span className="font-medium text-[#333333]">{h.estado}</span>
                    <span className="text-gray-400">— {new Date(h.fecha).toLocaleString('es')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            rows={2}
            maxLength={500}
            placeholder="Notas internas (solo visibles para el admin)…"
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-[#333333] placeholder:text-gray-400 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 resize-none"
          />
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-xs text-gray-300">{texto.length}/500</span>
            <div className="flex gap-2">
              <button
                onClick={() => setAbierto(false)}
                className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1"
              >
                Cancelar
              </button>
              <Boton variante="primario" tamano="sm" cargando={guardando} onClick={guardar}>
                Guardar
              </Boton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
