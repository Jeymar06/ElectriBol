export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { ArrowRight, CheckCircle2, Search, SlidersHorizontal } from 'lucide-react';
import CatalogClient from '@/components/CatalogClient';
import MotionSection from '@/components/home/MotionSection';
import { getCategories, getProductsWithCategories } from '@/lib/catalog';
import { buildMetadata } from '@/utils/seo';

export const metadata = buildMetadata({
  title: 'Catalogo completo',
  description: 'Explora el catalogo de lamparas LED, cables, reflectores y accesorios de ElectriBol.',
  path: '/catalogo',
});

export default async function CatalogPage() {
  const [products, categories] = await Promise.all([getProductsWithCategories(), getCategories(true)]);

  return (
    <div className="section-space pt-8">
      <div className="shell space-y-8">
        <MotionSection className="catalog-hero">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div className="space-y-5">
              <p className="eyebrow">Catalogo completo</p>
              <h1 className="display-title text-5xl sm:text-6xl">
                Encuentra mas rapido la referencia que estas buscando.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-eb-700">
                Revisa por categoria, busca por nombre o referencia y filtra por disponibilidad
                para encontrar justo lo que necesitas.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/contacto" className="btn-primary">
                  Hablar con el local
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <span className="inline-flex items-center gap-2 rounded-full border border-eb-500/10 bg-white/85 px-4 py-2 text-sm text-eb-800">
                  <CheckCircle2 className="h-4 w-4 text-eb-accent" />
                  {products.length} referencias visibles
                </span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="glass-slab p-5">
                <Search className="h-6 w-6 text-eb-accent" />
                <p className="mt-4 font-heading text-2xl uppercase tracking-[-0.04em] text-eb-900">
                  Busqueda rapida
                </p>
                <p className="mt-3 text-sm leading-7 text-eb-700">
                  Escribe el nombre, la referencia o la categoria para ubicar productos mas rapido.
                </p>
              </div>
              <div className="glass-slab p-5">
                <SlidersHorizontal className="h-6 w-6 text-eb-accent" />
                <p className="mt-4 font-heading text-2xl uppercase tracking-[-0.04em] text-eb-900">
                  Filtros utiles
                </p>
                <p className="mt-3 text-sm leading-7 text-eb-700">
                  Organiza el catalogo por disponibilidad y categoria para comparar con mas facilidad.
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
          <CatalogClient products={products} categories={categories} />
        </MotionSection>
      </div>
    </div>
  );
}
