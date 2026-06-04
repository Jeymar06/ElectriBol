export const dynamic = 'force-dynamic';

import CatalogClient from '@/components/CatalogClient';
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
    <div className="section-space">
      <div className="shell space-y-8">
        <div className="max-w-3xl space-y-4">
          <p className="eyebrow">Catalogo completo</p>
          <h1 className="font-heading text-5xl uppercase tracking-[-0.06em] text-eb-900">
            Busca por categoria, referencia o disponibilidad.
          </h1>
          <p className="text-base leading-7 text-eb-700">
            Todo el mostrario digital esta pensado para que revises rapido y escribas por WhatsApp
            cuando encuentres lo que necesitas.
          </p>
        </div>
        <CatalogClient products={products} categories={categories} />
      </div>
    </div>
  );
}
