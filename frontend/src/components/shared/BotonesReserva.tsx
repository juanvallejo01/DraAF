import Link from 'next/link';
import { Boton } from '@/components/ui/Boton';

interface Props {
  tamano?: 'md' | 'lg';
  textoBoton?: string;
}

export const BotonContactar = ({ tamano = 'lg', textoBoton = 'Contáctanos' }: Props) => (
  <Link href="/inicio#contacto">
    <Boton variante="primario" tamano={tamano}>{textoBoton}</Boton>
  </Link>
);
