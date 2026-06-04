export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import AdminCategoriesManager from '@/components/AdminCategoriesManager';
import AdminNav from '@/components/AdminNav';
import { isAdminAuthenticated } from '@/lib/auth';
import { getCategories } from '@/lib/catalog';

export default async function AdminCategoriesPage() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    redirect('/admin/login');
  }

  const categories = await getCategories(false);

  return (
    <div className="admin-shell">
      <AdminNav />
      <AdminCategoriesManager initialCategories={categories} />
    </div>
  );
}
