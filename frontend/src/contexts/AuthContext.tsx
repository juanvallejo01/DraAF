'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Usuario, RespuestaAPI } from '@/types';
import { api, ErrorAPI } from '@/lib/api';

interface SesionAuth {
  token: string;
  usuario: Usuario;
}

interface ContextoAuth {
  usuario: Usuario | null;
  token: string | null;
  cargando: boolean;
  iniciarSesion: (correo: string, contrasena: string) => Promise<void>;
  registrar: (datos: DatosRegistro) => Promise<void>;
  cerrarSesion: () => void;
  actualizarUsuario: (datos: Partial<Usuario>) => void;
  esAdmin: boolean;
  autenticado: boolean;
}

interface DatosRegistro {
  nombreCompleto: string;
  documentoIdentidad: string;
  correoElectronico: string;
  numeroWhatsApp: string;
  contrasena: string;
}

const ContextoAutenticacion = createContext<ContextoAuth | null>(null);

export const ProveedorAuth = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const tokenGuardado = localStorage.getItem('draaf_token');
    const usuarioGuardado = localStorage.getItem('draaf_usuario');

    if (tokenGuardado && usuarioGuardado) {
      try {
        setToken(tokenGuardado);
        setUsuario(JSON.parse(usuarioGuardado));
      } catch {
        localStorage.removeItem('draaf_token');
        localStorage.removeItem('draaf_usuario');
      }
    }
    setCargando(false);
  }, []);

  const guardarSesion = (sesion: SesionAuth) => {
    localStorage.setItem('draaf_token', sesion.token);
    localStorage.setItem('draaf_usuario', JSON.stringify(sesion.usuario));
    setToken(sesion.token);
    setUsuario(sesion.usuario);
  };

  const iniciarSesion = async (correoElectronico: string, contrasena: string): Promise<void> => {
    const respuesta = await api.post<RespuestaAPI<SesionAuth>>(
      '/auth/sesion',
      { correoElectronico, contrasena },
      false
    );
    if (!respuesta.datos) throw new ErrorAPI('Respuesta inválida del servidor', 500);
    guardarSesion(respuesta.datos);
  };

  const registrar = async (datos: DatosRegistro): Promise<void> => {
    const respuesta = await api.post<RespuestaAPI<SesionAuth>>('/auth/registro', datos, false);
    if (!respuesta.datos) throw new ErrorAPI('Respuesta inválida del servidor', 500);
    guardarSesion(respuesta.datos);
  };

  const cerrarSesion = () => {
    localStorage.removeItem('draaf_token');
    localStorage.removeItem('draaf_usuario');
    setToken(null);
    setUsuario(null);
  };

  const actualizarUsuario = (datos: Partial<Usuario>) => {
    setUsuario((prev) => {
      if (!prev) return prev;
      const actualizado = { ...prev, ...datos };
      localStorage.setItem('draaf_usuario', JSON.stringify(actualizado));
      return actualizado;
    });
  };

  return (
    <ContextoAutenticacion.Provider
      value={{
        usuario,
        token,
        cargando,
        iniciarSesion,
        registrar,
        cerrarSesion,
        actualizarUsuario,
        esAdmin: usuario?.rol === 'ADMIN',
        autenticado: !!usuario,
      }}
    >
      {children}
    </ContextoAutenticacion.Provider>
  );
};

export const useAuth = (): ContextoAuth => {
  const contexto = useContext(ContextoAutenticacion);
  if (!contexto) throw new Error('useAuth debe usarse dentro de ProveedorAuth');
  return contexto;
};
