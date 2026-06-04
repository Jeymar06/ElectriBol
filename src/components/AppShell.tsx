'use client';

import { usePathname } from 'next/navigation';
import AnnouncementBar from '@/components/AnnouncementBar';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import type { SiteContent } from '@/types';

interface AppShellProps {
  children: React.ReactNode;
  content: SiteContent;
}

export default function AppShell({ children, content }: AppShellProps) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <AnnouncementBar content={content} />
      <SiteHeader content={content} />
      <main>{children}</main>
      <SiteFooter content={content} />
      <WhatsAppFloat content={content} />
    </>
  );
}
