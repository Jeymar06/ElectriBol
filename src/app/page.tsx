export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { ArrowRight, Boxes, CheckCircle2, MapPin, ShieldCheck, Truck, Zap } from 'lucide-react';
import CategoryIcon from '@/components/CategoryIcon';
import ProductCard from '@/components/ProductCard';
import { getCategories, getFeaturedProducts, getProductsByCategory, getProductsWithCategories } from '@/lib/catalog';
import { siteConfig } from '@/lib/site';
import { buildMetadata } from '@/utils/seo';

export const metadata = buildMetadata({
  title: 'ElectriBol | Muestrario digital',
  description:
    'Muestrario digital de ElectriBol con lamparas LED, cables, reflectores e iluminacion exterior en Cantagallo, Bolivar.',
  path: '/',
});

const benefits = [
  {
    title: 'Asesoria real',
    text: 'Te ayudamos a elegir productos para vivienda, comercio y obra.',
    icon: ShieldCheck,
  },
  {
    title: 'Entrega agil',
    text: 'Atencion rapida por WhatsApp para separar y coordinar pedidos.',
    icon: Truck,
  },
  {
    title: 'Catalogo util',
    text: 'Referencias claras, precios en COP y fichas faciles de revisar.',
    icon: Boxes,
  },
  {
    title: 'Enfoque electrico',
    text: 'Trabajamos con lo que mas se mueve en instalaciones y alumbrado.',
    icon: Zap,
  },
];

