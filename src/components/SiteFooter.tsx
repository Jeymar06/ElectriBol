import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import type { SiteContent } from '@/types';

export default function SiteFooter({ content }: { content: SiteContent }) {
  return (
    <footer className="border-t border-eb-500/10 bg-white/90">
      <div className="shell grid gap-10 py-12 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div className="space-y-4">
          <p className="eyebrow">{content.brand.name}</p>
          <h2 className="font-heading text-3xl uppercase tracking-[-0.04em] text-eb-900">
            {content.brand.tagline}
          </h2>
          <p className="max-w-xl text-sm text-eb-700">{content.brand.description}</p>
          <div className="h-px w-24 bg-eb-500/20" />
        </div>

        <div className="space-y-4 text-sm text-eb-700">
          <p className="font-heading text-sm uppercase tracking-[0.14em] text-eb-900">
            {content.nav.footerTitle}
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/">{content.nav.homeLabel}</Link>
            <Link href="/catalogo">{content.nav.catalogLabel}</Link>
            <Link href="/contacto">{content.nav.contactLabel}</Link>
            <Link
              href="/admin/login"
              className="pt-2 font-heading text-[11px] uppercase tracking-[0.18em] text-eb-600"
            >
              {content.nav.adminAccessLabel}
            </Link>
          </div>
        </div>

        <div className="space-y-4 text-sm text-eb-700">
          <p className="font-heading text-sm uppercase tracking-[0.14em] text-eb-900">
            {content.nav.contactLabel}
          </p>
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 text-eb-accent" />
            <span>{content.contact.address}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-eb-accent" />
            <a href={`tel:${content.contact.whatsappNumber}`}>{content.contact.whatsappDisplay}</a>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-eb-accent" />
            <a href={`mailto:${content.contact.email}`}>{content.contact.email}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
