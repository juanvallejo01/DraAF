'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api, ErrorAPI } from '@/lib/api';
import { RespuestaAPI, Usuario } from '@/types';
import { Tarjeta, EncabezadoTarjeta } from '@/components/ui/Tarjeta';
import { Boton } from '@/components/ui/Boton';
import { Campo } from '@/components/ui/Campo';

interface FormDatos {
  nombreCompleto: string;
  numeroWhatsApp: string;
}

interface FormContrasena {
  contrasenaActual: string;
  contrasenaNueva: string;
  confirmarContrasena: string;
}

export default function PaginaPerfil() {
  const { usuario, actualizarUsuario } = useAuth();

  const [formDatos, setFormDatos] = useState<FormDatos>({
    nombreCompleto: usuario?.nombreCompleto ?? '',
    numeroWhatsApp: usuario?.numeroWhatsApp ?? '',
  });

  const [formContrasena, setFormContrasena] = useState<FormContrasena>({
    contrasenaActual: '',
    contrasenaNueva: '',
    confirmarContrasena: '',
  });

  const [guardandoDatos, setGuardandoDatos] = useState(false);
  const [guardandoContrasena, setGuardandoContrasena] = useState(false);
  const [exitoDatos, setExitoDatos] = useState('');
  const [exitoContrasena, setExitoContrasena] = useState('');
  const [errorDatos, setErrorDatos] = useState('');
  const [errorContrasena, setErrorContrasena] = useState('');

  const guardarDatos = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardandoDatos(true);
    setErrorDatos('');
    setExitoDatos('');
    try {
      const resp = await api.patch<RespuestaAPI<Usuario>>('/auth/perfil', {
        nombreCompleto: formDatos.nombreCompleto,
        numeroWhatsApp: formDatos.numeroWhatsApp,
      });
      if (resp.datos) actualizarUsuario(resp.datos);
      setExitoDatos('Datos actualizados correctamente');
    } catch (err) {
      setErrorDatos(err instanceof ErrorAPI ? err.message : 'Error al actualizar. Intenta nuevamente.');
    } finally {
      setGuardandoDatos(false);
    }
  };

  const guardarContrasena = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formContrasena.contrasenaNueva !== formContrasena.confirmarContrasena) {
      setErrorContrasena('Las contraseñas no coinciden');
      return;
    }
    setGuardandoContrasena(true);
    setErrorContrasena('');
    setExitoContrasena('');
    try {
      await api.patch('/auth/perfil', {
        contrasenaActual: formContrasena.contrasenaActual,
        contrasenaNueva: formContrasena.contrasenaNueva,
      });
      setExitoContrasena('Contraseña actualizada correctamente');
      setFormContrasena({ contrasenaActual: '', contrasenaNueva: '', confirmarContrasena: '' });
    } catch (err) {
      setErrorContrasena(err instanceof ErrorAPI ? err.message : 'Error al actualizar. Intenta nuevamente.');
    } finally {
      setGuardandoContrasena(false);
    }
  };

  const actualDatos = (campo: keyof FormDatos) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormDatos((p) => ({ ...p, [campo]: e.target.value }));

  const actualContrasena = (campo: keyof FormContrasena) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormContrasena((p) => ({ ...p, [campo]: e.target.value }));

  return (
    <div className="max-w-2xl mx-auto">
      {/* Encabezado */}
      <div className="mb-8">
        <span className="inline-block text-[#D4AF37] text-xs font-semibold tracking-[0.3em] uppercase mb-2 bg-[#D4AF37]/8 px-3 py-1.5 rounded-full">
          Mi cuenta
        </span>
        <h1 className="text-3xl font-light text-[#333333] mt-2">Mi perfil</h1>
      </div>

      {/* Avatar y email (solo lectura) */}
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
            Paciente
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {/* Datos personales */}
        <Tarjeta>
          <EncabezadoTarjeta
            titulo="Datos personales"
            descripcion="Actualiza tu nombre y número de WhatsApp."
          />
          <form onSubmit={guardarDatos} className="flex flex-col gap-4">
            <Campo
              etiqueta="Nombre completo"
              type="text"
              value={formDatos.nombreCompleto}
              onChange={actualDatos('nombreCompleto')}
              required
            />
            <Campo
              etiqueta="Número de WhatsApp"
              type="tel"
              value={formDatos.numeroWhatsApp}
              onChange={actualDatos('numeroWhatsApp')}
              placeholder="573001234567"
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

            {exitoDatos && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                <p className="text-sm text-emerald-700">✓ {exitoDatos}</p>
              </div>
            )}
            {errorDatos && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <p className="text-sm text-red-600">{errorDatos}</p>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Boton variante="primario" cargando={guardandoDatos} type="submit">
                Guardar cambios
              </Boton>
            </div>
          </form>
        </Tarjeta>

        {/* Cambiar contraseña */}
        <Tarjeta>
          <EncabezadoTarjeta
            titulo="Cambiar contraseña"
            descripcion="Mínimo 8 caracteres."
          />
          <form onSubmit={guardarContrasena} className="flex flex-col gap-4">
            <Campo
              etiqueta="Contraseña actual"
              type="password"
              value={formContrasena.contrasenaActual}
              onChange={actualContrasena('contrasenaActual')}
              required
            />
            <Campo
              etiqueta="Nueva contraseña"
              type="password"
              value={formContrasena.contrasenaNueva}
              onChange={actualContrasena('contrasenaNueva')}
              required
            />
            <Campo
              etiqueta="Confirmar nueva contraseña"
              type="password"
              value={formContrasena.confirmarContrasena}
              onChange={actualContrasena('confirmarContrasena')}
              required
            />

            {exitoContrasena && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                <p className="text-sm text-emerald-700">✓ {exitoContrasena}</p>
              </div>
            )}
            {errorContrasena && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <p className="text-sm text-red-600">{errorContrasena}</p>
              </div>
            )}

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
