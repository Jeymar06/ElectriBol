export const dynamic = 'force-dynamic';
export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

import { redirect } from 'next/navigation';
import { Boxes, Eye, ImageOff, Layers3, MessageCircle, SearchX, Star } from 'lucide-react';
import AdminNav from '@/components/AdminNav';
import { getAnalyticsSummary } from '@/lib/analytics';
import { isAdminAuthenticated } from '@/lib/auth';
import { getCategories, getProductsWithCategories } from '@/lib/catalog';

export default async function AdminDashboardPage() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    redirect('/admin/login');
  }

  const [productsResult, categoriesResult, analyticsResult] = await Promise.allSettled([
    getProductsWithCategories(),
    getCategories(false),
    getAnalyticsSummary(),
  ]);
  const products = productsResult.status === 'fulfilled' ? productsResult.value : [];
  const categories = categoriesResult.status === 'fulfilled' ? categoriesResult.value : [];
  const analytics =
    analyticsResult.status === 'fulfilled'
      ? analyticsResult.value
      : {
          totalEvents: 0,
          whatsappClicks: 0,
          mapInteractions: 0,
          emptySearches: 0,
          topProducts: [],
          topCategories: [],
          productViews: 0,
          recentWhatsappClicks: 0,
          recentEvents: [],
        };
  const stats = [
    { label: 'Total productos', value: products.length, icon: Boxes },
    { label: 'Categorias', value: categories.length, icon: Layers3 },
    { label: 'Sin imagen', value: products.filter((product) => product.images.length === 0).length, icon: ImageOff },
    { label: 'Destacados', value: products.filter((product) => product.featured).length, icon: Star },
    { label: 'Clics WhatsApp', value: analytics.whatsappClicks, icon: MessageCircle },
    { label: 'Busquedas vacias', value: analytics.emptySearches, icon: SearchX },
    { label: 'Vistas de producto', value: analytics.productViews, icon: Eye },
  ];

  return (
    <div className="admin-shell">
      <AdminNav />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="stat-card">
              <div className="flex items-center justify-between">
                <p className="font-heading text-xs uppercase tracking-[0.14em] text-eb-700">{item.label}</p>
                <Icon className="h-5 w-5 text-eb-accent" />
              </div>
              <p className="mt-6 font-heading text-5xl uppercase tracking-[-0.06em] text-eb-900">
                {item.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="surface p-5">
          <p className="eyebrow">Productos por categoria</p>
          <div className="mt-6 space-y-4">
            {categories.map((category) => {
              const total = products.filter((product) => product.categoryId === category.id).length;
              return (
                <div key={category.id} className="flex items-center justify-between border-b border-eb-300/10 pb-4 last:border-b-0 last:pb-0">
                  <span className="font-heading text-lg uppercase tracking-[-0.03em] text-eb-900">
                    {category.name}
                  </span>
                  <span className="text-sm text-eb-700">{total} productos</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="surface p-5">
          <p className="eyebrow">Ultimas referencias</p>
          <div className="mt-6 space-y-4">
            {products.slice(0, 5).map((product) => (
              <div key={product.id} className="flex items-center justify-between border-b border-eb-300/10 pb-4 last:border-b-0 last:pb-0">
                <div>
                  <p className="font-heading text-lg uppercase tracking-[-0.03em] text-eb-900">
                    {product.name}
                  </p>
                  <p className="text-xs uppercase tracking-[0.16em] text-eb-700">
                    {product.category?.name || 'Sin categoria'} | Ref. {product.reference}
                  </p>
                </div>
                <span className="text-sm text-eb-700">{product.available ? 'Disponible' : 'Sin stock'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="surface p-5">
          <p className="eyebrow">Interacciones</p>
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between border-b border-eb-300/10 pb-4">
              <span className="text-sm text-eb-700">Eventos recientes capturados</span>
              <span className="font-heading text-lg uppercase tracking-[-0.03em] text-eb-900">
                {analytics.totalEvents}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-eb-300/10 pb-4">
              <span className="text-sm text-eb-700">Aperturas de mapa y ruta</span>
              <span className="font-heading text-lg uppercase tracking-[-0.03em] text-eb-900">
                {analytics.mapInteractions}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-eb-300/10 pb-4">
              <span className="text-sm text-eb-700">WhatsApp ultimos 7 dias</span>
              <span className="font-heading text-lg uppercase tracking-[-0.03em] text-eb-900">
                {analytics.recentWhatsappClicks}
              </span>
            </div>
            <p className="text-sm leading-6 text-eb-700">
              Estas metricas te ayudan a ver si los clientes estan preguntando, buscando sin exito
              o intentando llegar al local.
            </p>
          </div>
        </div>

        <div className="surface p-5">
          <p className="eyebrow">Productos con mas interes</p>
          <div className="mt-6 space-y-4">
            {analytics.topProducts.length > 0 ? (
              analytics.topProducts.map((product) => (
                <div
                  key={product.name}
                  className="flex items-center justify-between border-b border-eb-300/10 pb-4 last:border-b-0 last:pb-0"
                >
                  <span className="font-heading text-lg uppercase tracking-[-0.03em] text-eb-900">
                    {product.name}
                  </span>
                  <span className="text-sm text-eb-700">{product.count} interacciones</span>
                </div>
              ))
            ) : (
              <p className="text-sm leading-6 text-eb-700">
                Aun no hay suficientes interacciones registradas para mostrar tendencias.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="surface p-5">
          <p className="eyebrow">Categorias con mas interes</p>
          <div className="mt-6 space-y-4">
            {analytics.topCategories.length > 0 ? (
              analytics.topCategories.map((category) => (
                <div
                  key={category.name}
                  className="flex items-center justify-between border-b border-eb-300/10 pb-4 last:border-b-0 last:pb-0"
                >
                  <span className="font-heading text-lg uppercase tracking-[-0.03em] text-eb-900">
                    {category.name}
                  </span>
                  <span className="text-sm text-eb-700">{category.count} interacciones</span>
                </div>
              ))
            ) : (
              <p className="text-sm leading-6 text-eb-700">
                Todavia no hay suficientes señales para detectar categorias lideres.
              </p>
            )}
          </div>
        </div>

        <div className="surface p-5">
          <p className="eyebrow">Productos por completar</p>
          <div className="mt-6 space-y-4">
            {products.filter(
              (product) =>
                product.images.length === 0 ||
                !product.shortDescription.trim() ||
                !product.description.trim() ||
                !product.reference.trim()
            ).length > 0 ? (
              products
                .filter(
                  (product) =>
                    product.images.length === 0 ||
                    !product.shortDescription.trim() ||
                    !product.description.trim() ||
                    !product.reference.trim()
                )
                .slice(0, 5)
                .map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between border-b border-eb-300/10 pb-4 last:border-b-0 last:pb-0"
                >
                  <div>
                    <span className="font-heading text-lg uppercase tracking-[-0.03em] text-eb-900">
                      {product.name}
                    </span>
                    <p className="text-xs uppercase tracking-[0.16em] text-eb-700">
                      {product.category?.name || 'Sin categoria'}
                    </p>
                  </div>
                  <span className="text-sm text-eb-700">
                    {product.images.length === 0 ? 'Falta imagen' : 'Falta contenido'}
                  </span>
                </div>
                ))
            ) : (
              <p className="text-sm leading-6 text-eb-700">
                Muy bien: no hay referencias urgentes por completar en este momento.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="eyebrow">Actividad reciente</p>
            <h2 className="mt-2 font-heading text-3xl uppercase tracking-[-0.04em] text-eb-900">
              Lo que estan haciendo los clientes
            </h2>
          </div>
          <a href="/api/admin/analytics-export" className="btn-secondary">
            Descargar CSV
          </a>
        </div>

        <div className="mt-6 overflow-x-auto">
          {analytics.recentEvents.length > 0 ? (
            <table className="min-w-full text-sm text-eb-800">
              <thead className="border-b border-eb-300/10 text-left font-heading text-xs uppercase tracking-[0.14em] text-eb-700">
                <tr>
                  <th className="px-4 py-4">Evento</th>
                  <th className="px-4 py-4">Detalle</th>
                  <th className="px-4 py-4">Ruta</th>
                  <th className="px-4 py-4">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {analytics.recentEvents.map((event, index) => (
                  <tr key={`${event.createdAt}-${event.event}-${index}`} className="border-b border-eb-300/10 last:border-b-0">
                    <td className="px-4 py-4">
                      <p className="font-heading text-sm uppercase tracking-[0.12em] text-eb-900">
                        {event.event.replace(/_/g, ' ')}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-eb-700">
                      {event.productName || event.query || event.label || event.category || 'Interaccion general'}
                    </td>
                    <td className="px-4 py-4 text-eb-700">{event.path}</td>
                    <td className="px-4 py-4 text-eb-700">
                      {new Intl.DateTimeFormat('es-CO', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      }).format(new Date(event.createdAt))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-sm leading-6 text-eb-700">
              Todavia no hay actividad reciente suficiente para mostrar en esta tabla.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
