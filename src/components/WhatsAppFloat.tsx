'use client';

import { MessageCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { createWhatsAppUrl } from '@/lib/site';
import TrackableExternalLink from '@/components/TrackableExternalLink';
import type { SiteContent } from '@/types';

export default function WhatsAppFloat({ content }: { content: SiteContent }) {
  const pathname = usePathname();
  const hiddenOnMobileProduct = pathname.startsWith('/producto/');

  return (
    <TrackableExternalLink
      href={createWhatsAppUrl(
        'Hola, quiero consultar productos electricos disponibles en ElectriBol.',
        content.contact.whatsappNumber
      )}
      target="_blank"
      rel="noreferrer"
      tracking={{ event: 'whatsapp_click', label: 'floating_whatsapp' }}
      className={`fixed bottom-5 right-5 z-50 h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-[0_16px_40px_rgba(37,211,102,0.35)] transition hover:scale-105 ${
        hiddenOnMobileProduct ? 'hidden md:inline-flex' : 'inline-flex'
      }`}
      aria-label="Hablar por WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </TrackableExternalLink>
  );
}
