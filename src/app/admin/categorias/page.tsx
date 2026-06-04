export const dynamic = 'force-dynamic';
export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

import { redirect } from 'next/navigation';
import AdminCategoriesManager from '@/components/AdminCategoriesManager';
import AdminNav from '@/components/AdminNav';
import { isAdminAuthenticated } from '@/lib/auth';
import { getCategories, getProductsWithCategories } from '@/lib/catalog';

export default async function AdminCategoriesPage() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    redirect('/admin/login');
  }

  const [categories, products] = await Promise.all([getCategories(false), getProductsWithCategories()]);

  return (
    <div className="admin-shell">
      <AdminNav />
      <AdminCategoriesManager initialCategories={categories} products={products} />
    </div>
  );
}
