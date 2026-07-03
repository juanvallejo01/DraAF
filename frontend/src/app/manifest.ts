import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Dra. Ana Cristina Faber | Medicina Estética Cali',
    short_name: 'Dra. Ana Faber',
    description: 'Medicina estética y antiaging en Cali, Colombia. Botox, ácido hialurónico y armonización facial.',
    start_url: '/inicio',
    display: 'browser',
    background_color: '#FAFAFA',
    theme_color: '#D4AF37',
    lang: 'es',
    categories: ['health', 'medical', 'beauty'],
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
