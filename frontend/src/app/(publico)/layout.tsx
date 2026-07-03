import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BotonFlotanteWA } from '@/components/shared/BotonFlotanteWA';

export const metadata: Metadata = {
  title: {
    default: 'Dra. Ana Cristina Faber | Medicina Estética y Antiaging',
    template: '%s | Dra. Ana Cristina Faber',
  },
  description:
    'Dra. Ana Cristina Faber — especialista en medicina estética y antiaging en Cali, Colombia. Tratamientos faciales de vanguardia: ácido hialurónico, toxina botulínica, bioestimulación y más.',
  keywords: [
    'medicina estética Cali',
    'antiaging Cali',
    'Dra Ana Cristina Faber',
    'tratamientos faciales Cali',
    'ácido hialurónico',
    'botox Cali',
    'bioestimulación',
    'rejuvenecimiento facial',
  ],
  authors: [{ name: 'Dra. Ana Cristina Faber' }],
  creator: 'Dra. Ana Cristina Faber',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    siteName: 'Dra. Ana Cristina Faber | Medicina Estética',
    title: 'Dra. Ana Cristina Faber | Medicina Estética y Antiaging — Cali',
    description:
      'Tratamientos estéticos de vanguardia con los más altos estándares de seguridad y exclusividad en Cali, Colombia.',
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
      <Footer />
      <BotonFlotanteWA />
    </>
  );
}
