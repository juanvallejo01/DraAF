import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { ProveedorAuth } from '@/contexts/AuthContext';
import { ProveedorToast } from '@/contexts/ToastContext';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Dra. AF | Medicina Estética',
  description: 'Reserva tu cita en nuestra clínica de medicina estética de alta gama.',
};

export default function LayoutRaiz({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={poppins.variable}>
      <body className="min-h-screen bg-[#FAFAFA] text-[#333333] antialiased">
        <ProveedorAuth>
          <ProveedorToast>{children}</ProveedorToast>
        </ProveedorAuth>
      </body>
    </html>
  );
}
