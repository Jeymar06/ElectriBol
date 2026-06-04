export const dynamic = 'force-dynamic';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle2, ChevronRight, MessageCircle, Sparkles } from 'lucide-react';
import { notFound } from 'next/navigation';
import MotionSection from '@/components/home/MotionSection';
import ProductCard from '@/components/ProductCard';
import ProductImage, { buildPlaceholder } from '@/components/ProductImage';
import { getProductBySlug, getRelatedProducts } from '@/lib/catalog';
import { buildProductWhatsAppUrl, siteConfig } from '@/lib/site';
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
    <div className="section-space pt-8">
      <div className="shell space-y-10">
        <MotionSection>
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
        </MotionSection>

        <div className="grid gap-8 lg:grid-cols-[1.04fr_0.96fr]">
          <MotionSection className="space-y-4">
            <div className="product-gallery-shell overflow-hidden">
              <div className="relative aspect-[4/3]">
                <ProductImage
                  product={product}
                  fill
                  priority
                  sizes="(max-width: 990px) 100vw, 55vw"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_42%,rgba(11,34,66,0.16)_100%)]" />
              </div>
            </div>
            {imageList.length > 1 ? (
              <div className="grid grid-cols-4 gap-3">
                {imageList.map((image, index) => (
                  <div key={`${image}-${index}`} className="glass-slab overflow-hidden">
                    <Image
                      src={image || buildPlaceholder(product)}
                      alt={`${product.name} ${index + 1}`}
                      width={400}
                      height={300}
                      unoptimized={!image || image.startsWith('data:')}
                      className="aspect-[4/3] h-auto w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </MotionSection>

          <MotionSection className="product-detail-shell p-6 md:p-8" delay={0.08}>
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-eb-500/10 bg-white/85 px-4 py-2">
                <Sparkles className="h-4 w-4 text-eb-accent" />
                <span className="font-heading text-[11px] uppercase tracking-[0.22em] text-eb-800">
                  {product.category?.name || 'Producto'}
                </span>
              </div>

              <div>
                <h1 className="display-title text-5xl sm:text-6xl">{product.name}</h1>
                <p className="mt-3 text-sm uppercase tracking-[0.18em] text-eb-700">
                  Ref. {product.reference}
                </p>
              </div>

              <div className="space-y-3">
                <p className="font-heading text-4xl uppercase tracking-[-0.05em] text-eb-500">
                  {formatCurrency(product.priceOnRequest ? null : product.price)}
                </p>
                {product.compareAtPrice ? (
                  <p className="text-base text-eb-error line-through">
                    {formatCurrency(product.compareAtPrice)}
                  </p>
                ) : null}
                <p className="text-sm uppercase tracking-[0.18em] text-eb-800">
                  {product.available ? 'Disponible' : 'Disponibilidad por confirmar'} | Por {product.unit}
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="glass-slab p-5">
                <p className="font-heading text-[11px] uppercase tracking-[0.18em] text-eb-700">
                  Descripcion
                </p>
                <p className="mt-4 text-sm leading-7 text-eb-700">{product.description}</p>
              </div>
              <div className="glass-slab p-5">
                <p className="font-heading text-[11px] uppercase tracking-[0.18em] text-eb-700">
                  Contacto rapido
                </p>
                <p className="mt-4 text-sm leading-7 text-eb-700">
                  Si quieres confirmar disponibilidad, compatibilidad o precio final, te respondemos
                  por WhatsApp desde {siteConfig.city}.
                </p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm text-eb-800">
                  <CheckCircle2 className="h-4 w-4 text-eb-accent" />
                  Respuesta directa del local
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={buildProductWhatsAppUrl(product.name, product.reference)}
                target="_blank"
                rel="noreferrer"
                className="btn-primary flex-1"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Consultar por WhatsApp
              </a>
              <Link href="/catalogo" className="btn-secondary flex-1">
                Volver al catalogo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </MotionSection>
        </div>

        {related.length > 0 ? (
          <MotionSection className="space-y-6">
            <div>
              <p className="eyebrow">Relacionados</p>
              <h2 className="display-title mt-3 text-4xl">
                Mas referencias de esta categoria con el mismo acabado visual.
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </MotionSection>
        ) : null}
      </div>
    </div>
  );
}
