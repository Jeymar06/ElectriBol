export const dynamic = 'force-dynamic';
export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

import { redirect } from 'next/navigation';
import AdminNav from '@/components/AdminNav';
import AdminSiteContentManager from '@/components/AdminSiteContentManager';
import { isAdminAuthenticated } from '@/lib/auth';
import { getSiteContent } from '@/lib/site-content';

export default async function AdminContentPage() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    redirect('/admin/login');
  }

  const content = await getSiteContent();

  return (
    <div className="admin-shell">
      <AdminNav />
      <AdminSiteContentManager initialContent={content} />
    </div>
  );
}
