'use client';

import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { Category, ProductWithCategory } from '@/types';
import ProductCard from '@/components/ProductCard';
import { normalizeText } from '@/utils/format';

interface CatalogClientProps {
  products: ProductWithCategory[];
  categories: Category[];
  initialCategory?: string;
}

export default function CatalogClient({
  products,
  categories,
  initialCategory = 'todos',
}: CatalogClientProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [availableOnly, setAvailableOnly] = useState(false);

  const filtered = useMemo(() => {
    const normalizedQuery = normalizeText(query);

    return products.filter((product) => {
      const matchesCategory = category === 'todos' || product.category?.slug === category;
      const matchesAvailability = !availableOnly || product.available;
      const haystack = normalizeText(
        `${product.name} ${product.reference} ${product.shortDescription} ${product.category?.name || ''}`
      );
      const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery);

      return matchesCategory && matchesAvailability && matchesQuery;
    });
  }, [availableOnly, category, products, query]);

  return (
    <div className="space-y-8">
      <div className="surface p-5 md:p-6">
        <div className="flex flex-col gap-5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-eb-200" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por nombre, referencia o categoria"
              className="field pl-12"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCategory('todos')}
              className={`rounded-full px-4 py-2 font-heading text-xs uppercase tracking-[0.14em] transition ${
                category === 'todos'
                  ? 'bg-eb-500 text-white'
                  : 'border border-eb-500/10 text-eb-700 hover:text-eb-900'
              }`}
            >
              Todos
            </button>
            {categories.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setCategory(item.slug)}
                className={`rounded-full px-4 py-2 font-heading text-xs uppercase tracking-[0.14em] transition ${
                  category === item.slug
                    ? 'bg-eb-500 text-white'
                    : 'border border-eb-500/10 text-eb-700 hover:text-eb-900'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>

          <label className="inline-flex items-center gap-3 text-sm text-eb-900">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(event) => setAvailableOnly(event.target.checked)}
              className="h-4 w-4 rounded border-eb-300/30 bg-eb-900 text-eb-400"
            />
            Solo disponibles
          </label>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="font-heading text-sm uppercase tracking-[0.18em] text-eb-200">
          {filtered.length} productos encontrados
        </p>
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="surface p-10 text-center">
          <p className="font-heading text-2xl uppercase tracking-[-0.04em] text-eb-900">
            No encontramos productos con esos filtros
          </p>
          <p className="mt-3 text-sm text-eb-700">
            Prueba con otra categoria, desactiva el filtro de disponibilidad o cambia la busqueda.
          </p>
        </div>
      )}
    </div>
  );
}
