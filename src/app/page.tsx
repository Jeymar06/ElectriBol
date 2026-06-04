export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { ArrowRight, CheckCircle2, MoveRight, ShieldCheck, Sparkles, Truck, Zap } from 'lucide-react';
import HomeHero from '@/components/home/HomeHero';
import LocationExperience from '@/components/home/LocationExperience';
import MotionSection from '@/components/home/MotionSection';
import CategoryIcon from '@/components/CategoryIcon';
import CustomerTrustBand from '@/components/CustomerTrustBand';
import ProductCard from '@/components/ProductCard';
import {
  getCategories,
  getFeaturedProducts,
  getProductsByCategory,
  getProductsWithCategories,
} from '@/lib/catalog';
import { getSiteContent } from '@/lib/site-content';
import { buildMetadata } from '@/utils/seo';

export const metadata = buildMetadata({
  title: 'ElectriBol | Muestrario digital',
  description:
    'Muestrario digital de ElectriBol con lamparas LED, cables, reflectores e iluminacion exterior en Cantagallo, Bolivar.',
  path: '/',
});

const benefits = [
  {
    title: 'Asesoria confiable',
    text: 'Te ayudamos a elegir lo que mejor se ajusta a tu hogar, negocio o proyecto.',
    icon: ShieldCheck,
  },
  {
    title: 'Compra mas clara',
    text: 'Encuentra rapido categorias, referencias destacadas y formas de contacto sin dar vueltas.',
    icon: Sparkles,
  },
  {
    title: 'Atencion local',
    text: 'Tienes a mano direccion, WhatsApp y ruta para visitarnos o consultarnos cuando quieras.',
    icon: Truck,
  },
  {
    title: 'Variedad electrica',
    text: 'Desde iluminacion hasta accesorios, reunimos lo que mas necesitas para tus instalaciones.',
    icon: Zap,
  },
];

export default async function HomePage() {
  const [categories, featuredProducts, allProducts] = await Promise.all([
    getCategories(true),
    getFeaturedProducts(6),
    getProductsWithCategories(),
  ]);
  const content = await getSiteContent();

  const categoryCards = await Promise.all(
    categories.map(async (category) => ({
      category,
      total: (await getProductsByCategory(category.id)).length,
    }))
  );

  const heroProducts = featuredProducts.length > 0 ? featuredProducts : allProducts.slice(0, 3);
  const marqueeItems = content.salesPhrases;

  return (
    <div className="overflow-hidden">
      <HomeHero
        products={heroProducts}
        totalProducts={allProducts.length}
        totalCategories={categories.length}
        content={content}
      />

      <section className="pb-8">
        <div className="ticker-shell">
          <div className="ticker-row">
            {[...marqueeItems, ...marqueeItems].map((item, index) => (
              <span key={`${item}-${index}`} className="ticker-pill">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <MotionSection>
        <div className="shell">
          <CustomerTrustBand content={content} />
        </div>
      </MotionSection>

      <MotionSection className="section-space pt-8">
        <div className="shell">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <p className="eyebrow">Categorias</p>
              <h2 className="display-title text-4xl sm:text-5xl">
                {content.home.categoriesTitle}
              </h2>
            </div>
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 font-heading text-sm uppercase tracking-[0.14em] text-eb-800"
            >
              Ver todo el catalogo
              <MoveRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {categoryCards.map(({ category, total }, index) => (
              <Link
                key={category.id}
                href={`/catalogo/${category.slug}`}
                className={`category-spotlight ${index % 3 === 0 ? 'category-spotlight-strong' : ''}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <CategoryIcon name={category.icon} className="h-8 w-8 text-eb-accent" />
                  <span className="font-heading text-[11px] uppercase tracking-[0.2em] text-eb-700">
                    {total} refs
                  </span>
                </div>
                <div className="space-y-3">
                  <h3 className="font-heading text-3xl uppercase tracking-[-0.05em] text-eb-900">
                    {category.name}
                  </h3>
                  <p className="text-sm leading-7 text-eb-700">{category.description}</p>
                </div>
                <span className="inline-flex items-center gap-2 font-heading text-xs uppercase tracking-[0.16em] text-eb-800">
                  Explorar
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </MotionSection>

      <MotionSection className="section-space">
        <div className="shell">
          <div className="feature-ribbon">
            <div className="max-w-2xl space-y-4">
              <p className="eyebrow">Por que elegirnos</p>
              <h2 className="display-title text-4xl sm:text-5xl">
                {content.home.trustTitle}
              </h2>
              <p className="text-base leading-8 text-eb-700">
                {content.home.trustText}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {benefits.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="glass-slab p-5">
                    <Icon className="h-7 w-7 text-eb-accent" />
                    <h3 className="mt-5 font-heading text-2xl uppercase tracking-[-0.04em] text-eb-900">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-eb-700">{item.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </MotionSection>

      <MotionSection className="section-space pt-12">
        <div className="shell">
          <div className="product-shelf-shell">
            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl space-y-4">
                <p className="eyebrow">Destacados</p>
                <h2 className="display-title text-4xl sm:text-5xl">
                  {content.home.featuredTitle}
                </h2>
                <p className="max-w-2xl text-sm leading-7 text-eb-700">
                  {content.home.featuredSubtitle}
                </p>
              </div>
              <Link
                href="/catalogo"
                className="inline-flex items-center gap-2 font-heading text-sm uppercase tracking-[0.08em] text-eb-800"
              >
                Catalogo completo
                <MoveRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="product-shelf">
              {featuredProducts.map((product) => (
                <div key={product.id} className="product-shelf-item">
                  <ProductCard product={product} whatsappNumber={content.contact.whatsappNumber} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </MotionSection>

      <MotionSection className="section-space pb-10">
        <div className="shell">
          <div className="story-slab">
            <div className="space-y-5">
              <p className="eyebrow">Compra con respaldo</p>
              <h2 className="display-title text-4xl sm:text-5xl">
                {content.home.storyTitle}
              </h2>
              <p className="text-base leading-8 text-eb-700">
                {content.home.storyText}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="glass-slab p-5">
                <p className="font-heading text-[11px] uppercase tracking-[0.2em] text-eb-700">
                  Atencion
                </p>
                <p className="mt-3 font-heading text-3xl uppercase tracking-[-0.05em] text-eb-900">
                  Cercana
                </p>
              </div>
              <div className="glass-slab p-5">
                <p className="font-heading text-[11px] uppercase tracking-[0.2em] text-eb-700">
                  Respuesta
                </p>
                <p className="mt-3 font-heading text-3xl uppercase tracking-[-0.05em] text-eb-900">
                  Rapida
                </p>
              </div>
              <div className="glass-slab p-5">
                <p className="font-heading text-[11px] uppercase tracking-[0.2em] text-eb-700">
                  Compra
                </p>
                <p className="mt-3 font-heading text-3xl uppercase tracking-[-0.05em] text-eb-900">
                  Segura
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-eb-500/10 bg-white/90 px-4 py-2 text-sm text-eb-800">
              <CheckCircle2 className="h-4 w-4 text-eb-accent" />
              Escribenos por WhatsApp y recibe ayuda para encontrar la referencia indicada.
            </div>
          </div>
        </div>
      </MotionSection>

      <MotionSection>
        <LocationExperience content={content} />
      </MotionSection>
    </div>
  );
}
