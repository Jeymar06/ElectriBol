export const siteConfig = {
  name: 'ElectriBol',
  tagline: 'Iluminacion, cables y accesorios electricos en Cantagallo, Bolivar',
  description:
    'Encuentra lamparas LED, cables electricos, reflectores y accesorios para tu hogar, negocio o proyecto.',
  city: 'Cantagallo, Bolivar',
  address: 'Carrera 3 #11-30, Barrio 23 de enero, Cantagallo, Bolivar',
  coordinates: {
    latitude: 7.3798,
    longitude: -73.9165,
  },
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '573015956954',
  whatsappDisplay: '+57 301 595 6954',
  email: 'info@electribol.com',
  hours: 'Lunes-Viernes 8AM-6PM | Sabados 8AM-2PM | Domingos: Cerrado',
  announcement:
    'Atendemos en Cantagallo, Bolivar. Lunes a viernes de 8AM a 6PM y sabados hasta las 2PM.',
  googleMapsQuery:
    'Carrera 3 #11-30, Barrio 23 de enero, Cantagallo, Bolivar, Colombia',
  googleMapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Carrera%203%20%2311-30%2C%20Barrio%2023%20de%20enero%2C%20Cantagallo%2C%20Bolivar%2C%20Colombia',
  googleMapsEmbedUrl:
    'https://www.google.com/maps?q=Carrera%203%20%2311-30%2C%20Barrio%2023%20de%20enero%2C%20Cantagallo%2C%20Bolivar%2C%20Colombia&z=16&output=embed',
  serviceArea: 'Cantagallo, Bolivar y alrededores',
  priceRange: '$$',
};

export function createWhatsAppUrl(message: string, whatsappNumber = siteConfig.whatsappNumber): string {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function getPublicBaseUrl(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  if (siteUrl) {
    return siteUrl;
  }

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) {
    return `https://${vercelUrl}`;
  }

  return 'http://localhost:3000';
}

export function toAbsoluteSiteUrl(pathOrUrl?: string | null): string | undefined {
  if (!pathOrUrl || pathOrUrl.startsWith('data:') || pathOrUrl.startsWith('blob:')) {
    return undefined;
  }

  if (/^https?:\/\//.test(pathOrUrl)) {
    return pathOrUrl;
  }

  return `${getPublicBaseUrl()}/${pathOrUrl.replace(/^\//, '')}`;
}

export function buildProductWhatsAppUrl(
  name: string,
  reference: string,
  options?: {
    category?: string;
    available?: boolean;
    slug?: string;
    imageUrl?: string | null;
    whatsappNumber?: string;
  }
): string {
  const availabilityText =
    options?.available === false
      ? 'Quiero confirmar disponibilidad y alternativas.'
      : 'Quiero confirmar disponibilidad y precio final.';
  const categoryText = options?.category ? ` Categoria: ${options.category}.` : '';
  const productUrl = options?.slug ? toAbsoluteSiteUrl(`/producto/${options.slug}`) : undefined;
  const imageUrl = toAbsoluteSiteUrl(options?.imageUrl);
  const contextLines = [
    `Hola, vi en la pagina el producto *${name}* (Ref: ${reference}).${categoryText}`,
    productUrl ? `Enlace del producto: ${productUrl}` : undefined,
    imageUrl ? `Imagen principal: ${imageUrl}` : undefined,
    availabilityText,
  ].filter(Boolean);

  return createWhatsAppUrl(contextLines.join('\n'), options?.whatsappNumber);
}

export function buildCatalogWhatsAppUrl(category?: string, query?: string, whatsappNumber?: string): string {
  if (query) {
    return createWhatsAppUrl(
      `Hola, estoy buscando "${query}". Me pueden decir que opciones tienen disponibles y cual recomiendan?`,
      whatsappNumber
    );
  }

  if (category) {
    return createWhatsAppUrl(
      `Hola, estoy revisando productos de ${category}. Me pueden ayudar a escoger una opcion disponible?`,
      whatsappNumber
    );
  }

  return createWhatsAppUrl(
    'Hola, estoy revisando el catalogo de ElectriBol. Me pueden ayudar con disponibilidad y precios?',
    whatsappNumber
  );
}

export function buildGeneralWhatsAppUrl(whatsappNumber?: string): string {
  return createWhatsAppUrl(
    'Hola, quiero consultar productos electricos disponibles en ElectriBol.',
    whatsappNumber
  );
}

export function buildLocalBusinessSchema(content?: import('@/types').SiteContent) {
  const brand = content?.brand || siteConfig;
  const contact = content?.contact || siteConfig;

  return {
    '@context': 'https://schema.org',
    '@type': 'HardwareStore',
    name: brand.name,
    description: brand.description,
    image: content?.brand.logoUrl || `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/og-electribol.svg`,
    telephone: contact.whatsappDisplay,
    email: contact.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: contact.address,
      addressLocality: 'Cantagallo',
      addressRegion: 'Bolivar',
      addressCountry: 'CO',
    },
    areaServed: contact.serviceArea,
    priceRange: siteConfig.priceRange,
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    sameAs: [],
    geo: {
      '@type': 'GeoCoordinates',
      latitude: siteConfig.coordinates.latitude,
      longitude: siteConfig.coordinates.longitude,
    },
    openingHours: 'Mo-Fr 08:00-18:00, Sa 08:00-14:00',
  };
}
