'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Phone, X, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { SiteContent } from '@/types';

const links = [
  { href: '/', label: 'Inicio' },
  { href: '/catalogo', label: 'Catalogo' },
  { href: '/contacto', label: 'Contacto' },
];

export default function SiteHeader({ content }: { content: SiteContent }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition ${
        scrolled
          ? 'border-eb-500/10 bg-[rgba(255,255,255,0.86)] backdrop-blur-xl'
          : 'border-transparent bg-[rgba(255,255,255,0.72)]'
      }`}
    >
      <div className="shell flex h-20 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-eb-500/10 bg-eb-100">
            {content.brand.logoUrl ? (
              <Image
                src={content.brand.logoUrl}
                alt={content.brand.name}
                fill
                unoptimized
                className="object-contain p-1.5"
              />
            ) : (
              <span className="font-heading text-2xl uppercase tracking-tight text-eb-900">
                {content.brand.name.slice(0, 1) || 'E'}<Zap className="relative -left-1 inline h-4 w-4 text-eb-500" />
              </span>
            )}
          </div>
          <div>
            <p className="font-heading text-xl uppercase tracking-[-0.04em] text-eb-900">
              {content.brand.name}
            </p>
            <p className="text-xs text-eb-700">{content.contact.city}</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-heading text-sm uppercase tracking-[0.14em] transition ${
                pathname === link.href ? 'text-eb-900' : 'text-eb-700 hover:text-eb-900'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a href={`tel:${content.contact.whatsappNumber}`} className="btn-secondary">
            <Phone className="mr-2 h-4 w-4" />
            Llamar
          </a>
          <a
            href={`https://wa.me/${content.contact.whatsappNumber}`}
            target="_blank"
            rel="noreferrer"
            className="btn-primary"
          >
            WhatsApp
          </a>
        </div>

        <button
          type="button"
          className="inline-flex rounded-lg border border-eb-500/10 bg-white p-3 text-eb-900 md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Abrir menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      <div className="shell hidden items-center justify-between border-t border-eb-500/10 py-3 text-[11px] font-heading uppercase tracking-[0.18em] text-eb-700 md:flex">
        <span>{content.brand.tagline}</span>
        <span>{content.contact.hours}</span>
      </div>

      {open && (
        <div className="border-t border-eb-500/10 bg-white md:hidden">
          <div className="shell flex flex-col gap-4 py-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-heading text-sm uppercase tracking-[0.14em] text-eb-900"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`https://wa.me/${content.contact.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="btn-primary w-full"
            >
              WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
