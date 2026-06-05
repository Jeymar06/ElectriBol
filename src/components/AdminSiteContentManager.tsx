'use client';

import Image from 'next/image';
import {
  Building2,
  Contact,
  FileSearch,
  Home,
  ImagePlus,
  Menu,
  MapPin,
  Package,
  Save,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { useState } from 'react';
import type { EditableBenefit, EditableStat, SiteContent } from '@/types';

type SectionKey =
  | 'brand'
  | 'seo'
  | 'nav'
  | 'contact'
  | 'home'
  | 'catalog'
  | 'contactPage'
  | 'trustBand'
  | 'locationSection'
  | 'productPage'
  | 'productCard';
type StringKey<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

function updateNested<T extends SectionKey>(
  content: SiteContent,
  section: T,
  key: StringKey<SiteContent[T]>,
  value: string
): SiteContent {
  return {
    ...content,
    [section]: {
      ...content[section],
      [key]: value,
    },
  };
}

function buildMapsLinks(query: string) {
  const encodedQuery = encodeURIComponent(query);
  return {
    googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`,
    googleMapsEmbedUrl: `https://www.google.com/maps?q=${encodedQuery}&z=16&output=embed`,
  };
}

function buildMapsQuery(address: string, city: string) {
  return [address, city, 'Colombia'].filter(Boolean).join(', ');
}

function formatStats(items: EditableStat[]) {
  return items.map((item) => `${item.label} | ${item.value}`).join('\n');
}

function parseStats(value: string): EditableStat[] {
  return value
    .split('\n')
    .map((line) => line.split('|').map((part) => part.trim()))
    .filter(([label, statValue]) => Boolean(label && statValue))
    .map(([label, statValue]) => ({ label, value: statValue }));
}

function formatBenefits(items: EditableBenefit[]) {
  return items.map((item) => `${item.title} | ${item.text}`).join('\n');
}

function parseBenefits(value: string): EditableBenefit[] {
  return value
    .split('\n')
    .map((line) => line.split('|').map((part) => part.trim()))
    .filter(([title, text]) => Boolean(title && text))
    .map(([title, text]) => ({ title, text }));
}

export default function AdminSiteContentManager({ initialContent }: { initialContent: SiteContent }) {
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2600);
  };

  const updateMapsFromQuery = (query: string, nextContent = content) => {
    const links = buildMapsLinks(query);
    return {
      ...nextContent,
      contact: {
        ...nextContent.contact,
        googleMapsQuery: query,
        ...links,
      },
    };
  };

  const handleAddressChange = (address: string) => {
    const query = buildMapsQuery(address, content.contact.city);
    setContent(
      updateMapsFromQuery(query, {
        ...content,
        contact: {
          ...content.contact,
          address,
        },
      })
    );
  };

  const handleCityChange = (city: string) => {
    const query = buildMapsQuery(content.contact.address, city);
    setContent(
      updateMapsFromQuery(query, {
        ...content,
        contact: {
          ...content.contact,
          city,
        },
      })
    );
  };

  const handleMapsQueryChange = (query: string) => {
    setContent(updateMapsFromQuery(query));
  };

  const handleSave = async () => {
    setSaving(true);
    const response = await fetch('/api/admin/site-content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content),
    });
    setSaving(false);

    if (!response.ok) {
      showToast('No fue posible guardar el contenido');
      return;
    }

    const saved = (await response.json()) as SiteContent;
    setContent(saved);
    showToast('Contenido guardado');
  };

  const handleLogoUpload = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) {
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('files', file);
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    setUploading(false);

    if (!response.ok) {
      showToast('No fue posible subir el logo');
      return;
    }

    const data = (await response.json()) as { files: string[] };
    setContent(updateNested(content, 'brand', 'logoUrl', data.files[0] || ''));
    showToast('Logo cargado. Recuerda guardar los cambios.');
  };

  return (
    <div className="space-y-6">
      {toast ? (
        <div className="rounded-xl border border-emerald-400/30 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {toast}
        </div>
      ) : null}

      <div className="surface flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="eyebrow">Contenido editable</p>
          <h2 className="mt-2 font-heading text-3xl uppercase tracking-[-0.04em] text-eb-900">
            Textos, marca y datos del sitio
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-eb-700">
            Cambios para lo que ve el cliente en inicio, catalogo, contacto, header y footer.
          </p>
        </div>
        <button type="button" className="btn-primary" disabled={saving} onClick={() => void handleSave()}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>

      <section className="surface p-5 md:p-6">
        <div className="mb-5 flex items-center gap-3">
          <Building2 className="h-5 w-5 text-eb-accent" />
          <h3 className="font-heading text-2xl uppercase tracking-[-0.04em] text-eb-900">Marca</h3>
        </div>

        <div className="grid gap-4 md:grid-cols-[0.7fr_1.3fr]">
          <div className="rounded-2xl border border-eb-500/10 bg-eb-50 p-4">
            <div className="relative mb-4 aspect-square overflow-hidden rounded-xl bg-white">
              {content.brand.logoUrl ? (
                <Image
                  src={content.brand.logoUrl}
                  alt={content.brand.name}
                  fill
                  unoptimized
                  className="object-contain p-4"
                />
              ) : (
                <div className="flex h-full items-center justify-center font-heading text-5xl uppercase text-eb-500">
                  {content.brand.name.slice(0, 1) || 'E'}
                </div>
              )}
            </div>
            <label className="btn-secondary w-full cursor-pointer">
              <ImagePlus className="mr-2 h-4 w-4" />
              {uploading ? 'Subiendo...' : 'Subir logo'}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(event) => void handleLogoUpload(event.target.files)}
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Nombre" value={content.brand.name} onChange={(value) => setContent(updateNested(content, 'brand', 'name', value))} />
            <Field label="Frase corta" value={content.brand.tagline} onChange={(value) => setContent(updateNested(content, 'brand', 'tagline', value))} />
            <TextArea label="Descripcion" value={content.brand.description} onChange={(value) => setContent(updateNested(content, 'brand', 'description', value))} />
            <TextArea label="Anuncio superior" value={content.brand.announcement} onChange={(value) => setContent(updateNested(content, 'brand', 'announcement', value))} />
          </div>
        </div>
      </section>

      <section className="surface p-5 md:p-6">
        <SectionTitle icon={FileSearch} title="SEO y vista previa" />
        <p className="mb-5 text-sm leading-6 text-eb-700">
          Estos textos aparecen en Google, pestañas del navegador y cuando comparten el sitio.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Nombre SEO del sitio" value={content.seo.siteTitle} onChange={(value) => setContent(updateNested(content, 'seo', 'siteTitle', value))} />
          <Field label="Plantilla de titulo" value={content.seo.titleTemplate} onChange={(value) => setContent(updateNested(content, 'seo', 'titleTemplate', value))} />
          <Field label="Titulo inicio" value={content.seo.homeTitle} onChange={(value) => setContent(updateNested(content, 'seo', 'homeTitle', value))} />
          <TextArea label="Descripcion inicio" value={content.seo.homeDescription} onChange={(value) => setContent(updateNested(content, 'seo', 'homeDescription', value))} />
          <Field label="Titulo catalogo" value={content.seo.catalogTitle} onChange={(value) => setContent(updateNested(content, 'seo', 'catalogTitle', value))} />
          <TextArea label="Descripcion catalogo" value={content.seo.catalogDescription} onChange={(value) => setContent(updateNested(content, 'seo', 'catalogDescription', value))} />
          <Field label="Titulo contacto" value={content.seo.contactTitle} onChange={(value) => setContent(updateNested(content, 'seo', 'contactTitle', value))} />
          <TextArea label="Descripcion contacto" value={content.seo.contactDescription} onChange={(value) => setContent(updateNested(content, 'seo', 'contactDescription', value))} />
          <TextArea label="Imagen para compartir" value={content.seo.ogImageUrl} onChange={(value) => setContent(updateNested(content, 'seo', 'ogImageUrl', value))} />
        </div>
      </section>

      <section className="surface p-5 md:p-6">
        <SectionTitle icon={Menu} title="Navegacion y botones" />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Texto Inicio" value={content.nav.homeLabel} onChange={(value) => setContent(updateNested(content, 'nav', 'homeLabel', value))} />
          <Field label="Texto Catalogo" value={content.nav.catalogLabel} onChange={(value) => setContent(updateNested(content, 'nav', 'catalogLabel', value))} />
          <Field label="Texto Contacto" value={content.nav.contactLabel} onChange={(value) => setContent(updateNested(content, 'nav', 'contactLabel', value))} />
          <Field label="Boton llamar" value={content.nav.callCta} onChange={(value) => setContent(updateNested(content, 'nav', 'callCta', value))} />
          <Field label="Boton WhatsApp" value={content.nav.whatsappCta} onChange={(value) => setContent(updateNested(content, 'nav', 'whatsappCta', value))} />
          <Field label="Titulo navegacion footer" value={content.nav.footerTitle} onChange={(value) => setContent(updateNested(content, 'nav', 'footerTitle', value))} />
          <Field label="Acceso admin footer" value={content.nav.adminAccessLabel} onChange={(value) => setContent(updateNested(content, 'nav', 'adminAccessLabel', value))} />
        </div>
      </section>

      <section className="surface p-5 md:p-6">
        <SectionTitle icon={MapPin} title="Datos del local y ubicacion" />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Ciudad" value={content.contact.city} onChange={handleCityChange} />
          <Field label="Direccion" value={content.contact.address} onChange={handleAddressChange} />
          <Field label="WhatsApp sin +" value={content.contact.whatsappNumber} onChange={(value) => setContent(updateNested(content, 'contact', 'whatsappNumber', value))} />
          <Field label="WhatsApp visible" value={content.contact.whatsappDisplay} onChange={(value) => setContent(updateNested(content, 'contact', 'whatsappDisplay', value))} />
          <Field label="Correo" value={content.contact.email} onChange={(value) => setContent(updateNested(content, 'contact', 'email', value))} />
          <Field label="Horario" value={content.contact.hours} onChange={(value) => setContent(updateNested(content, 'contact', 'hours', value))} />
          <Field label="Zona de atencion" value={content.contact.serviceArea} onChange={(value) => setContent(updateNested(content, 'contact', 'serviceArea', value))} />
          <Field label="Busqueda Google Maps" value={content.contact.googleMapsQuery} onChange={handleMapsQueryChange} />
          <TextArea label="URL Google Maps" value={content.contact.googleMapsUrl} onChange={(value) => setContent(updateNested(content, 'contact', 'googleMapsUrl', value))} />
          <TextArea label="URL mapa embebido" value={content.contact.googleMapsEmbedUrl} onChange={(value) => setContent(updateNested(content, 'contact', 'googleMapsEmbedUrl', value))} />
        </div>
      </section>

      <section className="surface p-5 md:p-6">
        <SectionTitle icon={Home} title="Inicio" />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Etiqueta pequena" value={content.home.eyebrow} onChange={(value) => setContent(updateNested(content, 'home', 'eyebrow', value))} />
          <Field label="Boton principal" value={content.home.primaryCta} onChange={(value) => setContent(updateNested(content, 'home', 'primaryCta', value))} />
          <TextArea label="Titulo principal" value={content.home.headline} onChange={(value) => setContent(updateNested(content, 'home', 'headline', value))} />
          <TextArea label="Texto principal" value={content.home.subheadline} onChange={(value) => setContent(updateNested(content, 'home', 'subheadline', value))} />
          <Field label="Etiqueta categorias" value={content.home.categoriesEyebrow} onChange={(value) => setContent(updateNested(content, 'home', 'categoriesEyebrow', value))} />
          <Field label="Titulo categorias" value={content.home.categoriesTitle} onChange={(value) => setContent(updateNested(content, 'home', 'categoriesTitle', value))} />
          <Field label="Boton categorias" value={content.home.categoriesCta} onChange={(value) => setContent(updateNested(content, 'home', 'categoriesCta', value))} />
          <Field label="Sufijo referencias" value={content.home.categoryRefsLabel} onChange={(value) => setContent(updateNested(content, 'home', 'categoryRefsLabel', value))} />
          <Field label="Texto explorar categoria" value={content.home.categoryExploreLabel} onChange={(value) => setContent(updateNested(content, 'home', 'categoryExploreLabel', value))} />
          <Field label="Boton secundario" value={content.home.secondaryCta} onChange={(value) => setContent(updateNested(content, 'home', 'secondaryCta', value))} />
          <Field label="Etiqueta destacados" value={content.home.featuredEyebrow} onChange={(value) => setContent(updateNested(content, 'home', 'featuredEyebrow', value))} />
          <Field label="Titulo destacados" value={content.home.featuredTitle} onChange={(value) => setContent(updateNested(content, 'home', 'featuredTitle', value))} />
          <Field label="Boton destacados" value={content.home.featuredCta} onChange={(value) => setContent(updateNested(content, 'home', 'featuredCta', value))} />
          <TextArea label="Texto destacados" value={content.home.featuredSubtitle} onChange={(value) => setContent(updateNested(content, 'home', 'featuredSubtitle', value))} />
          <Field label="Etiqueta confianza" value={content.home.trustEyebrow} onChange={(value) => setContent(updateNested(content, 'home', 'trustEyebrow', value))} />
          <TextArea label="Titulo confianza" value={content.home.trustTitle} onChange={(value) => setContent(updateNested(content, 'home', 'trustTitle', value))} />
          <TextArea label="Texto de confianza" value={content.home.trustText} onChange={(value) => setContent(updateNested(content, 'home', 'trustText', value))} />
          <Field label="Etiqueta cierre" value={content.home.storyEyebrow} onChange={(value) => setContent(updateNested(content, 'home', 'storyEyebrow', value))} />
          <TextArea label="Titulo cierre" value={content.home.storyTitle} onChange={(value) => setContent(updateNested(content, 'home', 'storyTitle', value))} />
          <TextArea label="Texto cierre" value={content.home.storyText} onChange={(value) => setContent(updateNested(content, 'home', 'storyText', value))} />
          <TextArea label="Texto CTA cierre" value={content.home.storyCtaText} onChange={(value) => setContent(updateNested(content, 'home', 'storyCtaText', value))} />
          <Field label="Etiqueta producto hero" value={content.home.heroRecommendedLabel} onChange={(value) => setContent(updateNested(content, 'home', 'heroRecommendedLabel', value))} />
          <Field label="Etiqueta panel hero" value={content.home.heroPanelEyebrow} onChange={(value) => setContent(updateNested(content, 'home', 'heroPanelEyebrow', value))} />
        </div>
        <TextArea
          label="Estadisticas del hero: Titulo | Valor. Usa auto:products, auto:categories o auto:city"
          value={formatStats(content.home.heroStats)}
          minRows={4}
          onChange={(value) => setContent({ ...content, home: { ...content.home, heroStats: parseStats(value) } })}
        />
        <TextArea
          label="Puntos del hero: una frase por linea. Usa auto:city para mostrar ciudad"
          value={content.home.heroBullets.join('\n')}
          minRows={4}
          onChange={(value) =>
            setContent({
              ...content,
              home: {
                ...content.home,
                heroBullets: value
                  .split('\n')
                  .map((item) => item.trim())
                  .filter(Boolean),
              },
            })
          }
        />
        <TextArea
          label="Beneficios: Titulo | Texto"
          value={formatBenefits(content.home.benefits)}
          minRows={6}
          onChange={(value) => setContent({ ...content, home: { ...content.home, benefits: parseBenefits(value) } })}
        />
        <TextArea
          label="Tarjetas del cierre: Etiqueta | Valor"
          value={formatStats(content.home.storyCards)}
          minRows={4}
          onChange={(value) => setContent({ ...content, home: { ...content.home, storyCards: parseStats(value) } })}
        />
      </section>

      <section className="surface p-5 md:p-6">
        <SectionTitle icon={ShoppingBag} title="Catalogo" />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Etiqueta pequena" value={content.catalog.eyebrow} onChange={(value) => setContent(updateNested(content, 'catalog', 'eyebrow', value))} />
          <Field label="Boton principal" value={content.catalog.primaryCta} onChange={(value) => setContent(updateNested(content, 'catalog', 'primaryCta', value))} />
          <TextArea label="Titulo" value={content.catalog.title} onChange={(value) => setContent(updateNested(content, 'catalog', 'title', value))} />
          <TextArea label="Descripcion" value={content.catalog.description} onChange={(value) => setContent(updateNested(content, 'catalog', 'description', value))} />
          <Field label="Placeholder busqueda" value={content.catalog.searchPlaceholder} onChange={(value) => setContent(updateNested(content, 'catalog', 'searchPlaceholder', value))} />
          <Field label="Titulo sin resultados" value={content.catalog.emptyTitle} onChange={(value) => setContent(updateNested(content, 'catalog', 'emptyTitle', value))} />
          <TextArea label="Texto sin resultados" value={content.catalog.emptyText} onChange={(value) => setContent(updateNested(content, 'catalog', 'emptyText', value))} />
          <Field label="Titulo tarjeta busqueda" value={content.catalog.searchCardTitle} onChange={(value) => setContent(updateNested(content, 'catalog', 'searchCardTitle', value))} />
          <TextArea label="Texto tarjeta busqueda" value={content.catalog.searchCardText} onChange={(value) => setContent(updateNested(content, 'catalog', 'searchCardText', value))} />
          <Field label="Titulo tarjeta filtros" value={content.catalog.filterCardTitle} onChange={(value) => setContent(updateNested(content, 'catalog', 'filterCardTitle', value))} />
          <TextArea label="Texto tarjeta filtros" value={content.catalog.filterCardText} onChange={(value) => setContent(updateNested(content, 'catalog', 'filterCardText', value))} />
          <Field label="Texto referencias visibles" value={content.catalog.visibleRefsLabel} onChange={(value) => setContent(updateNested(content, 'catalog', 'visibleRefsLabel', value))} />
          <Field label="Texto todas las categorias" value={content.catalog.allCategoriesLabel} onChange={(value) => setContent(updateNested(content, 'catalog', 'allCategoriesLabel', value))} />
          <Field label="Texto filtro disponibles" value={content.catalog.availableOnlyLabel} onChange={(value) => setContent(updateNested(content, 'catalog', 'availableOnlyLabel', value))} />
          <Field label="Texto resultados" value={content.catalog.resultsLabel} onChange={(value) => setContent(updateNested(content, 'catalog', 'resultsLabel', value))} />
          <Field label="CTA barra catalogo" value={content.catalog.toolbarCta} onChange={(value) => setContent(updateNested(content, 'catalog', 'toolbarCta', value))} />
          <Field label="CTA sin resultados" value={content.catalog.emptyCta} onChange={(value) => setContent(updateNested(content, 'catalog', 'emptyCta', value))} />
          <Field label="Etiqueta pagina categoria" value={content.catalog.categoryHeroEyebrow} onChange={(value) => setContent(updateNested(content, 'catalog', 'categoryHeroEyebrow', value))} />
          <Field label="Etiqueta panel categoria" value={content.catalog.categoryPanelEyebrow} onChange={(value) => setContent(updateNested(content, 'catalog', 'categoryPanelEyebrow', value))} />
          <TextArea label="Titulo panel categoria" value={content.catalog.categoryPanelTitle} onChange={(value) => setContent(updateNested(content, 'catalog', 'categoryPanelTitle', value))} />
          <TextArea label="Texto panel categoria" value={content.catalog.categoryPanelText} onChange={(value) => setContent(updateNested(content, 'catalog', 'categoryPanelText', value))} />
          <Field label="Boton volver categoria" value={content.catalog.categoryBackCta} onChange={(value) => setContent(updateNested(content, 'catalog', 'categoryBackCta', value))} />
          <Field label="Sufijo conteo categoria" value={content.catalog.categoryCountSuffix} onChange={(value) => setContent(updateNested(content, 'catalog', 'categoryCountSuffix', value))} />
        </div>
      </section>

      <section className="surface p-5 md:p-6">
        <SectionTitle icon={Contact} title="Contacto" />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Etiqueta pequena" value={content.contactPage.eyebrow} onChange={(value) => setContent(updateNested(content, 'contactPage', 'eyebrow', value))} />
          <Field label="Boton WhatsApp" value={content.contactPage.whatsappCta} onChange={(value) => setContent(updateNested(content, 'contactPage', 'whatsappCta', value))} />
          <TextArea label="Titulo" value={content.contactPage.title} onChange={(value) => setContent(updateNested(content, 'contactPage', 'title', value))} />
          <TextArea label="Descripcion" value={content.contactPage.description} onChange={(value) => setContent(updateNested(content, 'contactPage', 'description', value))} />
          <Field label="Etiqueta del panel" value={content.contactPage.panelEyebrow} onChange={(value) => setContent(updateNested(content, 'contactPage', 'panelEyebrow', value))} />
          <TextArea label="Titulo del panel" value={content.contactPage.panelTitle} onChange={(value) => setContent(updateNested(content, 'contactPage', 'panelTitle', value))} />
          <TextArea label="Texto del panel" value={content.contactPage.panelText} onChange={(value) => setContent(updateNested(content, 'contactPage', 'panelText', value))} />
          <Field label="Etiqueta direccion" value={content.contactPage.addressLabel} onChange={(value) => setContent(updateNested(content, 'contactPage', 'addressLabel', value))} />
          <Field label="Etiqueta telefono" value={content.contactPage.phoneLabel} onChange={(value) => setContent(updateNested(content, 'contactPage', 'phoneLabel', value))} />
          <Field label="Etiqueta correo" value={content.contactPage.emailLabel} onChange={(value) => setContent(updateNested(content, 'contactPage', 'emailLabel', value))} />
          <Field label="Prefijo horario" value={content.contactPage.hoursPrefix} onChange={(value) => setContent(updateNested(content, 'contactPage', 'hoursPrefix', value))} />
          <Field label="Titulo del mapa" value={content.contactPage.mapTitle} onChange={(value) => setContent(updateNested(content, 'contactPage', 'mapTitle', value))} />
        </div>
      </section>

      <section className="surface p-5 md:p-6">
        <SectionTitle icon={ShieldCheck} title="Bloque de confianza" />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Etiqueta WhatsApp" value={content.trustBand.whatsappLabel} onChange={(value) => setContent(updateNested(content, 'trustBand', 'whatsappLabel', value))} />
          <Field label="Detalle WhatsApp" value={content.trustBand.whatsappDetail} onChange={(value) => setContent(updateNested(content, 'trustBand', 'whatsappDetail', value))} />
          <Field label="Detalle ubicacion" value={content.trustBand.locationDetail} onChange={(value) => setContent(updateNested(content, 'trustBand', 'locationDetail', value))} />
          <Field label="Etiqueta asesoria" value={content.trustBand.adviceLabel} onChange={(value) => setContent(updateNested(content, 'trustBand', 'adviceLabel', value))} />
          <Field label="Detalle asesoria" value={content.trustBand.adviceDetail} onChange={(value) => setContent(updateNested(content, 'trustBand', 'adviceDetail', value))} />
          <Field label="Etiqueta horario" value={content.trustBand.scheduleLabel} onChange={(value) => setContent(updateNested(content, 'trustBand', 'scheduleLabel', value))} />
        </div>
      </section>

      <section className="surface p-5 md:p-6">
        <SectionTitle icon={MapPin} title="Seccion ubicacion" />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Etiqueta" value={content.locationSection.eyebrow} onChange={(value) => setContent(updateNested(content, 'locationSection', 'eyebrow', value))} />
          <TextArea label="Titulo" value={content.locationSection.title} onChange={(value) => setContent(updateNested(content, 'locationSection', 'title', value))} />
          <TextArea label="Descripcion" value={content.locationSection.description} onChange={(value) => setContent(updateNested(content, 'locationSection', 'description', value))} />
          <Field label="Etiqueta direccion" value={content.locationSection.addressLabel} onChange={(value) => setContent(updateNested(content, 'locationSection', 'addressLabel', value))} />
          <Field label="Etiqueta horario" value={content.locationSection.hoursLabel} onChange={(value) => setContent(updateNested(content, 'locationSection', 'hoursLabel', value))} />
          <Field label="Boton mapa" value={content.locationSection.mapCta} onChange={(value) => setContent(updateNested(content, 'locationSection', 'mapCta', value))} />
          <Field label="Boton ruta" value={content.locationSection.directionsCta} onChange={(value) => setContent(updateNested(content, 'locationSection', 'directionsCta', value))} />
          <Field label="Texto buscando ruta" value={content.locationSection.directionsLoading} onChange={(value) => setContent(updateNested(content, 'locationSection', 'directionsLoading', value))} />
          <TextArea label="Error ubicacion" value={content.locationSection.errorText} onChange={(value) => setContent(updateNested(content, 'locationSection', 'errorText', value))} />
          <Field label="Titulo iframe mapa" value={content.locationSection.mapTitle} onChange={(value) => setContent(updateNested(content, 'locationSection', 'mapTitle', value))} />
        </div>
      </section>

      <section className="surface p-5 md:p-6">
        <SectionTitle icon={Package} title="Ficha de producto" />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Breadcrumb inicio" value={content.productPage.breadcrumbHome} onChange={(value) => setContent(updateNested(content, 'productPage', 'breadcrumbHome', value))} />
          <Field label="Breadcrumb catalogo" value={content.productPage.breadcrumbCatalog} onChange={(value) => setContent(updateNested(content, 'productPage', 'breadcrumbCatalog', value))} />
          <Field label="Categoria fallback" value={content.productPage.categoryFallback} onChange={(value) => setContent(updateNested(content, 'productPage', 'categoryFallback', value))} />
          <Field label="Etiqueta descripcion" value={content.productPage.descriptionLabel} onChange={(value) => setContent(updateNested(content, 'productPage', 'descriptionLabel', value))} />
          <Field label="Etiqueta atencion" value={content.productPage.supportEyebrow} onChange={(value) => setContent(updateNested(content, 'productPage', 'supportEyebrow', value))} />
          <TextArea label="Texto atencion" value={content.productPage.supportText} onChange={(value) => setContent(updateNested(content, 'productPage', 'supportText', value))} />
          <Field label="Prueba asesoria" value={content.productPage.supportProof} onChange={(value) => setContent(updateNested(content, 'productPage', 'supportProof', value))} />
          <Field label="Boton WhatsApp" value={content.productPage.consultCta} onChange={(value) => setContent(updateNested(content, 'productPage', 'consultCta', value))} />
          <Field label="Boton volver" value={content.productPage.backCta} onChange={(value) => setContent(updateNested(content, 'productPage', 'backCta', value))} />
          <Field label="Pill consulta" value={content.productPage.quickConsultLabel} onChange={(value) => setContent(updateNested(content, 'productPage', 'quickConsultLabel', value))} />
          <Field label="Pill atencion local" value={content.productPage.localAttentionLabel} onChange={(value) => setContent(updateNested(content, 'productPage', 'localAttentionLabel', value))} />
          <Field label="Titulo confianza" value={content.productPage.confidenceTitle} onChange={(value) => setContent(updateNested(content, 'productPage', 'confidenceTitle', value))} />
          <TextArea label="Texto confianza despues de la ciudad" value={content.productPage.confidenceText} onChange={(value) => setContent(updateNested(content, 'productPage', 'confidenceText', value))} />
          <Field label="Etiqueta WhatsApp" value={content.productPage.whatsappLabel} onChange={(value) => setContent(updateNested(content, 'productPage', 'whatsappLabel', value))} />
          <Field label="Etiqueta ruta" value={content.productPage.routeLabel} onChange={(value) => setContent(updateNested(content, 'productPage', 'routeLabel', value))} />
          <Field label="Etiqueta relacionados" value={content.productPage.relatedEyebrow} onChange={(value) => setContent(updateNested(content, 'productPage', 'relatedEyebrow', value))} />
          <TextArea label="Titulo relacionados" value={content.productPage.relatedTitle} onChange={(value) => setContent(updateNested(content, 'productPage', 'relatedTitle', value))} />
          <Field label="Boton movil" value={content.productPage.mobileCta} onChange={(value) => setContent(updateNested(content, 'productPage', 'mobileCta', value))} />
          <Field label="Texto disponible" value={content.productPage.availableText} onChange={(value) => setContent(updateNested(content, 'productPage', 'availableText', value))} />
          <Field label="Texto por confirmar" value={content.productPage.availabilityCheckText} onChange={(value) => setContent(updateNested(content, 'productPage', 'availabilityCheckText', value))} />
          <Field label="Prefijo unidad" value={content.productPage.unitPrefix} onChange={(value) => setContent(updateNested(content, 'productPage', 'unitPrefix', value))} />
        </div>
      </section>

      <section className="surface p-5 md:p-6">
        <SectionTitle icon={ShoppingBag} title="Tarjetas de producto" />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Insignia destacado" value={content.productCard.featuredBadge} onChange={(value) => setContent(updateNested(content, 'productCard', 'featuredBadge', value))} />
          <Field label="Insignia disponible" value={content.productCard.availableBadge} onChange={(value) => setContent(updateNested(content, 'productCard', 'availableBadge', value))} />
          <Field label="Categoria fallback" value={content.productCard.categoryFallback} onChange={(value) => setContent(updateNested(content, 'productCard', 'categoryFallback', value))} />
          <Field label="Texto disponible" value={content.productCard.availableText} onChange={(value) => setContent(updateNested(content, 'productCard', 'availableText', value))} />
          <Field label="Texto no disponible" value={content.productCard.unavailableText} onChange={(value) => setContent(updateNested(content, 'productCard', 'unavailableText', value))} />
          <Field label="Prefijo unidad" value={content.productCard.unitPrefix} onChange={(value) => setContent(updateNested(content, 'productCard', 'unitPrefix', value))} />
          <Field label="CTA ver mas" value={content.productCard.viewMoreCta} onChange={(value) => setContent(updateNested(content, 'productCard', 'viewMoreCta', value))} />
          <Field label="CTA consultar precio" value={content.productCard.priceCta} onChange={(value) => setContent(updateNested(content, 'productCard', 'priceCta', value))} />
          <Field label="CTA consultar disponibilidad" value={content.productCard.availabilityCta} onChange={(value) => setContent(updateNested(content, 'productCard', 'availabilityCta', value))} />
        </div>
      </section>

      <section className="surface p-5 md:p-6">
        <SectionTitle icon={Sparkles} title="Frases vendedoras" />
        <TextArea
          label="Una frase por linea"
          value={content.salesPhrases.join('\n')}
          minRows={8}
          onChange={(value) =>
            setContent({
              ...content,
              salesPhrases: value
                .split('\n')
                .map((item) => item.trim())
                .filter(Boolean),
            })
          }
        />
      </section>
    </div>
  );
}

function SectionTitle({ icon: Icon, title }: { icon: LucideIcon; title: string }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <Icon className="h-5 w-5 text-eb-accent" />
      <h3 className="font-heading text-2xl uppercase tracking-[-0.04em] text-eb-900">{title}</h3>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <input className="field" value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  minRows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  minRows?: number;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <textarea
        className="field"
        rows={minRows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
