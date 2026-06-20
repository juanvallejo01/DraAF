'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api, ErrorAPI } from '@/lib/api';
import { RespuestaAPI, Usuario } from '@/types';
import { Tarjeta, EncabezadoTarjeta } from '@/components/ui/Tarjeta';
import { Boton } from '@/components/ui/Boton';
import { Campo } from '@/components/ui/Campo';
import { useToast } from '@/contexts/ToastContext';

export default function PaginaPerfilAdmin() {
  const { usuario, actualizarUsuario } = useAuth();
  const { mostrarToast } = useToast();

  const [nombre, setNombre] = useState(usuario?.nombreCompleto ?? '');
  const [guardandoDatos, setGuardandoDatos] = useState(false);

  const [contrasenaActual, setContrasenaActual] = useState('');
  const [contrasenaNueva, setContrasenaNueva] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [guardandoContrasena, setGuardandoContrasena] = useState(false);

  const guardarDatos = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardandoDatos(true);
    try {
      const resp = await api.patch<RespuestaAPI<Usuario>>('/auth/perfil', { nombreCompleto: nombre });
      if (resp.datos) actualizarUsuario(resp.datos);
      mostrarToast('Nombre actualizado correctamente', 'exito');
    } catch (err) {
      mostrarToast(err instanceof ErrorAPI ? err.message : 'Error al actualizar', 'error');
    } finally {
      setGuardandoDatos(false);
    }
  };

  const guardarContrasena = async (e: React.FormEvent) => {
    e.preventDefault();
    if (contrasenaNueva !== confirmarContrasena) {
      mostrarToast('Las contraseñas no coinciden', 'error');
      return;
    }
    if (contrasenaNueva.length < 8) {
      mostrarToast('La nueva contraseña debe tener al menos 8 caracteres', 'error');
      return;
    }
    setGuardandoContrasena(true);
    try {
      await api.patch('/auth/perfil', { contrasenaActual, contrasenaNueva });
      mostrarToast('Contraseña actualizada correctamente', 'exito');
      setContrasenaActual('');
      setContrasenaNueva('');
      setConfirmarContrasena('');
    } catch (err) {
      mostrarToast(err instanceof ErrorAPI ? err.message : 'Error al actualizar', 'error');
    } finally {
      setGuardandoContrasena(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <span className="inline-block text-[#D4AF37] text-xs font-semibold tracking-[0.3em] uppercase mb-2 bg-[#D4AF37]/8 px-3 py-1.5 rounded-full">
          Administrador
        </span>
        <h1 className="text-3xl font-light text-[#333333] mt-2">Mi perfil</h1>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4 bg-white rounded-3xl border border-gray-100 shadow-sm px-6 py-5 mb-6">
        <div className="w-14 h-14 rounded-full bg-[#D4AF37]/15 flex items-center justify-center shrink-0">
          <span className="text-[#D4AF37] text-xl font-semibold">
            {usuario?.nombreCompleto.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-[#333333] truncate">{usuario?.nombreCompleto}</p>
          <p className="text-sm text-gray-400 truncate">{usuario?.correoElectronico}</p>
          <span className="inline-block text-xs bg-[#D4AF37]/10 text-[#D4AF37] px-2.5 py-0.5 rounded-full font-medium mt-1">
            Administrador
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {/* Nombre */}
        <Tarjeta>
          <EncabezadoTarjeta titulo="Datos de cuenta" descripcion="Actualiza tu nombre visible en el panel." />
          <form onSubmit={guardarDatos} className="flex flex-col gap-4">
            <Campo
              etiqueta="Nombre completo"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
            <Campo
              etiqueta="Correo electrónico"
              type="email"
              value={usuario?.correoElectronico ?? ''}
              onChange={() => {}}
              disabled
              className="opacity-50 cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 -mt-2">El correo no se puede modificar.</p>
            <div className="flex justify-end pt-2">
              <Boton variante="primario" cargando={guardandoDatos} type="submit">
                Guardar nombre
              </Boton>
            </div>
          </form>
        </Tarjeta>

        {/* Contraseña */}
        <Tarjeta>
          <EncabezadoTarjeta titulo="Cambiar contraseña" descripcion="Mínimo 8 caracteres." />
          <form onSubmit={guardarContrasena} className="flex flex-col gap-4">
            <Campo
              etiqueta="Contraseña actual"
              type="password"
              value={contrasenaActual}
              onChange={(e) => setContrasenaActual(e.target.value)}
              required
            />
            <Campo
              etiqueta="Nueva contraseña"
              type="password"
              value={contrasenaNueva}
              onChange={(e) => setContrasenaNueva(e.target.value)}
              required
            />
            <Campo
              etiqueta="Confirmar nueva contraseña"
              type="password"
              value={confirmarContrasena}
              onChange={(e) => setConfirmarContrasena(e.target.value)}
              required
            />
            <div className="flex justify-end pt-2">
              <Boton variante="primario" cargando={guardandoContrasena} type="submit">
                Cambiar contraseña
              </Boton>
            </div>
          </form>
        </Tarjeta>
      </div>
    </div>
  );
}
