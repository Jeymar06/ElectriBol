export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import { Boxes, ImageOff, Layers3, Star } from 'lucide-react';
import AdminNav from '@/components/AdminNav';
import { isAdminAuthenticated } from '@/lib/auth';
import { getCategories, getProductsWithCategories } from '@/lib/catalog';

export default async function AdminDashboardPage() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    redirect('/admin/login');
  }

  const [products, categories] = await Promise.all([getProductsWithCategories(), getCategories(false)]);
  const stats = [
    { label: 'Total productos', value: products.length, icon: Boxes },
    { label: 'Categorias', value: categories.length, icon: Layers3 },
    { label: 'Sin imagen', value: products.filter((product) => product.images.length === 0).length, icon: ImageOff },
    { label: 'Destacados', value: products.filter((product) => product.featured).length, icon: Star },
  ];

  return (
    <div className="admin-shell">
      <AdminNav />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="stat-card">
              <div className="flex items-center justify-between">
                <p className="font-heading text-xs uppercase tracking-[0.14em] text-eb-200">{item.label}</p>
                <Icon className="h-5 w-5 text-eb-accent" />
              </div>
              <p className="mt-6 font-heading text-5xl uppercase tracking-[-0.06em] text-white">
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
                  <span className="font-heading text-lg uppercase tracking-[-0.03em] text-white">
                    {category.name}
                  </span>
                  <span className="text-sm text-eb-200">{total} productos</span>
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
                  <p className="font-heading text-lg uppercase tracking-[-0.03em] text-white">
                    {product.name}
                  </p>
                  <p className="text-xs uppercase tracking-[0.16em] text-eb-200">
                    {product.category?.name || 'Sin categoria'} | Ref. {product.reference}
                  </p>
                </div>
                <span className="text-sm text-eb-200">{product.available ? 'Disponible' : 'Sin stock'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