export default async function HomePage() {
  const [categories, featuredProducts, allProducts] = await Promise.all([
    getCategories(true),
    getFeaturedProducts(8),
    getProductsWithCategories(),
  ]);

  const categoryCards = await Promise.all(
    categories.map(async (category) => ({
      category,
      total: (await getProductsByCategory(category.id)).length,
    }))
  );

  return (
    <div>
      <section className="section-space editorial-grid pb-10">
        <div className="shell">
          <div className="grid items-end gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-7">
              <p className="eyebrow">Ferreteria electrica en Cantagallo</p>
              <h1 className="display-title max-w-5xl text-5xl leading-[0.92] sm:text-6xl lg:text-7xl">
                ElectriBol es tu vitrina para iluminacion, cables y soluciones electricas.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-eb-700 sm:text-lg">
                Sin carrito, sin vueltas. Mira el catalogo, revisa referencias y escribe por WhatsApp
                para cotizar rapido desde Cantagallo, Bolivar.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/catalogo" className="btn-primary">
                  Ver catalogo
                </Link>
                <a
                  href={`https://wa.me/${siteConfig.whatsappNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary"
                >
                  WhatsApp
                </a>
              </div>
              <div className="grid max-w-2xl grid-cols-2 gap-4 pt-2 sm:grid-cols-3">
                <div className="surface p-4">
                  <p className="font-heading text-xs uppercase tracking-[0.18em] text-eb-600">Cobertura</p>
                  <p className="mt-3 font-heading text-2xl uppercase tracking-[-0.04em] text-eb-900">
                    Cantagallo
                  </p>
                </div>
                <div className="surface p-4">
                  <p className="font-heading text-xs uppercase tracking-[0.18em] text-eb-600">Consulta</p>
                  <p className="mt-3 font-heading text-2xl uppercase tracking-[-0.04em] text-eb-900">
                    WhatsApp
                  </p>
                </div>
                <div className="surface col-span-2 p-4 sm:col-span-1">
                  <p className="font-heading text-xs uppercase tracking-[0.18em] text-eb-600">Foco</p>
                  <p className="mt-3 font-heading text-2xl uppercase tracking-[-0.04em] text-eb-900">
                    LED &amp; Energia
                  </p>
                </div>
              </div>
            </div>

            <div className="hero-panel relative overflow-hidden p-7">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(41,182,246,0.28),transparent_32%)]" />
              <div className="absolute inset-y-0 right-12 hidden w-px bg-white/10 lg:block" />
              <div className="relative grid gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-5">
                  <p className="font-heading text-xs uppercase tracking-[0.3em] text-white/70">Siempre visible</p>
                  <p className="mt-3 font-heading text-3xl uppercase tracking-[-0.04em] text-white">
                    {allProducts.length} referencias listas para cotizar
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-5">
                    <p className="text-sm text-white/70">Ciudad</p>
                    <p className="mt-2 font-heading text-2xl uppercase tracking-[-0.04em] text-white">
                      {siteConfig.city}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-5">
                    <p className="text-sm text-white/70">Horario</p>
                    <p className="mt-2 text-sm leading-6 text-white">{siteConfig.hours}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-space border-y border-eb-500/10 bg-white/70">
        <div className="shell">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Categorias</p>
              <h2 className="display-title mt-3 text-4xl">
                Lo que mas se mueve en el mostrario
              </h2>
            </div>
            <Link href="/catalogo" className="hidden font-heading text-sm uppercase tracking-[0.14em] text-eb-800 md:inline-flex">
              Ver todo el catalogo
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {categoryCards.map(({ category, total }) => (
              <Link
                key={category.id}
                href={`/catalogo/${category.slug}`}
                className="surface group p-5 transition hover:-translate-y-1 hover:border-eb-300/30"
              >
                <CategoryIcon name={category.icon} className="h-8 w-8 text-eb-accent" />
                  <h3 className="mt-6 font-heading text-2xl uppercase tracking-[-0.04em] text-eb-900">
                    {category.name}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-eb-700">{category.description}</p>
                  <p className="mt-5 font-heading text-xs uppercase tracking-[0.18em] text-eb-800">
                    {total} productos
                  </p>
                </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="shell space-y-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Productos destacados</p>
              <h2 className="display-title mt-3 text-4xl">
                Seleccionados por el admin para vender rapido
              </h2>
            </div>
            <Link href="/catalogo" className="font-heading text-sm uppercase tracking-[0.14em] text-eb-800">
              Ir al catalogo completo
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-space border-y border-eb-500/10 bg-[linear-gradient(180deg,rgba(21,101,192,0.03),rgba(255,255,255,0.7))]">
        <div className="shell">
          <div className="mb-8">
            <p className="eyebrow">Por que elegirnos</p>
            <h2 className="display-title mt-3 text-4xl">
              Un catalogo hecho para cotizar rapido
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="surface p-5">
                  <Icon className="h-8 w-8 text-eb-accent" />
                  <h3 className="mt-6 font-heading text-2xl uppercase tracking-[-0.04em] text-eb-900">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-eb-700">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="shell">
          <div className="surface grid gap-8 p-6 md:grid-cols-[1fr_0.9fr] md:p-8">
            <div className="space-y-4">
              <p className="eyebrow">Contacto directo</p>
              <h2 className="display-title text-4xl">
                Escribenos y te ayudamos a encontrar la referencia correcta.
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-eb-700">
                Atendemos consultas por WhatsApp, telefono y correo. Si estas armando una lista
                para vivienda, local o proyecto, podemos apoyarte con referencias y disponibilidad.
              </p>
              <div className="flex flex-col gap-3 text-sm text-eb-800">
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-eb-accent" />
                  <span>{siteConfig.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-eb-accent" />
                  <span>{siteConfig.hours}</span>
                </div>
              </div>
            </div>

            <div className="hero-panel flex flex-col justify-between gap-5 p-6">
              <div>
                <p className="font-heading text-sm uppercase tracking-[0.14em] text-white/70">
                  WhatsApp directo
                </p>
                <p className="mt-3 font-heading text-3xl uppercase tracking-[-0.04em] text-white">
                  {siteConfig.whatsappDisplay}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href={`https://wa.me/${siteConfig.whatsappNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary"
                >
                  Abrir chat
                </a>
                <Link href="/contacto" className="btn-secondary">
                  Ver contacto
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
