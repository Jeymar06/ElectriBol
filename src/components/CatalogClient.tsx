'use client';

import { MessageCircle, Search, SlidersHorizontal, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Category, ProductWithCategory, SiteContent } from '@/types';
import ProductCard from '@/components/ProductCard';
import { customerQuickSearches, matchesCustomerSearch } from '@/lib/customer-search';
import { buildCatalogWhatsAppUrl } from '@/lib/site';
import { sendTrackingEvent } from '@/lib/tracking';

interface CatalogClientProps {
  products: ProductWithCategory[];
  categories: Category[];
  content: SiteContent;
  initialCategory?: string;
}

export default function CatalogClient({
  products,
  categories,
  content,
  initialCategory = 'todos',
}: CatalogClientProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [availableOnly, setAvailableOnly] = useState(false);
  const lastEmptySearchKey = useRef('');

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = category === 'todos' || product.category?.slug === category;
      const matchesAvailability = !availableOnly || product.available;
      const haystack = `${product.name} ${product.reference} ${product.shortDescription} ${product.description} ${product.category?.name || ''}`;
      const matchesQuery = matchesCustomerSearch(haystack, query);

      return matchesCategory && matchesAvailability && matchesQuery;
    });
  }, [availableOnly, category, products, query]);

  const activeCategoryName =
    category === 'todos' ? undefined : categories.find((item) => item.slug === category)?.name;

  useEffect(() => {
    if (filtered.length === 0) {
      const searchKey = `${activeCategoryName || 'todos'}|${query}|${availableOnly}`;
      if (searchKey !== lastEmptySearchKey.current && (query || activeCategoryName || availableOnly)) {
        lastEmptySearchKey.current = searchKey;
        sendTrackingEvent({
          event: 'catalog_empty_search',
          category: activeCategoryName,
          query: query || undefined,
          label: 'catalog_filters',
        });
      }
    } else if (lastEmptySearchKey.current) {
      lastEmptySearchKey.current = '';
    }
  }, [activeCategoryName, availableOnly, filtered.length, query]);

  return (
    <div className="space-y-8">
      <div className="customer-filter-panel">
        <div className="flex flex-col gap-5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-eb-200" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={content.catalog.searchPlaceholder}
              className="field min-h-[52px] pl-12 pr-12 text-base"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg border border-eb-500/10 bg-white text-eb-700"
                aria-label="Limpiar busqueda"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible">
            {customerQuickSearches.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setQuery(item)}
                className={`customer-chip shrink-0 ${query === item ? 'customer-chip-active' : ''}`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible">
            <button
              type="button"
              onClick={() => setCategory('todos')}
              className={`customer-chip shrink-0 ${category === 'todos' ? 'customer-chip-active' : ''}`}
            >
              Todos
            </button>
            {categories.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setCategory(item.slug)}
                className={`customer-chip shrink-0 ${category === item.slug ? 'customer-chip-active' : ''}`}
              >
                {item.name}
              </button>
            ))}
          </div>

          <label className="inline-flex min-h-[48px] items-center justify-between gap-3 rounded-xl border border-eb-500/10 bg-white px-4 py-3 text-sm text-eb-900 md:justify-start">
            <span className="inline-flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-eb-600" />
              Mostrar solo referencias disponibles
            </span>
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(event) => setAvailableOnly(event.target.checked)}
              className="h-4 w-4 rounded border-eb-300/30 bg-eb-900 text-eb-400"
            />
          </label>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="font-heading text-sm uppercase tracking-[0.18em] text-eb-200">
          {filtered.length} productos encontrados
        </p>
        <a
          href={buildCatalogWhatsAppUrl(activeCategoryName, query || undefined, content.contact.whatsappNumber)}
          target="_blank"
          rel="noreferrer"
          onClick={() =>
            sendTrackingEvent({
              event: 'catalog_whatsapp_click',
              category: activeCategoryName,
              query: query || undefined,
              label: 'catalog_toolbar',
            })
          }
          className="hidden rounded-lg border border-eb-500/10 bg-white/90 px-4 py-2 font-heading text-[11px] uppercase tracking-[0.12em] text-eb-800 md:inline-flex"
        >
          No encuentras lo que buscas?
        </a>
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              whatsappNumber={content.contact.whatsappNumber}
            />
          ))}
        </div>
      ) : (
        <div className="customer-empty-state text-center">
          <p className="font-heading text-3xl uppercase text-eb-900">
            {content.catalog.emptyTitle}
          </p>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-eb-700">
            {content.catalog.emptyText}
          </p>
          <a
            href={buildCatalogWhatsAppUrl(activeCategoryName, query || undefined, content.contact.whatsappNumber)}
            target="_blank"
            rel="noreferrer"
            onClick={() =>
              sendTrackingEvent({
                event: 'catalog_whatsapp_click',
                category: activeCategoryName,
                query: query || undefined,
                label: 'catalog_empty_state',
              })
            }
            className="btn-primary mt-6"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Preguntar por esta busqueda
          </a>
        </div>
      )}
    </div>
  );
}
