import { Product } from '@/types';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  product?: Product;
}

/**
 * Componente para meta tags SEO
 */
export function generateSEOMeta({
  title = 'ElectriBol - Lámparas, Cables y Alumbrado',
  description = 'ElectriBol - Especialistas en lámparas, cables, reflectores y todo lo relacionado con alumbrado. Calidad y servicio garantizado.',
  image = '/instagram_preview.png',
  url = 'https://electribol.com',
  product,
}: SEOProps) {
  const fullTitle = title.includes('ElectriBol') ? title : `${title} | ElectriBol`;
  const fullUrl = url.startsWith('http') ? url : `https://electribol.com${url}`;

  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      images: [image],
      url: fullUrl,
      type: product ? 'product' : 'website',
      siteName: 'ElectriBol',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
    },
    other: {
      'application/ld+json': product ? JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.title,
        description: product.description,
        image: product.images,
        sku: product.sku,
        brand: {
          '@type': 'Brand',
          name: 'ElectriBol',
        },
        offers: {
          '@type': 'Offer',
          price: product.price,
          priceCurrency: product.currency,
          availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          url: fullUrl,
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: product.rating,
          reviewCount: Math.floor(Math.random() * 50) + 10,
        },
      }) : undefined,
    },
  };
}

/**
 * Genera JSON-LD para la organización
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ElectriBol',
    description: 'Especialistas en lámparas, cables, reflectores y todo lo relacionado con alumbrado',
    url: 'https://electribol.com',
    logo: 'https://electribol.com/logo.png',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Carrera 3 #11-30',
      addressLocality: 'Barrio 23 de enero',
      addressRegion: 'Cantagallo',
      addressCountry: 'CO',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+57-301-595-6954',
      contactType: 'customer service',
      availableLanguage: 'Spanish',
    },
  };
}
