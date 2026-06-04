export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { ChevronRight, MessageCircle } from 'lucide-react';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import ProductImage from '@/components/ProductImage';
import { getProductBySlug, getRelatedProducts } from '@/lib/catalog';
import { buildProductWhatsAppUrl } from '@/lib/site';
import { formatCurrency } from '@/utils/format';
import { buildMetadata } from '@/utils/seo';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return buildMetadata({
      title: 'Producto no encontrado',
      description: 'La referencia solicitada no existe en ElectriBol.',
      path: `/producto/${params.slug}`,
    });
  }

  return buildMetadata({
    title: product.name,
    description: product.shortDescription,
    path: `/producto/${product.slug}`,
  });
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const related = await getRelatedProducts(product, 4);
  const gallery = product.images.length > 0 ? product.images : [product.images[0]].filter(Boolean);
  const imageList = gallery.length > 0 ? gallery : [null];

  return (
    <div className="section-space">
      <div className="shell space-y-10">
        <nav className="flex flex-wrap items-center gap-2 text-sm text-eb-200">
          <Link href="/">Inicio</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/catalogo">Catalogo</Link>
          <ChevronRight className="h-4 w-4" />
          {product.category ? (
            <>
              <Link href={`/catalogo/${product.category.slug}`}>{product.category.name}</Link>
              <ChevronRight className="h-4 w-4" />
            </>
          ) : null}
          <span className="text-eb-900">{product.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-4">
            <div className="surface overflow-hidden">
              <div className="aspect-[4/3]">
                <ProductImage product={product} className="h-full w-full object-cover" />
              </div>
            </div>
            {imageList.length > 1 ? (
              <div className="grid grid-cols-4 gap-3">
                {imageList.map((image, index) => (
                  <div key={`${image}-${index}`} className="surface overflow-hidden">
                    <img src={image || ''} alt={`${product.name} ${index + 1}`} className="aspect-[4/3] w-full object-cover" />
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="surface p-6 md:p-8">
            <p className="eyebrow">{product.category?.name || 'Producto'}</p>
            <h1 className="mt-4 font-heading text-5xl uppercase tracking-[-0.06em] text-eb-900">
              {product.name}
            </h1>
            <p className="mt-3 text-sm uppercase tracking-[0.18em] text-eb-700">
              Ref. {product.reference}
            </p>

            <div className="mt-8 space-y-3">
              <p className="font-heading text-4xl uppercase tracking-[-0.05em] text-eb-500">
                {formatCurrency(product.priceOnRequest ? null : product.price)}
              </p>
              {product.compareAtPrice ? (
                <p className="text-base text-eb-error line-through">{formatCurrency(product.compareAtPrice)}</p>
              ) : null}
              <p className="text-sm uppercase tracking-[0.18em] text-eb-800">
                {product.available ? 'Disponible' : 'Disponibilidad por confirmar'} | Por {product.unit}
              </p>
            </div>

            <p className="mt-8 text-base leading-7 text-eb-700">{product.description}</p>

            <a
              href={buildProductWhatsAppUrl(product.name, product.reference)}
              target="_blank"
              rel="noreferrer"
              className="btn-primary mt-8 w-full"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Consultar por WhatsApp
            </a>
          </div>
        </div>

        {related.length > 0 ? (
          <section className="space-y-6">
            <div>
              <p className="eyebrow">Relacionados</p>
              <h2 className="mt-3 font-heading text-4xl uppercase tracking-[-0.05em] text-eb-900">
                Mas referencias de esta categoria
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
