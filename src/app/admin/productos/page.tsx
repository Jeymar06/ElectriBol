export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import AdminNav from '@/components/AdminNav';
import AdminProductsManager from '@/components/AdminProductsManager';
import { isAdminAuthenticated } from '@/lib/auth';
import { getCategories, getProductsWithCategories } from '@/lib/catalog';

export default async function AdminProductsPage() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    redirect('/admin/login');
  }

  const [products, categories] = await Promise.all([getProductsWithCategories(), getCategories(false)]);

  return (
    <div className="admin-shell">
      <AdminNav />
      <AdminProductsManager initialProducts={products} categories={categories} />
    </div>
  );
}
