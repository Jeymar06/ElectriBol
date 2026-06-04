'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { ArrowRight, CheckCircle2, MapPin, MessageCircle, Sparkles } from 'lucide-react';
import { gsap } from 'gsap';
import type { ProductWithCategory } from '@/types';
import ProductImage from '@/components/ProductImage';
import { siteConfig } from '@/lib/site';

interface HomeHeroProps {
  products: ProductWithCategory[];
  totalProducts: number;
  totalCategories: number;
}

export default function HomeHero({
  products,
  totalProducts,
  totalCategories,
}: HomeHeroProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-hero-copy]',
        { autoAlpha: 0, y: 32 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
        }
      );

      gsap.fromTo(
        '[data-scene-card]',
        { autoAlpha: 0, y: 64, rotate: (index: number) => (index % 2 === 0 ? -6 : 6) },
        {
          autoAlpha: 1,
          y: 0,
          rotate: 0,
          duration: 1.1,
          stagger: 0.14,
          ease: 'power3.out',
        }
      );

      gsap.to('[data-float-card="1"]', {
        y: -18,
        repeat: -1,
        yoyo: true,
        duration: 2.8,
        ease: 'sine.inOut',
      });

      gsap.to('[data-float-card="2"]', {
        y: 16,
        repeat: -1,
        yoyo: true,
        duration: 3.4,
        ease: 'sine.inOut',
      });

      gsap.to('[data-float-card="3"]', {
        y: -12,
        repeat: -1,
        yoyo: true,
        duration: 3,
        ease: 'sine.inOut',
      });
    }, element);

    return () => ctx.revert();
  }, []);

  const [lead, second, third] = products;

  return (
    <section className="hero-shell overflow-hidden pb-10 pt-6 md:pt-8" ref={ref}>
      <div className="shell">
        <div className="grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="space-y-7">
            <div data-hero-copy className="inline-flex items-center gap-2 rounded-full border border-eb-500/10 bg-white/88 px-4 py-2 backdrop-blur">
              <Sparkles className="h-4 w-4 text-eb-accent" />
              <span className="font-heading text-[11px] uppercase tracking-[0.22em] text-eb-800">
                Electricos, LED y soluciones para obra
              </span>
            </div>

            <div data-hero-copy className="space-y-5">
              <p className="eyebrow">Cantagallo, Bolivar</p>
              <h1 className="display-title max-w-5xl text-6xl leading-[0.88] sm:text-7xl lg:text-[6.5rem]">
                Catalogo vivo, <span className="text-eb-500">ritmo visual</span> y cotizacion directa.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-eb-700 sm:text-lg">
                Diseñamos ElectriBol para que se sienta mas premium, mas rapido y mas claro:
                referencias visibles, categorias fluidas, movimiento suave y contacto inmediato por
                WhatsApp.
              </p>
            </div>

            <div data-hero-copy className="flex flex-col gap-3 sm:flex-row">
              <Link href="/catalogo" className="btn-primary">
                Explorar catalogo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <a
                href={`https://wa.me/${siteConfig.whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Abrir WhatsApp
              </a>
            </div>

            <div data-hero-copy className="grid gap-4 sm:grid-cols-3">
              <div className="glass-slab p-4">
                <p className="font-heading text-[11px] uppercase tracking-[0.18em] text-eb-700">
                  Referencias
                </p>
                <p className="mt-3 font-heading text-3xl uppercase tracking-[-0.05em] text-eb-900">
                  {totalProducts}
                </p>
              </div>
              <div className="glass-slab p-4">
                <p className="font-heading text-[11px] uppercase tracking-[0.18em] text-eb-700">
                  Categorias
                </p>
                <p className="mt-3 font-heading text-3xl uppercase tracking-[-0.05em] text-eb-900">
                  {totalCategories}
                </p>
              </div>
              <div className="glass-slab p-4">
                <p className="font-heading text-[11px] uppercase tracking-[0.18em] text-eb-700">
                  Atencion
                </p>
                <p className="mt-3 font-heading text-3xl uppercase tracking-[-0.05em] text-eb-900">
                  Directa
                </p>
              </div>
            </div>

            <div data-hero-copy className="flex flex-wrap gap-5 text-sm text-eb-800">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-eb-accent" />
                Catalogo sin friccion
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-eb-accent" />
                Cotizacion por WhatsApp
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-eb-accent" />
                {siteConfig.city}
              </span>
            </div>
          </div>

          <div className="hero-stage">
            <div className="hero-stage-grid">
              {lead ? (
                <article className="scene-card scene-card-main" data-scene-card data-float-card="1">
                  <div className="relative aspect-[4/4.6] overflow-hidden rounded-[26px]">
                    <ProductImage
                      product={lead}
                      fill
                      priority
                      sizes="(max-width: 1200px) 100vw, 38vw"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="space-y-2 p-5">
                    <p className="font-heading text-[11px] uppercase tracking-[0.22em] text-eb-700">
                      Destacado principal
                    </p>
                    <h2 className="font-heading text-3xl uppercase tracking-[-0.05em] text-eb-900">
                      {lead.name}
                    </h2>
                    <p className="text-sm leading-6 text-eb-700">{lead.shortDescription}</p>
                  </div>
                </article>
              ) : null}

              {second ? (
                <article className="scene-card scene-card-side" data-scene-card data-float-card="2">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[24px]">
                    <ProductImage
                      product={second}
                      fill
                      sizes="(max-width: 1200px) 100vw, 26vw"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading text-2xl uppercase tracking-[-0.04em] text-eb-900">
                      {second.name}
                    </h3>
                  </div>
                </article>
              ) : null}

              <div className="scene-utility" data-scene-card data-float-card="3">
                <div className="hero-panel min-h-[190px] p-6">
                  <p className="font-heading text-xs uppercase tracking-[0.26em] text-white/65">
                    Horario y cobertura
                  </p>
                  <p className="mt-3 font-heading text-3xl uppercase tracking-[-0.05em] text-white">
                    {siteConfig.city}
                  </p>
                  <p className="mt-4 text-sm leading-7 text-white/75">{siteConfig.hours}</p>
                </div>

                {third ? (
                  <article className="scene-card scene-card-mini">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[22px]">
                      <ProductImage
                        product={third}
                        fill
                        sizes="(max-width: 1200px) 100vw, 24vw"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-heading text-xl uppercase tracking-[-0.04em] text-eb-900">
                        {third.name}
                      </h3>
                    </div>
                  </article>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
