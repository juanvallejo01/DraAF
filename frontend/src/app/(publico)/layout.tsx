import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BotonFlotanteWA } from '@/components/shared/BotonFlotanteWA';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  title: {
    default: 'Dra. Ana Faber | Medicina Estética Cali',
    template: '%s | Dra. Ana Faber · Cali',
  },
  description:
    'Medicina estética y antiaging en Cali. Botox, ácido hialurónico, armonización facial y bioestimuladores de colágeno. Dra. Ana Cristina Faber.',
  keywords: [
    'medicina estética Cali',
    'antiaging Cali',
    'botox Cali',
    'ácido hialurónico Cali',
    'armonización facial Cali',
    'bioestimuladores de colágeno',
    'rejuvenecimiento facial Cali',
    'perfilamiento de labios Cali',
    'rinomodelación Cali',
    'Dra Ana Cristina Faber',
    'depilación láser Cali',
    'tratamientos estéticos Cali',
    'clínica estética Cali',
  ],
  authors: [{ name: 'Dra. Ana Cristina Faber', url: BASE_URL }],
  creator: 'Dra. Ana Cristina Faber',
  publisher: 'Dra. Ana Cristina Faber',
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: '/',
    languages: { 'es-CO': '/' },
  },
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: BASE_URL,
    siteName: 'Dra. Ana Cristina Faber | Medicina Estética',
    title: 'Medicina Estética en Cali | Dra. Ana Cristina Faber',
    description:
      'Especialistas en botox, ácido hialurónico, armonización facial y bioestimuladores de colágeno en Cali. Resultados naturales y seguros.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Dra. Ana Cristina Faber — Medicina Estética y Antiaging en Cali',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Medicina Estética en Cali | Dra. Ana Cristina Faber',
    description:
      'Especialistas en botox, ácido hialurónico, armonización facial y bioestimuladores en Cali. Resultados naturales y seguros.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  category: 'health',
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
