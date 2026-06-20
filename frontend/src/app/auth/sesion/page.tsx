'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, FormEvent, Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Campo } from '@/components/ui/Campo';
import { Boton } from '@/components/ui/Boton';
import { ErrorAPI } from '@/lib/api';

function ContenidoSesion() {
  const { iniciarSesion, autenticado, esAdmin } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sesionExpirada = searchParams.get('expirada') === '1';
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (autenticado) {
      router.push(esAdmin ? '/admin' : '/paciente/citas');
    }
  }, [autenticado, esAdmin, router]);

  const manejarEnvio = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      await iniciarSesion(correo, contrasena);
      // La redirección la maneja el useEffect cuando autenticado cambia a true
    } catch (err) {
      setError(err instanceof ErrorAPI ? err.message : 'Ocurrió un error. Intenta nuevamente.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div>
      {sesionExpirada && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3.5 flex items-start gap-3">
          <span className="text-amber-500 shrink-0 mt-0.5">⏰</span>
          <p className="text-sm text-amber-700">Tu sesión ha expirado. Inicia sesión nuevamente.</p>
        </div>
      )}
      <div className="mb-10">
        <span className="inline-block text-[#D4AF37] text-xs font-semibold tracking-[0.3em] uppercase mb-3 bg-[#D4AF37]/8 px-3 py-1.5 rounded-full">
          Acceso
        </span>
        <h2 className="text-3xl font-light text-[#333333] mt-3 mb-1">Bienvenida de vuelta</h2>
        <p className="text-sm text-gray-400 font-light">Ingresa para gestionar tus citas</p>
      </div>

      <form onSubmit={manejarEnvio} className="flex flex-col gap-5">
        <Campo
          etiqueta="Correo electrónico"
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          placeholder="tucorreo@email.com"
          required
          autoComplete="email"
        />
        <Campo
          etiqueta="Contraseña"
          type="password"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          placeholder="••••••••"
          required
          autoComplete="current-password"
        />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3.5">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <Boton type="submit" variante="primario" tamano="lg" cargando={cargando} className="w-full mt-2">
          Iniciar sesión
        </Boton>
      </form>

      <div className="text-center mt-6">
        <Link href="/auth/recuperar" className="text-sm text-gray-500 hover:text-[#D4AF37] transition-colors">
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

      <p className="text-center text-sm text-gray-400 mt-6 font-light">
        ¿No tienes cuenta?{' '}
        <Link href="/auth/registro" className="text-[#D4AF37] hover:underline font-medium">
          Regístrate aquí
        </Link>
      </p>

      <div className="mt-5 text-center">
        <Link href="/inicio" className="text-xs text-gray-400 hover:text-gray-500 transition-colors">
          ← Volver al inicio
        </Link>
      </div>
    </div>
  );
}

export default function PaginaInicioSesion() {
  return (
    <Suspense>
      <ContenidoSesion />
    </Suspense>
  );
}
