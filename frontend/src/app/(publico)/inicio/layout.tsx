import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Inicio',
  description:
    'Bienvenida a Dra. AF, tu clínica de medicina estética de confianza. Tratamientos personalizados para realzar tu belleza natural con los más altos estándares médicos.',
  openGraph: {
    title: 'Dra. AF | Medicina Estética de Alta Gama',
    description:
      'Tu belleza, nuestra ciencia. Tratamientos estéticos de vanguardia con resultados naturales y duraderos.',
    url: '/',
  },
};

export default function LayoutInicio({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
