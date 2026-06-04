import { Clock3, MapPin, MessageCircle, ShieldCheck } from 'lucide-react';
import type { SiteContent } from '@/types';

export default function AnnouncementBar({ content }: { content: SiteContent }) {
  const items = [
    { label: content.contact.city, icon: MapPin },
    { label: 'WhatsApp directo', icon: MessageCircle },
    { label: content.contact.hours.split('|')[0], icon: Clock3 },
    { label: content.brand.announcement || 'Asesoria antes de comprar', icon: ShieldCheck },
  ];

  return (
    <div className="border-b border-eb-500/10 bg-eb-900 text-white">
      <div className="shell">
        <div className="announcement-grid">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.label} className="announcement-item">
                <Icon className="h-3.5 w-3.5 text-eb-accent" />
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
