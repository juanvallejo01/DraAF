'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Campo } from '@/components/ui/Campo';
import { Boton } from '@/components/ui/Boton';
import { ErrorAPI } from '@/lib/api';

export default function PaginaRegistro() {
  const { registrar } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    nombreCompleto: '',
    documentoIdentidad: '',
    correoElectronico: '',
    numeroWhatsApp: '',
    contrasena: '',
  });
  const [error, setError] = useState('');
  const [errores, setErrores] = useState<string[]>([]);
  const [cargando, setCargando] = useState(false);

  const actualizar = (campo: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [campo]: e.target.value }));

  const manejarEnvio = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setErrores([]);
    setCargando(true);
    try {
      await registrar(form);
      router.push('/paciente/citas');
    } catch (err) {
      if (err instanceof ErrorAPI) {
        setError(err.message);
        if (err.errores) setErrores(err.errores);
      } else {
        setError('Ocurrió un error. Intenta nuevamente.');
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <span className="inline-block text-[#D4AF37] text-xs font-semibold tracking-[0.3em] uppercase mb-3 bg-[#D4AF37]/8 px-3 py-1.5 rounded-full">
          Crear cuenta
        </span>
        <h2 className="text-3xl font-light text-[#333333] mt-3 mb-1">Regístrate</h2>
        <p className="text-sm text-gray-400 font-light">Completa tus datos para reservar tu primera cita</p>
      </div>

      <form onSubmit={manejarEnvio} className="flex flex-col gap-4">
        <Campo etiqueta="Nombre completo" type="text" value={form.nombreCompleto} onChange={actualizar('nombreCompleto')} placeholder="María González" required autoComplete="name" />
        <Campo etiqueta="Documento de identidad" type="text" value={form.documentoIdentidad} onChange={actualizar('documentoIdentidad')} placeholder="1234567890" required />
        <Campo etiqueta="Correo electrónico" type="email" value={form.correoElectronico} onChange={actualizar('correoElectronico')} placeholder="tucorreo@email.com" required autoComplete="email" />
        <Campo etiqueta="Número de WhatsApp" type="tel" value={form.numeroWhatsApp} onChange={actualizar('numeroWhatsApp')} placeholder="+57 300 000 0000" required descripcion="Recibirás la confirmación de tu cita por este número" />
        <Campo etiqueta="Contraseña" type="password" value={form.contrasena} onChange={actualizar('contrasena')} placeholder="Mínimo 8 caracteres" required autoComplete="new-password" />

        {(error || errores.length > 0) && (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3.5">
            <p className="text-sm text-red-600 font-medium">{error}</p>
            {errores.map((e, i) => <p key={i} className="text-xs text-red-500 mt-1">• {e}</p>)}
          </div>
        )}

        <Boton type="submit" variante="primario" tamano="lg" cargando={cargando} className="w-full mt-2">
          Crear cuenta
        </Boton>
      </form>

      <p className="text-center text-sm text-gray-400 mt-7 font-light">
        ¿Ya tienes cuenta?{' '}
        <Link href="/auth/sesion" className="text-[#D4AF37] hover:underline font-medium">
          Inicia sesión
        </Link>
      </p>
      <div className="mt-4 text-center">
        <Link href="/inicio" className="text-xs text-gray-400 hover:text-gray-500 transition-colors">
          ← Volver al inicio
        </Link>
      </div>
    </div>
  );
}
