'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ErrorAPI } from '@/lib/api';
import { Campo } from './Campo';
import { Boton } from './Boton';

interface Props {
  abierto: boolean;
  onCerrar: () => void;
  destino?: string;
}

type Pestaña = 'sesion' | 'registro';

export const ModalAuth = ({ abierto, onCerrar, destino = '/paciente/reservar' }: Props) => {
  const { iniciarSesion, registrar } = useAuth();
  const router = useRouter();
  const [pestaña, setPestaña] = useState<Pestaña>('sesion');
  const [error, setError] = useState('');
  const [errores, setErrores] = useState<string[]>([]);
  const [cargando, setCargando] = useState(false);

  const [formSesion, setFormSesion] = useState({ correoElectronico: '', contrasena: '' });
  const [formRegistro, setFormRegistro] = useState({
    nombreCompleto: '',
    documentoIdentidad: '',
    correoElectronico: '',
    numeroWhatsApp: '',
    contrasena: '',
  });

  useEffect(() => {
    if (abierto) {
      setError('');
      setErrores([]);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [abierto]);

  useEffect(() => {
    setError('');
    setErrores([]);
  }, [pestaña]);

  if (!abierto) return null;

  const exitoAuth = () => {
    onCerrar();
    router.push(destino);
  };

  const manejarSesion = async (e: FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setError('');
    try {
      await iniciarSesion(formSesion.correoElectronico, formSesion.contrasena);
      exitoAuth();
    } catch (err) {
      setError(err instanceof ErrorAPI ? err.message : 'Error al iniciar sesión');
    } finally {
      setCargando(false);
    }
  };

  const manejarRegistro = async (e: FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setError('');
    setErrores([]);
    try {
      await registrar(formRegistro);
      exitoAuth();
    } catch (err) {
      if (err instanceof ErrorAPI) {
        setError(err.message);
        if (err.errores) setErrores(err.errores);
      } else {
        setError('Error al crear la cuenta');
      }
    } finally {
      setCargando(false);
    }
  };

  const actualizarSesion = (k: keyof typeof formSesion) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setFormSesion(p => ({ ...p, [k]: e.target.value }));

  const actualizarRegistro = (k: keyof typeof formRegistro) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setFormRegistro(p => ({ ...p, [k]: e.target.value }));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animar-fade"
      onClick={(e) => { if (e.target === e.currentTarget) onCerrar(); }}
    >
      {/* Fondo */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Panel */}
      <div className="relative w-full max-w-md bg-[#FAFAFA] rounded-3xl shadow-2xl overflow-hidden animar-slide">

        {/* Cabecera */}
        <div className="bg-[#333333] px-8 pt-8 pb-6">
          <button
            onClick={onCerrar}
            className="absolute top-4 right-5 text-white/40 hover:text-white text-2xl leading-none transition-colors"
            aria-label="Cerrar"
          >
            ×
          </button>
          <p className="text-[#D4AF37] text-xs font-medium tracking-[0.3em] uppercase mb-1">
            Para continuar
          </p>
          <h2 className="text-2xl font-light text-white">Reservar cita</h2>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-white">
          <button
            onClick={() => setPestaña('sesion')}
            className={`flex-1 py-3.5 text-sm font-medium transition-all ${
              pestaña === 'sesion'
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Ya tengo cuenta
          </button>
          <button
            onClick={() => setPestaña('registro')}
            className={`flex-1 py-3.5 text-sm font-medium transition-all ${
              pestaña === 'registro'
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Soy nuevo
          </button>
        </div>

        {/* Contenido */}
        <div className="px-8 py-6 max-h-[60vh] overflow-y-auto">

          {pestaña === 'sesion' ? (
            <form onSubmit={manejarSesion} className="flex flex-col gap-4">
              <p className="text-sm text-gray-500 mb-1">
                Ingresa con tu cuenta para continuar al proceso de reserva.
              </p>
              <Campo
                etiqueta="Correo electrónico"
                type="email"
                value={formSesion.correoElectronico}
                onChange={actualizarSesion('correoElectronico')}
                placeholder="tucorreo@email.com"
                required
                autoComplete="email"
              />
              <Campo
                etiqueta="Contraseña"
                type="password"
                value={formSesion.contrasena}
                onChange={actualizarSesion('contrasena')}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
              <Boton type="submit" variante="primario" tamano="lg" cargando={cargando} className="w-full mt-1">
                Iniciar sesión y reservar
              </Boton>
            </form>
          ) : (
            <form onSubmit={manejarRegistro} className="flex flex-col gap-4">
              <p className="text-sm text-gray-500 mb-1">
                Crea tu cuenta en segundos y reserva tu primera cita.
              </p>
              <Campo
                etiqueta="Nombre completo"
                type="text"
                value={formRegistro.nombreCompleto}
                onChange={actualizarRegistro('nombreCompleto')}
                placeholder="María González"
                required
                autoComplete="name"
              />
              <Campo
                etiqueta="Documento de identidad"
                type="text"
                value={formRegistro.documentoIdentidad}
                onChange={actualizarRegistro('documentoIdentidad')}
                placeholder="1234567890"
                required
              />
              <Campo
                etiqueta="Correo electrónico"
                type="email"
                value={formRegistro.correoElectronico}
                onChange={actualizarRegistro('correoElectronico')}
                placeholder="tucorreo@email.com"
                required
                autoComplete="email"
              />
              <Campo
                etiqueta="Número de WhatsApp"
                type="tel"
                value={formRegistro.numeroWhatsApp}
                onChange={actualizarRegistro('numeroWhatsApp')}
                placeholder="+57 300 000 0000"
                required
                descripcion="Recibirás la confirmación de tu cita por este número"
              />
              <Campo
                etiqueta="Contraseña"
                type="password"
                value={formRegistro.contrasena}
                onChange={actualizarRegistro('contrasena')}
                placeholder="Mínimo 8 caracteres"
                required
                autoComplete="new-password"
              />
              {(error || errores.length > 0) && (
                <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
                  <p className="text-sm text-red-600 font-medium">{error}</p>
                  {errores.map((e, i) => (
                    <p key={i} className="text-xs text-red-500 mt-1">• {e}</p>
                  ))}
                </div>
              )}
              <Boton type="submit" variante="primario" tamano="lg" cargando={cargando} className="w-full mt-1">
                Crear cuenta y reservar
              </Boton>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
