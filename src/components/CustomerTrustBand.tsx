import { Clock3, MapPin, MessageCircle, ShieldCheck } from 'lucide-react';
import { siteConfig } from '@/lib/site';
import type { SiteContent } from '@/types';

export default function CustomerTrustBand({ content }: { content?: SiteContent }) {
  const items = [
    {
      label: content?.trustBand.whatsappLabel || 'WhatsApp directo',
      detail: content?.trustBand.whatsappDetail || 'Consulta disponibilidad y precios',
      icon: MessageCircle,
    },
    {
      label: content?.contact.city || siteConfig.city,
      detail: content?.trustBand.locationDetail || 'Atencion local y ruta al negocio',
      icon: MapPin,
    },
    {
      label: content?.trustBand.adviceLabel || 'Asesoria antes de comprar',
      detail: content?.trustBand.adviceDetail || 'Te ayudamos a elegir la referencia',
      icon: ShieldCheck,
    },
    {
      label: content?.trustBand.scheduleLabel || 'Horario visible',
      detail: (content?.contact.hours || siteConfig.hours).split('|')[0],
      icon: Clock3,
    },
  ];

  return (
    <div className="customer-trust-band">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.label} className="customer-trust-item">
            <Icon className="h-5 w-5 text-eb-accent" />
            <div>
              <p className="font-heading text-sm uppercase text-eb-900">{item.label}</p>
              <p className="mt-1 text-xs leading-5 text-eb-700">{item.detail}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
