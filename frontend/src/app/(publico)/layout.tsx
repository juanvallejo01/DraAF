import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';

export const metadata: Metadata = {
  title: {
    default: 'Dra. AF | Medicina Estética',
    template: '%s | Dra. AF',
  },
  description:
    'Clínica de medicina estética de alta gama. Tratamientos faciales con los más altos estándares médicos: ácido hialurónico, toxina botulínica, bioestimulación y más. Reserva tu cita en minutos.',
  keywords: [
    'medicina estética',
    'tratamientos faciales',
    'ácido hialurónico',
    'botox',
    'bioestimulación',
    'mesoterapia',
    'peeling químico',
    'hilos tensores',
  ],
  authors: [{ name: 'Dra. AF' }],
  creator: 'Dra. AF',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    siteName: 'Dra. AF | Medicina Estética',
    title: 'Dra. AF | Medicina Estética de Alta Gama',
    description:
      'Tratamientos estéticos de vanguardia con los más altos estándares de seguridad y exclusividad. Reserva tu cita en minutos.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function LayoutPublico({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="pt-16">{children}</main>
      <footer className="border-t border-gray-100 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Dra. AF · Medicina Estética de Alta Gama
          </p>
        </div>
      </footer>
    </>
  );
}
