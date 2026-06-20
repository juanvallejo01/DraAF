const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

const obtenerToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('draaf_token');
};

interface OpcionesFetch extends RequestInit {
  autenticado?: boolean;
}

export const api = {
  async solicitar<T>(ruta: string, opciones: OpcionesFetch = {}): Promise<T> {
    const { autenticado = true, ...fetchOpciones } = opciones;

    const encabezados: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(fetchOpciones.headers as Record<string, string>),
    };

    if (autenticado) {
      const token = obtenerToken();
      if (token) encabezados['Authorization'] = `Bearer ${token}`;
    }

    const respuesta = await fetch(`${BASE_URL}${ruta}`, {
      ...fetchOpciones,
      headers: encabezados,
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      if (respuesta.status === 401 && typeof window !== 'undefined') {
        const ruta = window.location.pathname;
        if (!ruta.startsWith('/auth')) {
          localStorage.removeItem('draaf_token');
          localStorage.removeItem('draaf_usuario');
          window.location.href = '/auth/sesion?expirada=1';
        }
      }
      throw new ErrorAPI(datos.mensaje ?? 'Error en la solicitud', respuesta.status, datos.errores);
    }

    return datos;
  },

  get<T>(ruta: string, autenticado = true) {
    return this.solicitar<T>(ruta, { method: 'GET', autenticado });
  },

  post<T>(ruta: string, cuerpo: unknown, autenticado = true) {
    return this.solicitar<T>(ruta, {
      method: 'POST',
      body: JSON.stringify(cuerpo),
      autenticado,
    });
  },

  patch<T>(ruta: string, cuerpo: unknown, autenticado = true) {
    return this.solicitar<T>(ruta, {
      method: 'PATCH',
      body: JSON.stringify(cuerpo),
      autenticado,
    });
  },

  delete<T>(ruta: string, autenticado = true) {
    return this.solicitar<T>(ruta, { method: 'DELETE', autenticado });
  },
};

export class ErrorAPI extends Error {
  constructor(
    mensaje: string,
    public codigoEstado: number,
    public errores?: string[]
  ) {
    super(mensaje);
    this.name = 'ErrorAPI';
  }
}
