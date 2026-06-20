'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Boton } from '@/components/ui/Boton';
import { ModalAuth } from '@/components/ui/ModalAuth';

interface Props {
  tamano?: 'md' | 'lg';
  textoBoton?: string;
}

export const BotonReservar = ({ tamano = 'lg', textoBoton = 'Reservar cita' }: Props) => {
  const { autenticado } = useAuth();
  const router = useRouter();
  const [modalAbierto, setModalAbierto] = useState(false);

  const manejarClick = () => {
    if (autenticado) {
      router.push('/paciente/reservar');
    } else {
      setModalAbierto(true);
    }
  };

  return (
    <>
      <Boton variante="primario" tamano={tamano} onClick={manejarClick}>
        {textoBoton}
      </Boton>
      <ModalAuth
        abierto={modalAbierto}
        onCerrar={() => setModalAbierto(false)}
        destino="/paciente/reservar"
      />
    </>
  );
};
