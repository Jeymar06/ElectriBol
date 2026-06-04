import 'server-only';

import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import type { SiteContent } from '@/types';
import { getAdminProfile } from '@/lib/auth';
import { isSupabaseEnabled } from '@/lib/env';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

const contentFile = path.join(process.cwd(), 'data', 'site-content.json');

type SiteContentLogRow = {
  payload: SiteContent | null;
  created_at: string;
};

async function readDefaultContent(): Promise<SiteContent> {
  const file = await fs.readFile(contentFile, 'utf8');
  return JSON.parse(file) as SiteContent;
}

function mergeContent(defaults: SiteContent, value?: Partial<SiteContent> | null): SiteContent {
  return {
    brand: { ...defaults.brand, ...value?.brand },
    contact: { ...defaults.contact, ...value?.contact },
    home: { ...defaults.home, ...value?.home },
    catalog: { ...defaults.catalog, ...value?.catalog },
    contactPage: { ...defaults.contactPage, ...value?.contactPage },
    salesPhrases:
      Array.isArray(value?.salesPhrases) && value.salesPhrases.length > 0
        ? value.salesPhrases
        : defaults.salesPhrases,
  };
}

function cleanText(value: unknown, fallback: string, maxLength = 900): string {
  if (typeof value !== 'string') {
    return fallback;
  }

  const cleaned = value.replace(/\u0000/g, '').trim();
  return cleaned.length > 0 ? cleaned.slice(0, maxLength) : fallback;
}

