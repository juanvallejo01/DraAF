import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/inicio', '/tratamientos'],
        disallow: ['/admin/', '/admin/*', '/paciente/', '/paciente/*', '/auth/', '/auth/*'],
      },
      {
        userAgent: 'Googlebot',
        allow: ['/', '/inicio', '/tratamientos'],
        disallow: ['/admin/', '/paciente/', '/auth/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
