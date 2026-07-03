import type { Metadata, Viewport } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { ProveedorAuth } from '@/contexts/AuthContext';
import { ProveedorToast } from '@/contexts/ToastContext';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  preload: true,
});

export const viewport: Viewport = {
  themeColor: '#D4AF37',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: 'Dra. Ana Faber | Medicina Estética Cali',
    template: '%s | Dra. Ana Faber · Cali',
  },
  description:
    'Medicina estética y antiaging en Cali. Botox, ácido hialurónico, armonización facial y bioestimuladores. Dra. Ana Cristina Faber.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/icon.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: { url: '/apple-touch-icon.png', sizes: '180x180' },
    shortcut: '/favicon.ico',
  },
};

export default function LayoutRaiz({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={poppins.variable}>
      <head>
        {/* Preconnect para Google Maps (iframe en sección contacto) */}
        <link rel="preconnect" href="https://maps.google.com" />
        <link rel="preconnect" href="https://maps.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://maps.googleapis.com" />
      </head>
      <body className="min-h-screen bg-[#FAFAFA] text-[#333333] antialiased">
        <ProveedorAuth>
          <ProveedorToast>{children}</ProveedorToast>
        </ProveedorAuth>
      </body>
    </html>
  );
}
