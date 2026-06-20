import { useState, useCallback } from 'react';
import { api, ErrorAPI } from '@/lib/api';

interface State<T> {
  datos: T | null;
  cargando: boolean;
  error: string | null;
}

export function useApi<T>() {
  const [estado, setEstado] = useState<State<T>>({
    datos: null,
    cargando: false,
    error: null,
  });

  const ejecutar = useCallback(async (
    metodo: 'get' | 'post' | 'put' | 'patch' | 'delete',
    ruta: string,
    body?: any,
    requiereAuth = true
  ) => {
    setEstado((prev) => ({ ...prev, cargando: true, error: null }));
    try {
      let resp;
      switch (metodo) {
        case 'get': resp = await api.get<any>(ruta, requiereAuth); break;
        case 'post': resp = await api.post<any>(ruta, body, requiereAuth); break;
        case 'put': resp = await api.put<any>(ruta, body, requiereAuth); break;
        case 'patch': resp = await api.patch<any>(ruta, body, requiereAuth); break;
        case 'delete': resp = await api.delete<any>(ruta, requiereAuth); break;
      }
      setEstado({ datos: resp.datos ?? resp, cargando: false, error: null });
      return resp.datos ?? resp;
    } catch (err) {
      const msj = err instanceof ErrorAPI ? err.message : 'Error inesperado';
      setEstado({ datos: null, cargando: false, error: msj });
      throw err;
    }
  }, []);

  return { ...estado, ejecutar };
}
