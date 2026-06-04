import type { ProductWithCategory } from '@/types';

function buildPlaceholder(product: ProductWithCategory) {
  const initials = product.name
    .split(' ')
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase();

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#0a3260"/>
          <stop offset="100%" stop-color="#1565c0"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="900" rx="40" fill="url(#bg)"/>
      <circle cx="920" cy="180" r="140" fill="rgba(255,255,255,0.08)"/>
      <circle cx="240" cy="720" r="180" fill="rgba(255,255,255,0.06)"/>
      <text x="96" y="420" fill="#ffffff" font-size="82" font-family="Arial" font-weight="700">${product.reference}</text>
      <text x="96" y="540" fill="#e3f2fd" font-size="44" font-family="Arial">${product.category?.name || 'ElectriBol'}</text>
      <text x="96" y="700" fill="#ffffff" font-size="220" font-family="Arial" font-weight="800">${initials}</text>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export default function ProductImage({
  product,
  alt,
  className,
}: {
  product: ProductWithCategory;
  alt?: string;
  className?: string;
}) {
  const src = product.images[0] || buildPlaceholder(product);
  return <img src={src} alt={alt || product.name} className={className} />;
}
