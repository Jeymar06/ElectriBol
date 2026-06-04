import type { Metadata } from 'next';
import { DM_Sans, Oswald } from 'next/font/google';
import './globals.css';
import AppShell from '@/components/AppShell';
import { getBaseUrl } from '@/lib/env';
import { buildLocalBusinessSchema, siteConfig } from '@/lib/site';

const heading = Oswald({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['500', '700'],
});

const body = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: 'ElectriBol | Ferreteria electrica en Cantagallo',
    template: '%s | ElectriBol',
  },
  description: siteConfig.description,
  openGraph: {
    title: 'ElectriBol',
    description: siteConfig.description,
    url: getBaseUrl(),
    siteName: 'ElectriBol',
    locale: 'es_CO',
    type: 'website',
    images: [{ url: '/og-electribol.svg', width: 1200, height: 630, alt: 'ElectriBol' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ElectriBol',
    description: siteConfig.description,
    images: ['/og-electribol.svg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const localBusinessSchema = buildLocalBusinessSchema();

  return (
    <html lang="es">
      <body className={`${heading.variable} ${body.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
