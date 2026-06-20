'use client';

import { useEffect, useState } from 'react';
import { Tratamiento, RespuestaAPI } from '@/types';
import { api, ErrorAPI } from '@/lib/api';
import { Tarjeta, EncabezadoTarjeta } from '@/components/ui/Tarjeta';
import { Boton } from '@/components/ui/Boton';
import { Campo } from '@/components/ui/Campo';
import { Cargando } from '@/components/ui/Cargando';
import { DialogoConfirmar } from '@/components/ui/DialogoConfirmar';

interface FormTratamiento {
  nombre: string;
  descripcion: string;
  duracionMinutos: string;
  imagen: string;
}

const FORM_VACIO: FormTratamiento = { nombre: '', descripcion: '', duracionMinutos: '', imagen: '' };

export default function PaginaAdminTratamientos() {
  const [tratamientos, setTratamientos] = useState<Tratamiento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [form, setForm] = useState<FormTratamiento>(FORM_VACIO);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);
  const [tratamientoADesactivar, setTratamientoADesactivar] = useState<string | null>(null);
  const [desactivando, setDesactivando] = useState(false);

  const cargar = async () => {
    const resp = await api.get<RespuestaAPI<Tratamiento[]>>('/tratamientos?todos=true');
    setTratamientos(resp.datos ?? []);
  };

  useEffect(() => { cargar().finally(() => setCargando(false)); }, []);

  const actualizar = (campo: keyof FormTratamiento) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [campo]: e.target.value }));
  };

  const abrirEdicion = (t: Tratamiento) => {
    setForm({
      nombre: t.nombre,
      descripcion: t.descripcion,
      duracionMinutos: String(t.duracionMinutos),
      imagen: t.imagen ?? '',
    });
    setEditandoId(t._id);
    setMostrarForm(true);
  };

  const cerrarForm = () => {
    setForm(FORM_VACIO);
    setEditandoId(null);
    setMostrarForm(false);
    setError('');
  };

  const guardar = async () => {
    setGuardando(true);
    setError('');
    const datos = {
      ...form,
      duracionMinutos: parseInt(form.duracionMinutos, 10),
      imagen: form.imagen || undefined,
    };

    try {
      if (editandoId) {
        await api.patch(`/tratamientos/${editandoId}`, datos);
      } else {
        await api.post('/tratamientos', datos);
      }
      await cargar();
      cerrarForm();
    } catch (err) {
      if (err instanceof ErrorAPI) setError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  const confirmarDesactivar = async () => {
    if (!tratamientoADesactivar) return;
    setDesactivando(true);
    try {
      await api.delete(`/tratamientos/${tratamientoADesactivar}`);
      await cargar();
    } finally {
      setTratamientoADesactivar(null);
      setDesactivando(false);
    }
  };

  const reactivar = async (id: string) => {
    try {
      await api.patch(`/tratamientos/${id}`, { activo: true });
      await cargar();
    } catch {
      // noop — server error will be silent; refresh shows actual state
    }
  };

  if (cargando) return <Cargando />;

  return (
    <div>
      <DialogoConfirmar
        abierto={!!tratamientoADesactivar}
        titulo="Desactivar tratamiento"
        mensaje="¿Deseas desactivar este tratamiento? No aparecerá disponible para nuevas reservas."
        textoConfirmar="Desactivar"
        textoCancelar="Cancelar"
        variante="peligro"
        cargando={desactivando}
        onCancelar={() => setTratamientoADesactivar(null)}
        onConfirmar={confirmarDesactivar}
      />

      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="inline-block text-[#D4AF37] text-xs font-semibold tracking-[0.3em] uppercase mb-2 bg-[#D4AF37]/8 px-3 py-1.5 rounded-full">
            Catálogo
          </span>
          <h1 className="text-3xl font-light text-[#333333] mt-2">Tratamientos</h1>
        </div>
        <Boton variante="primario" onClick={() => setMostrarForm(true)}>+ Nuevo tratamiento</Boton>
      </div>

      {mostrarForm && (
        <Tarjeta className="mb-6">
          <EncabezadoTarjeta
            titulo={editandoId ? 'Editar tratamiento' : 'Nuevo tratamiento'}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <Campo etiqueta="Nombre" type="text" value={form.nombre} onChange={actualizar('nombre')} required />
            <Campo etiqueta="Duración (minutos)" type="number" value={form.duracionMinutos} onChange={actualizar('duracionMinutos')} required />
          </div>
          <div className="mb-4">
            <label className="text-sm font-medium text-[#333333] block mb-1.5">Descripción <span className="text-[#D4AF37]">*</span></label>
            <textarea
              value={form.descripcion}
              onChange={actualizar('descripcion')}
              rows={3}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 resize-none"
            />
          </div>
          <Campo etiqueta="URL de imagen (opcional)" type="url" value={form.imagen} onChange={actualizar('imagen')} />
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mt-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          <div className="flex gap-3 mt-5">
            <Boton variante="primario" cargando={guardando} onClick={guardar}>Guardar</Boton>
            <Boton variante="fantasma" onClick={cerrarForm}>Cancelar</Boton>
          </div>
        </Tarjeta>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tratamientos.map((t) => (
          <Tarjeta key={t._id} className={!t.activo ? 'opacity-50' : ''}>
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-medium text-[#333333]">{t.nombre}</h3>
              {!t.activo && (
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Inactivo</span>
              )}
            </div>
            <p className="text-xs text-[#D4AF37] mb-2">{t.duracionMinutos} min</p>
            <p className="text-sm text-gray-500 text-sm leading-relaxed mb-4">{t.descripcion}</p>
            <div className="flex gap-2">
              <Boton variante="secundario" tamano="sm" onClick={() => abrirEdicion(t)}>Editar</Boton>
              {t.activo ? (
                <Boton variante="fantasma" tamano="sm" onClick={() => setTratamientoADesactivar(t._id)}>Desactivar</Boton>
              ) : (
                <Boton variante="primario" tamano="sm" onClick={() => reactivar(t._id)}>Reactivar</Boton>
              )}
            </div>
          </Tarjeta>
        ))}
      </div>
    </div>
  );
}
