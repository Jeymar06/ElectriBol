import { MessageCircle } from 'lucide-react';
import { buildGeneralWhatsAppUrl } from '@/lib/site';

export default function WhatsAppFloat() {
  return (
    <a
      href={buildGeneralWhatsAppUrl()}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-[0_16px_40px_rgba(37,211,102,0.35)] transition hover:scale-105"
      aria-label="Hablar por WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
