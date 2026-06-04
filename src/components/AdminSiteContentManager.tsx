'use client';

import Image from 'next/image';
import {
  Building2,
  Contact,
  Home,
  ImagePlus,
  MapPin,
  Save,
  ShoppingBag,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { useState } from 'react';
import type { SiteContent } from '@/types';

type SectionKey = 'brand' | 'contact' | 'home' | 'catalog' | 'contactPage';

function updateNested<T extends SectionKey>(
  content: SiteContent,
  section: T,
  key: keyof SiteContent[T],
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

export default function AdminSiteContentManager({ initialContent }: { initialContent: SiteContent }) {
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2600);
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
        <SectionTitle icon={MapPin} title="Datos del local y ubicacion" />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Ciudad" value={content.contact.city} onChange={(value) => setContent(updateNested(content, 'contact', 'city', value))} />
          <Field label="Direccion" value={content.contact.address} onChange={(value) => setContent(updateNested(content, 'contact', 'address', value))} />
          <Field label="WhatsApp sin +" value={content.contact.whatsappNumber} onChange={(value) => setContent(updateNested(content, 'contact', 'whatsappNumber', value))} />
          <Field label="WhatsApp visible" value={content.contact.whatsappDisplay} onChange={(value) => setContent(updateNested(content, 'contact', 'whatsappDisplay', value))} />
          <Field label="Correo" value={content.contact.email} onChange={(value) => setContent(updateNested(content, 'contact', 'email', value))} />
          <Field label="Horario" value={content.contact.hours} onChange={(value) => setContent(updateNested(content, 'contact', 'hours', value))} />
          <Field label="Zona de atencion" value={content.contact.serviceArea} onChange={(value) => setContent(updateNested(content, 'contact', 'serviceArea', value))} />
          <Field label="Busqueda Google Maps" value={content.contact.googleMapsQuery} onChange={(value) => setContent(updateNested(content, 'contact', 'googleMapsQuery', value))} />
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
          <Field label="Titulo categorias" value={content.home.categoriesTitle} onChange={(value) => setContent(updateNested(content, 'home', 'categoriesTitle', value))} />
          <Field label="Boton secundario" value={content.home.secondaryCta} onChange={(value) => setContent(updateNested(content, 'home', 'secondaryCta', value))} />
          <Field label="Titulo destacados" value={content.home.featuredTitle} onChange={(value) => setContent(updateNested(content, 'home', 'featuredTitle', value))} />
          <TextArea label="Texto destacados" value={content.home.featuredSubtitle} onChange={(value) => setContent(updateNested(content, 'home', 'featuredSubtitle', value))} />
          <TextArea label="Titulo confianza" value={content.home.trustTitle} onChange={(value) => setContent(updateNested(content, 'home', 'trustTitle', value))} />
          <TextArea label="Texto de confianza" value={content.home.trustText} onChange={(value) => setContent(updateNested(content, 'home', 'trustText', value))} />
          <TextArea label="Titulo cierre" value={content.home.storyTitle} onChange={(value) => setContent(updateNested(content, 'home', 'storyTitle', value))} />
          <TextArea label="Texto cierre" value={content.home.storyText} onChange={(value) => setContent(updateNested(content, 'home', 'storyText', value))} />
        </div>
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
