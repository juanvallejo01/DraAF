'use client';

import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { RespuestaAPI } from '@/types';
import { api } from '@/lib/api';
import { Tarjeta } from '@/components/ui/Tarjeta';
import { Cargando } from '@/components/ui/Cargando';
import { Boton } from '@/components/ui/Boton';
import { useDebounce } from '@/hooks/useDebounce';

interface PacienteAdmin {
  _id: string;
  nombreCompleto: string;
  documentoIdentidad: string;
  correoElectronico: string;
  numeroWhatsApp: string;
  activo: boolean;
  creadoEn: string;
}

interface RespuestaPacientesPaginada {
  pacientes: PacienteAdmin[];
  total: number;
  pagina: number;
  limite: number;
  paginas: number;
}

const LIMITE = 20;

export default function PaginaAdminPacientes() {
  const [pacientes, setPacientes] = useState<PacienteAdmin[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [busquedaAplicada, setBusquedaAplicada] = useState('');
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [total, setTotal] = useState(0);

  const busquedaDebounced = useDebounce(busqueda, 500);

  useEffect(() => {
    if (busquedaDebounced !== busquedaAplicada) {
      setBusquedaAplicada(busquedaDebounced);
      setPagina(1);
    }
  }, [busquedaDebounced, busquedaAplicada]);

  const cargar = useCallback(async (paginaActual: number, textoBusqueda: string) => {
    setCargando(true);
    const params = new URLSearchParams();
    params.append('pagina', String(paginaActual));
    params.append('limite', String(LIMITE));
    if (textoBusqueda) params.append('busqueda', textoBusqueda);

    try {
      const resp = await api.get<RespuestaAPI<RespuestaPacientesPaginada>>(`/auth/admin/pacientes?${params}`);
      const datos = resp.datos;
      if (datos) {
        setPacientes(datos.pacientes);
        setTotalPaginas(datos.paginas);
        setTotal(datos.total);
      }
    } catch {
      setPacientes([]);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar(pagina, busquedaAplicada);
  }, [pagina, busquedaAplicada, cargar]);

  const irAPagina = (nueva: number) => {
    if (nueva < 1 || nueva > totalPaginas) return;
    setPagina(nueva);
  };

  return (
    <div>
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <span className="inline-block text-[#D4AF37] text-xs font-semibold tracking-[0.3em] uppercase mb-2 bg-[#D4AF37]/8 px-3 py-1.5 rounded-full">
            Gestión
          </span>
          <h1 className="text-3xl font-light text-[#333333] mt-2">Pacientes</h1>
        </div>
        {!cargando && (
          <div className="bg-white rounded-2xl border border-gray-100 px-4 py-2.5 text-center shadow-sm">
            <p className="text-xl font-semibold text-[#333333]">{total}</p>
            <p className="text-xs text-gray-400">Registrados</p>
          </div>
        )}
      </div>

      {/* Búsqueda */}
      <div className="relative mb-6 max-w-md">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 text-sm">◎</span>
        <input
          type="search"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre, correo o documento..."
          className="w-full rounded-xl border border-gray-200 pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37] bg-white"
        />
      </div>

      {cargando ? (
        <Cargando mensaje="Cargando pacientes..." />
      ) : pacientes.length === 0 ? (
        <Tarjeta className="text-center py-12">
          <p className="text-gray-400">No se encontraron pacientes</p>
        </Tarjeta>
      ) : (
        <>
          {/* Vista desktop: tabla */}
          <div className="hidden md:block bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-6">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50 bg-[#FAFAFA]">
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider py-3 px-5">Paciente</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider py-3 px-4">Documento</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider py-3 px-4">WhatsApp</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider py-3 px-4">Estado</th>
                  <th className="py-3 px-4" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {pacientes.map((p) => (
                  <tr key={p._id} className="hover:bg-[#FAFAFA] transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 flex items-center justify-center shrink-0">
                          <span className="text-[#D4AF37] text-xs font-semibold">
                            {p.nombreCompleto.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/admin/pacientes/${p._id}`}
                            className="text-sm font-medium text-[#333333] hover:text-[#D4AF37] transition-colors truncate block"
                          >
                            {p.nombreCompleto}
                          </Link>
                          <p className="text-xs text-gray-400 truncate">{p.correoElectronico}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-sm text-gray-500">{p.documentoIdentidad}</td>
                    <td className="py-3.5 px-4 text-sm text-gray-500">{p.numeroWhatsApp}</td>
                    <td className="py-3.5 px-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        p.activo
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {p.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/admin/citas?paciente=${p._id}&nombre=${encodeURIComponent(p.nombreCompleto)}`}
                        className="text-xs text-[#D4AF37] hover:underline font-medium"
                      >
                        Ver citas →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Vista mobile: tarjetas */}
          <div className="flex flex-col gap-3 md:hidden mb-6">
            {pacientes.map((p) => (
              <Tarjeta key={p._id}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#D4AF37]/10 flex items-center justify-center shrink-0">
                      <span className="text-[#D4AF37] text-sm font-semibold">
                        {p.nombreCompleto.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <Link
                        href={`/admin/pacientes/${p._id}`}
                        className="font-medium text-sm text-[#333333] hover:text-[#D4AF37] transition-colors block"
                      >
                        {p.nombreCompleto}
                      </Link>
                      <p className="text-xs text-gray-400 truncate">{p.correoElectronico}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{p.numeroWhatsApp}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                    p.activo ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {p.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                  <span className="text-xs text-gray-400">{p.documentoIdentidad}</span>
                  <Link
                    href={`/admin/citas?paciente=${p._id}&nombre=${encodeURIComponent(p.nombreCompleto)}`}
                    className="text-xs text-[#D4AF37] hover:underline font-medium"
                  >
                    Ver citas →
                  </Link>
                </div>
              </Tarjeta>
            ))}
          </div>

          {/* Paginación */}
          {totalPaginas > 1 && (
            <div className="flex items-center justify-center gap-3 mt-8">
              <Boton
                variante="fantasma"
                tamano="sm"
                onClick={() => irAPagina(pagina - 1)}
                disabled={pagina <= 1}
              >
                ← Anterior
              </Boton>
              <span className="text-sm text-gray-500">
                Página <span className="font-medium text-[#333333]">{pagina}</span> de {totalPaginas}
              </span>
              <Boton
                variante="fantasma"
                tamano="sm"
                onClick={() => irAPagina(pagina + 1)}
                disabled={pagina >= totalPaginas}
              >
                Siguiente →
              </Boton>
            </div>
          )}
        </>
      )}
    </div>
  );
}
