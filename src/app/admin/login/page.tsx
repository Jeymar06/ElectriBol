export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import AdminLoginForm from '@/components/AdminLoginForm';
import { isAdminAuthenticated } from '@/lib/auth';

export default async function AdminLoginPage() {
  const authenticated = await isAdminAuthenticated();
  if (authenticated) {
    redirect('/admin');
  }

  return (
    <div className="admin-shell min-h-screen items-center justify-center">
      <AdminLoginForm />
    </div>
  );
}
