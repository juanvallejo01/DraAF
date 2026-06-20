'use client';

import { useState } from 'react';
import Link from 'next/link';
import { api, ErrorAPI } from '@/lib/api';
import { Boton } from '@/components/ui/Boton';
import { Campo } from '@/components/ui/Campo';
import { Tarjeta } from '@/components/ui/Tarjeta';

export default function RecuperarPassword() {
  const [correo, setCorreo] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setError('');
    
    try {
      await api.post('/auth/olvide-password', { correoElectronico: correo });
      setExito(true);
    } catch (err) {
      if (err instanceof ErrorAPI) setError(err.message);
      else setError('Error al solicitar recuperación');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <Tarjeta>
        <h1 className="text-2xl font-light text-center mb-6 text-[#333333]">Recuperar contraseña</h1>
        
        {exito ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-emerald-600 text-2xl">✓</span>
            </div>
            <p className="text-gray-600 mb-6">
              Si el correo está registrado, recibirás un mensaje de WhatsApp con un código para restablecer tu contraseña.
            </p>
            <Link href="/auth/restablecer">
              <Boton variante="primario" className="w-full text-center block">
                Ingresar código
              </Boton>
            </Link>
          </div>
        ) : (
          <form onSubmit={enviar} className="space-y-4">
            <p className="text-sm text-gray-500 mb-4 text-center">
              Ingresa tu correo electrónico registrado y te enviaremos un código de recuperación por WhatsApp.
            </p>
            
            <Campo
              etiqueta="Correo electrónico"
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
              placeholder="tu@correo.com"
            />
            
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl">
                {error}
              </div>
            )}
            
            <Boton type="submit" variante="primario" className="w-full" cargando={cargando}>
              Enviar instrucciones
            </Boton>
            
            <div className="text-center mt-4">
              <Link href="/auth/sesion" className="text-sm text-gray-500 hover:text-[#D4AF37]">
                Volver a iniciar sesión
              </Link>
            </div>
          </form>
        )}
      </Tarjeta>
    </div>
  );
}
