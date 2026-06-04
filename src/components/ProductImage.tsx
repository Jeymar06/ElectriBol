import Image from 'next/image';
import type { ProductWithCategory } from '@/types';

export function buildPlaceholder(product: ProductWithCategory) {
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
          <stop offset="0%" stop-color="#113563"/>
          <stop offset="55%" stop-color="#1565c0"/>
          <stop offset="100%" stop-color="#0b2242"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="900" rx="40" fill="url(#bg)"/>
      <circle cx="980" cy="140" r="190" fill="rgba(255,255,255,0.08)"/>
      <circle cx="250" cy="740" r="220" fill="rgba(255,255,255,0.06)"/>
      <text x="92" y="170" fill="#dbeafe" font-size="30" font-family="Arial" letter-spacing="8">ELECTRIBOL</text>
      <text x="92" y="430" fill="#ffffff" font-size="88" font-family="Arial" font-weight="700">${product.reference}</text>
      <text x="92" y="540" fill="#eff6ff" font-size="42" font-family="Arial">${product.category?.name || 'ElectriBol'}</text>
      <text x="92" y="720" fill="#ffffff" font-size="250" font-family="Arial" font-weight="800">${initials}</text>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

interface ProductImageProps {
  product: ProductWithCategory;
  alt?: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
}

export default function ProductImage({
  product,
  alt,
  className,
  fill = false,
  width = 1200,
  height = 900,
  sizes = '(max-width: 768px) 100vw, 50vw',
  priority = false,
}: ProductImageProps) {
  const src = product.images[0] || buildPlaceholder(product);
  const imageAlt = alt || product.name;
  const unoptimized = src.startsWith('data:');

  if (fill) {
    return (
      <Image
        src={src}
        alt={imageAlt}
        fill
        unoptimized={unoptimized}
        sizes={sizes}
        className={className}
        priority={priority}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={imageAlt}
      width={width}
      height={height}
      unoptimized={unoptimized}
      sizes={sizes}
      className={className}
      priority={priority}
    />
  );
}
