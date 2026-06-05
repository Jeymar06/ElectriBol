import type { Metadata } from 'next';
import { DM_Sans, Oswald } from 'next/font/google';
import './globals.css';
import AppShell from '@/components/AppShell';
import { getBaseUrl } from '@/lib/env';
import { buildLocalBusinessSchema } from '@/lib/site';
import { getSiteContent } from '@/lib/site-content';

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

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();

  return {
    metadataBase: new URL(getBaseUrl()),
    title: {
      default: content.seo.homeTitle,
      template: content.seo.titleTemplate,
    },
    description: content.seo.homeDescription,
    openGraph: {
      title: content.seo.homeTitle,
      description: content.seo.homeDescription,
      url: getBaseUrl(),
      siteName: content.seo.siteTitle,
      locale: 'es_CO',
      type: 'website',
      images: [
        {
          url: content.seo.ogImageUrl,
          width: 1200,
          height: 630,
          alt: content.seo.siteTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: content.seo.homeTitle,
      description: content.seo.homeDescription,
      images: [content.seo.ogImageUrl],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = await getSiteContent();
  const localBusinessSchema = buildLocalBusinessSchema(content);

  return (
    <html lang="es">
      <body className={`${heading.variable} ${body.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <AppShell content={content}>{children}</AppShell>
      </body>
    </html>
  );
}
