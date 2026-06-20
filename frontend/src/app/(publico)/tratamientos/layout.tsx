import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tratamientos',
  description:
    'Descubre nuestro catálogo completo de tratamientos estéticos: ácido hialurónico, toxina botulínica, bioestimulación con PRP, mesoterapia, peeling químico, hilos tensores y más.',
  openGraph: {
    title: 'Tratamientos | Dra. AF',
    description:
      'Catálogo completo de procedimientos estéticos de vanguardia. Resultados naturales avalados con los más altos estándares médicos.',
    url: '/tratamientos',
  },
};

export default function LayoutTratamientos({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
