import type { Metadata } from 'next';
import { getBaseUrl } from '@/lib/env';

interface SEOInput {
  title: string;
  description: string;
  path?: string;
  image?: string;
}

export function buildMetadata({
  title,
  description,
  path = '/',
  image = '/og-electribol.svg',
}: SEOInput): Metadata {
  const url = `${getBaseUrl()}${path}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: 'ElectriBol',
      locale: 'es_CO',
      type: 'website',
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: path,
    },
  };
}
