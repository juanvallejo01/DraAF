'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api, ErrorAPI } from '@/lib/api';
import { Boton } from '@/components/ui/Boton';
import { Campo } from '@/components/ui/Campo';
import { Tarjeta } from '@/components/ui/Tarjeta';
import { useToast } from '@/contexts/ToastContext';

export default function RestablecerPassword() {
  const router = useRouter();
  const { mostrarToast } = useToast();
  
  const [form, setForm] = useState({ correoElectronico: '', codigo: '', contrasenaNueva: '' });
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const actualizar = (campo: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [campo]: e.target.value }));
  };

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setError('');
    
    try {
      await api.post('/auth/restablecer-password', form);
      mostrarToast('Contraseña restablecida con éxito. Ya puedes iniciar sesión.', 'exito');
      router.push('/auth/sesion');
    } catch (err) {
      if (err instanceof ErrorAPI) setError(err.message);
      else setError('Error al restablecer contraseña');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <Tarjeta>
        <h1 className="text-2xl font-light text-center mb-6 text-[#333333]">Nueva contraseña</h1>
        
        <form onSubmit={enviar} className="space-y-4">
          <Campo
            etiqueta="Correo electrónico"
            type="email"
            value={form.correoElectronico}
            onChange={actualizar('correoElectronico')}
            required
            placeholder="tu@correo.com"
          />
          
          <Campo
            etiqueta="Código de 6 dígitos"
            type="text"
            value={form.codigo}
            onChange={actualizar('codigo')}
            required
            placeholder="123456"
            maxLength={6}
          />
          
          <Campo
            etiqueta="Nueva contraseña"
            type="password"
            value={form.contrasenaNueva}
            onChange={actualizar('contrasenaNueva')}
            required
            placeholder="Mínimo 8 caracteres"
          />
          
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl">
              {error}
            </div>
          )}
          
          <Boton type="submit" variante="primario" className="w-full" cargando={cargando}>
            Restablecer contraseña
          </Boton>
          
          <div className="text-center mt-4">
            <Link href="/auth/sesion" className="text-sm text-gray-500 hover:text-[#D4AF37]">
              Volver a iniciar sesión
            </Link>
          </div>
        </form>
      </Tarjeta>
    </div>
  );
}
