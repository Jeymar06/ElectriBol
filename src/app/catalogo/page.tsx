export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { ArrowRight, CheckCircle2, Search, SlidersHorizontal } from 'lucide-react';
import CatalogClient from '@/components/CatalogClient';
import CustomerTrustBand from '@/components/CustomerTrustBand';
import MotionSection from '@/components/home/MotionSection';
import { getCategories, getProductsWithCategories } from '@/lib/catalog';
import { getSiteContent } from '@/lib/site-content';
import { buildMetadata } from '@/utils/seo';

export async function generateMetadata() {
  const content = await getSiteContent();

  return buildMetadata({
    title: content.seo.catalogTitle,
    description: content.seo.catalogDescription,
    image: content.seo.ogImageUrl,
    siteName: content.seo.siteTitle,
    path: '/catalogo',
  });
}

export default async function CatalogPage() {
  const [products, categories, content] = await Promise.all([
    getProductsWithCategories(),
    getCategories(true),
    getSiteContent(),
  ]);

  return (
    <div className="section-space pt-8">
      <div className="shell space-y-8">
        <MotionSection className="catalog-hero">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div className="space-y-5">
              <p className="eyebrow">{content.catalog.eyebrow}</p>
              <h1 className="display-title text-5xl sm:text-6xl">
                {content.catalog.title}
              </h1>
              <p className="max-w-2xl text-base leading-8 text-eb-700">
                {content.catalog.description}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/contacto" className="btn-primary">
                  {content.catalog.primaryCta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <span className="inline-flex items-center gap-2 rounded-full border border-eb-500/10 bg-white/85 px-4 py-2 text-sm text-eb-800">
                  <CheckCircle2 className="h-4 w-4 text-eb-accent" />
                  {products.length} {content.catalog.visibleRefsLabel}
                </span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="glass-slab p-5">
                <Search className="h-6 w-6 text-eb-accent" />
                <p className="mt-4 font-heading text-2xl uppercase tracking-[-0.04em] text-eb-900">
                  {content.catalog.searchCardTitle}
                </p>
                <p className="mt-3 text-sm leading-7 text-eb-700">
                  {content.catalog.searchCardText}
                </p>
              </div>
              <div className="glass-slab p-5">
                <SlidersHorizontal className="h-6 w-6 text-eb-accent" />
                <p className="mt-4 font-heading text-2xl uppercase tracking-[-0.04em] text-eb-900">
                  {content.catalog.filterCardTitle}
                </p>
                <p className="mt-3 text-sm leading-7 text-eb-700">
                  {content.catalog.filterCardText}
                </p>
              </div>
            </div>
          </div>
        </MotionSection>

        <MotionSection>
          <div className="catalog-category-strip">
            {categories.map((category) => (
              <span key={category.id} className="ticker-pill">
                {category.name}
              </span>
            ))}
          </div>
        </MotionSection>

        <MotionSection>
          <CustomerTrustBand content={content} />
        </MotionSection>

        <MotionSection>
          <CatalogClient products={products} categories={categories} content={content} />
        </MotionSection>
      </div>
    </div>
  );
}