function cleanUrl(value: unknown, fallback: string, options?: { allowRelative?: boolean; allowedHosts?: string[] }) {
  if (typeof value !== 'string') {
    return fallback;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return fallback;
  }

  if (options?.allowRelative && trimmed.startsWith('/')) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);
    const allowedProtocol = url.protocol === 'https:' || url.protocol === 'http:';
    const allowedHost =
      !options?.allowedHosts?.length ||
      options.allowedHosts.some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`));

    return allowedProtocol && allowedHost ? url.toString() : fallback;
  } catch {
    return fallback;
  }
}

function cleanLogoUrl(value: unknown, fallback: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const allowedHosts = ['localhost'];

  if (supabaseUrl) {
    try {
      allowedHosts.push(new URL(supabaseUrl).hostname);
    } catch {
      // Ignore malformed env values and keep the stricter local-only fallback.
    }
  }

  return cleanUrl(value, fallback, { allowRelative: true, allowedHosts });
}

function sanitizeSiteContent(content: Partial<SiteContent>, defaults: SiteContent): SiteContent {
  const merged = mergeContent(defaults, content);
  const mapsHosts = ['google.com', 'google.com.co', 'maps.google.com', 'www.google.com'];

  return {
    brand: {
      name: cleanText(merged.brand.name, defaults.brand.name, 80),
      logoUrl: cleanLogoUrl(merged.brand.logoUrl, defaults.brand.logoUrl),
      tagline: cleanText(merged.brand.tagline, defaults.brand.tagline, 180),
      description: cleanText(merged.brand.description, defaults.brand.description, 500),
      announcement: cleanText(merged.brand.announcement, defaults.brand.announcement, 220),
    },
    contact: {
      city: cleanText(merged.contact.city, defaults.contact.city, 120),
      address: cleanText(merged.contact.address, defaults.contact.address, 220),
      whatsappNumber: cleanText(merged.contact.whatsappNumber, defaults.contact.whatsappNumber, 24).replace(/\D/g, ''),
      whatsappDisplay: cleanText(merged.contact.whatsappDisplay, defaults.contact.whatsappDisplay, 40),
      email: cleanText(merged.contact.email, defaults.contact.email, 120),
      hours: cleanText(merged.contact.hours, defaults.contact.hours, 180),
      serviceArea: cleanText(merged.contact.serviceArea, defaults.contact.serviceArea, 180),
      googleMapsQuery: cleanText(merged.contact.googleMapsQuery, defaults.contact.googleMapsQuery, 220),
      googleMapsUrl: cleanUrl(merged.contact.googleMapsUrl, defaults.contact.googleMapsUrl, {
        allowedHosts: mapsHosts,
      }),
      googleMapsEmbedUrl: cleanUrl(merged.contact.googleMapsEmbedUrl, defaults.contact.googleMapsEmbedUrl, {
        allowedHosts: mapsHosts,
      }),
    },
    home: {
      eyebrow: cleanText(merged.home.eyebrow, defaults.home.eyebrow, 100),
      headline: cleanText(merged.home.headline, defaults.home.headline, 180),
      subheadline: cleanText(merged.home.subheadline, defaults.home.subheadline, 420),
      primaryCta: cleanText(merged.home.primaryCta, defaults.home.primaryCta, 60),
      secondaryCta: cleanText(merged.home.secondaryCta, defaults.home.secondaryCta, 60),
      categoriesTitle: cleanText(merged.home.categoriesTitle, defaults.home.categoriesTitle, 180),
      featuredTitle: cleanText(merged.home.featuredTitle, defaults.home.featuredTitle, 180),
      featuredSubtitle: cleanText(merged.home.featuredSubtitle, defaults.home.featuredSubtitle, 320),
      trustTitle: cleanText(merged.home.trustTitle, defaults.home.trustTitle, 180),
      trustText: cleanText(merged.home.trustText, defaults.home.trustText, 420),
      storyTitle: cleanText(merged.home.storyTitle, defaults.home.storyTitle, 180),
      storyText: cleanText(merged.home.storyText, defaults.home.storyText, 420),
    },
    catalog: {
      eyebrow: cleanText(merged.catalog.eyebrow, defaults.catalog.eyebrow, 100),
      title: cleanText(merged.catalog.title, defaults.catalog.title, 180),
      description: cleanText(merged.catalog.description, defaults.catalog.description, 420),
      primaryCta: cleanText(merged.catalog.primaryCta, defaults.catalog.primaryCta, 60),
      searchPlaceholder: cleanText(merged.catalog.searchPlaceholder, defaults.catalog.searchPlaceholder, 90),
      emptyTitle: cleanText(merged.catalog.emptyTitle, defaults.catalog.emptyTitle, 120),
      emptyText: cleanText(merged.catalog.emptyText, defaults.catalog.emptyText, 360),
    },
    contactPage: {
      eyebrow: cleanText(merged.contactPage.eyebrow, defaults.contactPage.eyebrow, 100),
      title: cleanText(merged.contactPage.title, defaults.contactPage.title, 180),
      description: cleanText(merged.contactPage.description, defaults.contactPage.description, 420),
      panelEyebrow: cleanText(merged.contactPage.panelEyebrow, defaults.contactPage.panelEyebrow, 100),
      panelTitle: cleanText(merged.contactPage.panelTitle, defaults.contactPage.panelTitle, 180),
      panelText: cleanText(merged.contactPage.panelText, defaults.contactPage.panelText, 420),
      whatsappCta: cleanText(merged.contactPage.whatsappCta, defaults.contactPage.whatsappCta, 60),
    },
    salesPhrases: merged.salesPhrases
      .map((item) => cleanText(item, '', 80))
      .filter(Boolean)
      .slice(0, 20),
  };
}

export async function getSiteContent(): Promise<SiteContent> {
  const defaults = await readDefaultContent();

  if (!isSupabaseEnabled()) {
    return defaults;
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from('audit_logs')
    .select('payload, created_at')
    .eq('action', 'site_content_update')
    .eq('entity_type', 'site_content')
    .eq('entity_id', 'active')
    .order('created_at', { ascending: false })
    .limit(1);

  if (error || !data?.[0]) {
    return defaults;
  }

  const row = data[0] as SiteContentLogRow;
  return sanitizeSiteContent(row.payload || {}, defaults);
}

function revalidatePublicContent() {
  revalidatePath('/', 'layout');
  revalidatePath('/');
  revalidatePath('/catalogo');
  revalidatePath('/contacto');
  revalidatePath('/admin/contenido');
}

export async function saveSiteContent(content: SiteContent): Promise<SiteContent> {
  const defaults = await readDefaultContent();
  const nextContent = sanitizeSiteContent(content, defaults);

  if (!isSupabaseEnabled()) {
    await fs.writeFile(contentFile, JSON.stringify(nextContent, null, 2), 'utf8');
    revalidatePublicContent();
    return nextContent;
  }

  const admin = await getAdminProfile();
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from('audit_logs').insert({
    actor_id: admin?.id || null,
    action: 'site_content_update',
    entity_type: 'site_content',
    entity_id: 'active',
    payload: nextContent,
  });

  if (error) {
    throw error;
  }

  revalidatePublicContent();
  return nextContent;
}
