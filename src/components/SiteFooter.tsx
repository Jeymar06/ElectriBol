import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import { siteConfig } from '@/lib/site';

export default function SiteFooter() {
  return (
    <footer className="border-t border-eb-500/10 bg-white/90">
      <div className="shell grid gap-10 py-12 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div className="space-y-4">
          <p className="eyebrow">ElectriBol</p>
          <h2 className="font-heading text-3xl uppercase tracking-[-0.04em] text-eb-900">
            Iluminacion, cables y soluciones electricas para tu proyecto.
          </h2>
          <p className="max-w-xl text-sm text-eb-700">{siteConfig.description}</p>
          <div className="h-px w-24 bg-eb-500/20" />
        </div>

        <div className="space-y-4 text-sm text-eb-700">
          <p className="font-heading text-sm uppercase tracking-[0.14em] text-eb-900">Navegacion</p>
          <div className="flex flex-col gap-3">
            <Link href="/">Inicio</Link>
            <Link href="/catalogo">Catalogo</Link>
            <Link href="/contacto">Contacto</Link>
          </div>
        </div>

        <div className="space-y-4 text-sm text-eb-700">
          <p className="font-heading text-sm uppercase tracking-[0.14em] text-eb-900">Contacto</p>
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 text-eb-accent" />
            <span>{siteConfig.address}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-eb-accent" />
            <a href={`tel:${siteConfig.whatsappNumber}`}>{siteConfig.whatsappDisplay}</a>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-eb-accent" />
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
