import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ElectriBol - Lámparas, Cables y Alumbrado',
  description: 'ElectriBol - Especialistas en lámparas, cables, reflectores y todo lo relacionado con alumbrado. Calidad y servicio garantizado.',
  keywords: 'lámparas, cables, reflectores, iluminación, LED, eléctrico, alumbrado, ElectriBol',
  authors: [{ name: 'ElectriBol' }],
  creator: 'ElectriBol',
  publisher: 'ElectriBol',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://electribol.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'ElectriBol - Lámparas, Cables y Alumbrado',
    description: 'Especialistas en lámparas, cables, reflectores y todo lo relacionado con alumbrado. Calidad y servicio garantizado.',
    url: 'https://electribol.com',
    siteName: 'ElectriBol',
    images: [
      {
        url: '/instagram_preview.png',
        width: 1200,
        height: 630,
        alt: 'ElectriBol - Lámparas, Cables y Alumbrado',
      },
    ],
    locale: 'es_CO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ElectriBol - Lámparas, Cables y Alumbrado',
    description: 'Especialistas en lámparas, cables, reflectores y todo lo relacionado con alumbrado. Calidad y servicio garantizado.',
    images: ['/instagram_preview.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="theme-color" content="#0A5FFF" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
