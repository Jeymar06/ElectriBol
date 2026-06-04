import Link from 'next/link';
import { ArrowRight, CheckCircle2, MessageCircle } from 'lucide-react';
import type { ProductWithCategory } from '@/types';
import ProductImage from '@/components/ProductImage';
import { buildProductWhatsAppUrl } from '@/lib/site';
import { formatCurrency } from '@/utils/format';

export default function ProductCard({ product }: { product: ProductWithCategory }) {
  return (
    <article className="surface group overflow-hidden rounded-[30px] border-white/70 bg-[rgba(255,255,255,0.86)] shadow-[0_24px_80px_rgba(17,53,99,0.09)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_90px_rgba(17,53,99,0.14)]">
      <Link href={`/producto/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden border-b border-[rgba(144,202,249,0.12)]">
          <ProductImage
            product={product}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_42%,rgba(11,34,66,0.14)_100%)]" />
        </div>
      </Link>

      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full border border-eb-500/10 bg-eb-100/90 px-3 py-1 font-heading text-[11px] uppercase tracking-[0.16em] text-eb-800">
            {product.category?.name || 'Catalogo'}
          </span>
          {product.available ? (
            <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
              Disponible
            </span>
          ) : (
            <span className="text-xs text-eb-700">Consultar disponibilidad</span>
          )}
        </div>

        <div>
          <h3 className="font-heading text-2xl uppercase tracking-[-0.04em] text-eb-900">
            {product.name}
          </h3>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-eb-700">
            Ref. {product.reference}
          </p>
        </div>

        <p className="text-sm leading-6 text-eb-700">{product.shortDescription}</p>

        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="font-heading text-2xl uppercase tracking-[-0.04em] text-eb-500">
              {formatCurrency(product.priceOnRequest ? null : product.price)}
            </p>
            {product.compareAtPrice ? (
              <p className="text-sm text-eb-error line-through">{formatCurrency(product.compareAtPrice)}</p>
            ) : (
              <p className="text-xs uppercase tracking-[0.16em] text-eb-700">Por {product.unit}</p>
            )}
          </div>
          <Link
            href={`/producto/${product.slug}`}
            className="inline-flex items-center gap-2 font-heading text-sm uppercase tracking-[0.14em] text-eb-800 transition hover:text-eb-500"
          >
            Ver mas <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <a
          href={buildProductWhatsAppUrl(product.name, product.reference)}
          target="_blank"
          rel="noreferrer"
          className="btn-primary w-full"
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          Consultar por WhatsApp
        </a>
      </div>
    </article>
  );
}
