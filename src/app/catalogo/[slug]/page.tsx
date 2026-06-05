export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { ArrowRight, Layers3 } from 'lucide-react';
import { notFound } from 'next/navigation';
import CatalogClient from '@/components/CatalogClient';
import CustomerTrustBand from '@/components/CustomerTrustBand';
import MotionSection from '@/components/home/MotionSection';
import { getCategories, getCategoryBySlug, getProductsByCategory, getProductsWithCategories } from '@/lib/catalog';
import { getSiteContent } from '@/lib/site-content';
import { buildMetadata } from '@/utils/seo';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const [category, content] = await Promise.all([getCategoryBySlug(params.slug), getSiteContent()]);

  if (!category) {
    return buildMetadata({
      title: 'Categoria no encontrada',
      description: 'La categoria solicitada no existe en ElectriBol.',
      image: content.seo.ogImageUrl,
      siteName: content.seo.siteTitle,
      path: `/catalogo/${params.slug}`,
    });
  }

  return buildMetadata({
    title: category.name,
    description: category.description,
    image: content.seo.ogImageUrl,
    siteName: content.seo.siteTitle,
    path: `/catalogo/${category.slug}`,
  });
}

export default async function CatalogCategoryPage({ params }: { params: { slug: string } }) {
  const category = await getCategoryBySlug(params.slug);

  if (!category) {
    notFound();
  }

  const [products, categories, content] = await Promise.all([
    getProductsWithCategories(),
    getCategories(true),
    getSiteContent(),
  ]);
  const total = (await getProductsByCategory(category.id)).length;

  return (
    <div className="section-space pt-8">
      <div className="shell space-y-8">
        <MotionSection className="catalog-hero">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div className="space-y-5">
              <p className="eyebrow">{content.catalog.categoryHeroEyebrow}</p>
              <h1 className="display-title text-5xl sm:text-6xl">{category.name}</h1>
              <p className="max-w-2xl text-base leading-8 text-eb-700">{category.description}</p>
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-eb-500/10 bg-white/88 px-4 py-2 text-sm text-eb-800">
                  <Layers3 className="h-4 w-4 text-eb-accent" />
                  {total} {content.catalog.categoryCountSuffix}
                </span>
                <Link href="/catalogo" className="btn-secondary">
                  {content.catalog.categoryBackCta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="glass-slab p-6">
              <p className="font-heading text-[11px] uppercase tracking-[0.2em] text-eb-700">
                {content.catalog.categoryPanelEyebrow}
              </p>
              <p className="mt-4 font-heading text-3xl uppercase tracking-[-0.05em] text-eb-900">
                {content.catalog.categoryPanelTitle}
              </p>
              <p className="mt-4 text-sm leading-7 text-eb-700">
                {content.catalog.categoryPanelText}
              </p>
            </div>
          </div>
        </MotionSection>

        <MotionSection>
          <CustomerTrustBand content={content} />
        </MotionSection>

        <MotionSection>
          <CatalogClient
            products={products}
            categories={categories}
            content={content}
            initialCategory={category.slug}
          />
        </MotionSection>
      </div>
    </div>
  );
}
