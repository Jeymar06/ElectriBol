export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import CatalogClient from '@/components/CatalogClient';
import { getCategories, getCategoryBySlug, getProductsByCategory, getProductsWithCategories } from '@/lib/catalog';
import { buildMetadata } from '@/utils/seo';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const category = await getCategoryBySlug(params.slug);

  if (!category) {
    return buildMetadata({
      title: 'Categoria no encontrada',
      description: 'La categoria solicitada no existe en ElectriBol.',
      path: `/catalogo/${params.slug}`,
    });
  }

  return buildMetadata({
    title: category.name,
    description: category.description,
    path: `/catalogo/${category.slug}`,
  });
}

export default async function CatalogCategoryPage({ params }: { params: { slug: string } }) {
  const category = await getCategoryBySlug(params.slug);

  if (!category) {
    notFound();
  }

  const [products, categories] = await Promise.all([getProductsWithCategories(), getCategories(true)]);
  const total = (await getProductsByCategory(category.id)).length;

  return (
    <div className="section-space">
      <div className="shell space-y-8">
        <div className="max-w-3xl space-y-4">
          <p className="eyebrow">Categoria</p>
          <h1 className="font-heading text-5xl uppercase tracking-[-0.06em] text-eb-900">
            {category.name}
          </h1>
          <p className="text-base leading-7 text-eb-700">{category.description}</p>
          <p className="font-heading text-sm uppercase tracking-[0.16em] text-eb-800">
            {total} referencias disponibles en esta familia
          </p>
        </div>
        <CatalogClient products={products} categories={categories} initialCategory={category.slug} />
      </div>
    </div>
  );
}
