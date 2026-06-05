import 'server-only';

import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import type { EditableBenefit, EditableStat, SiteContent } from '@/types';
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
    seo: { ...defaults.seo, ...value?.seo },
    nav: { ...defaults.nav, ...value?.nav },
    contact: { ...defaults.contact, ...value?.contact },
    home: { ...defaults.home, ...value?.home },
    catalog: { ...defaults.catalog, ...value?.catalog },
    contactPage: { ...defaults.contactPage, ...value?.contactPage },
    trustBand: { ...defaults.trustBand, ...value?.trustBand },
    locationSection: { ...defaults.locationSection, ...value?.locationSection },
    productPage: { ...defaults.productPage, ...value?.productPage },
    productCard: { ...defaults.productCard, ...value?.productCard },
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

function cleanImageUrl(value: unknown, fallback: string) {
  if (typeof value === 'string' && value.trim().startsWith('/')) {
    return value.trim();
  }

  return cleanLogoUrl(value, fallback);
}

function buildMapsLinks(query: string) {
  const encodedQuery = encodeURIComponent(query);
  return {
    googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`,
    googleMapsEmbedUrl: `https://www.google.com/maps?q=${encodedQuery}&z=16&output=embed`,
  };
}

function cleanStringList(value: unknown, fallback: string[], maxItems = 12, maxLength = 100): string[] {
  const source = Array.isArray(value) && value.length > 0 ? value : fallback;
  const cleaned = source
    .map((item) => cleanText(item, '', maxLength))
    .filter(Boolean)
    .slice(0, maxItems);

  return cleaned.length > 0 ? cleaned : fallback;
}

function cleanStats(value: unknown, fallback: EditableStat[], maxItems = 6): EditableStat[] {
  const source = Array.isArray(value) && value.length > 0 ? value : fallback;
  const cleaned = source
    .map((item) => {
      const stat = item as Partial<EditableStat>;
      return {
        label: cleanText(stat.label, '', 80),
        value: cleanText(stat.value, '', 80),
      };
    })
    .filter((item) => item.label && item.value)
    .slice(0, maxItems);

  return cleaned.length > 0 ? cleaned : fallback;
}

function cleanBenefits(value: unknown, fallback: EditableBenefit[], maxItems = 6): EditableBenefit[] {
  const source = Array.isArray(value) && value.length > 0 ? value : fallback;
  const cleaned = source
    .map((item) => {
      const benefit = item as Partial<EditableBenefit>;
      return {
        title: cleanText(benefit.title, '', 90),
        text: cleanText(benefit.text, '', 240),
      };
    })
    .filter((item) => item.title && item.text)
    .slice(0, maxItems);

  return cleaned.length > 0 ? cleaned : fallback;
}

function sanitizeSiteContent(content: Partial<SiteContent>, defaults: SiteContent): SiteContent {
  const merged = mergeContent(defaults, content);
  const mapsHosts = ['google.com', 'google.com.co', 'maps.google.com', 'www.google.com'];
  const cleanedCity = cleanText(merged.contact.city, defaults.contact.city, 120);
  const cleanedAddress = cleanText(merged.contact.address, defaults.contact.address, 220);
  const cleanedMapsQuery = cleanText(
    merged.contact.googleMapsQuery,
    `${cleanedAddress}, ${cleanedCity}, Colombia`,
    220
  );
  const generatedMaps = buildMapsLinks(cleanedMapsQuery);

  return {
    brand: {
      name: cleanText(merged.brand.name, defaults.brand.name, 80),
      logoUrl: cleanLogoUrl(merged.brand.logoUrl, defaults.brand.logoUrl),
      tagline: cleanText(merged.brand.tagline, defaults.brand.tagline, 180),
      description: cleanText(merged.brand.description, defaults.brand.description, 500),
      announcement: cleanText(merged.brand.announcement, defaults.brand.announcement, 220),
    },
    seo: {
      siteTitle: cleanText(merged.seo.siteTitle, defaults.seo.siteTitle, 90),
      titleTemplate: cleanText(merged.seo.titleTemplate, defaults.seo.titleTemplate, 100),
      homeTitle: cleanText(merged.seo.homeTitle, defaults.seo.homeTitle, 90),
      homeDescription: cleanText(merged.seo.homeDescription, defaults.seo.homeDescription, 180),
      catalogTitle: cleanText(merged.seo.catalogTitle, defaults.seo.catalogTitle, 90),
      catalogDescription: cleanText(merged.seo.catalogDescription, defaults.seo.catalogDescription, 180),
      contactTitle: cleanText(merged.seo.contactTitle, defaults.seo.contactTitle, 90),
      contactDescription: cleanText(merged.seo.contactDescription, defaults.seo.contactDescription, 180),
      ogImageUrl: cleanImageUrl(merged.seo.ogImageUrl, defaults.seo.ogImageUrl),
    },
    nav: {
      homeLabel: cleanText(merged.nav.homeLabel, defaults.nav.homeLabel, 40),
      catalogLabel: cleanText(merged.nav.catalogLabel, defaults.nav.catalogLabel, 40),
      contactLabel: cleanText(merged.nav.contactLabel, defaults.nav.contactLabel, 40),
      callCta: cleanText(merged.nav.callCta, defaults.nav.callCta, 40),
      whatsappCta: cleanText(merged.nav.whatsappCta, defaults.nav.whatsappCta, 40),
      footerTitle: cleanText(merged.nav.footerTitle, defaults.nav.footerTitle, 60),
      adminAccessLabel: cleanText(merged.nav.adminAccessLabel, defaults.nav.adminAccessLabel, 60),
    },
    contact: {
      city: cleanedCity,
      address: cleanedAddress,
      whatsappNumber: cleanText(merged.contact.whatsappNumber, defaults.contact.whatsappNumber, 24).replace(/\D/g, ''),
      whatsappDisplay: cleanText(merged.contact.whatsappDisplay, defaults.contact.whatsappDisplay, 40),
      email: cleanText(merged.contact.email, defaults.contact.email, 120),
      hours: cleanText(merged.contact.hours, defaults.contact.hours, 180),
      serviceArea: cleanText(merged.contact.serviceArea, defaults.contact.serviceArea, 180),
      googleMapsQuery: cleanedMapsQuery,
      googleMapsUrl: cleanUrl(merged.contact.googleMapsUrl, generatedMaps.googleMapsUrl, {
        allowedHosts: mapsHosts,
      }),
      googleMapsEmbedUrl: cleanUrl(merged.contact.googleMapsEmbedUrl, generatedMaps.googleMapsEmbedUrl, {
        allowedHosts: mapsHosts,
      }),
    },
    home: {
      eyebrow: cleanText(merged.home.eyebrow, defaults.home.eyebrow, 100),
      headline: cleanText(merged.home.headline, defaults.home.headline, 180),
      subheadline: cleanText(merged.home.subheadline, defaults.home.subheadline, 420),
      primaryCta: cleanText(merged.home.primaryCta, defaults.home.primaryCta, 60),
      secondaryCta: cleanText(merged.home.secondaryCta, defaults.home.secondaryCta, 60),
      categoriesEyebrow: cleanText(merged.home.categoriesEyebrow, defaults.home.categoriesEyebrow, 80),
      categoriesTitle: cleanText(merged.home.categoriesTitle, defaults.home.categoriesTitle, 180),
      categoriesCta: cleanText(merged.home.categoriesCta, defaults.home.categoriesCta, 60),
      categoryRefsLabel: cleanText(merged.home.categoryRefsLabel, defaults.home.categoryRefsLabel, 30),
      categoryExploreLabel: cleanText(merged.home.categoryExploreLabel, defaults.home.categoryExploreLabel, 40),
      trustEyebrow: cleanText(merged.home.trustEyebrow, defaults.home.trustEyebrow, 80),
      featuredTitle: cleanText(merged.home.featuredTitle, defaults.home.featuredTitle, 180),
      featuredSubtitle: cleanText(merged.home.featuredSubtitle, defaults.home.featuredSubtitle, 320),
      featuredEyebrow: cleanText(merged.home.featuredEyebrow, defaults.home.featuredEyebrow, 80),
      featuredCta: cleanText(merged.home.featuredCta, defaults.home.featuredCta, 60),
      trustTitle: cleanText(merged.home.trustTitle, defaults.home.trustTitle, 180),
      trustText: cleanText(merged.home.trustText, defaults.home.trustText, 420),
      storyEyebrow: cleanText(merged.home.storyEyebrow, defaults.home.storyEyebrow, 80),
      storyTitle: cleanText(merged.home.storyTitle, defaults.home.storyTitle, 180),
      storyText: cleanText(merged.home.storyText, defaults.home.storyText, 420),
      storyCtaText: cleanText(merged.home.storyCtaText, defaults.home.storyCtaText, 180),
      heroStats: cleanStats(merged.home.heroStats, defaults.home.heroStats, 3),
      heroBullets: cleanStringList(merged.home.heroBullets, defaults.home.heroBullets, 6, 80),
      benefits: cleanBenefits(merged.home.benefits, defaults.home.benefits, 6),
      storyCards: cleanStats(merged.home.storyCards, defaults.home.storyCards, 3),
      heroRecommendedLabel: cleanText(merged.home.heroRecommendedLabel, defaults.home.heroRecommendedLabel, 60),
      heroPanelEyebrow: cleanText(merged.home.heroPanelEyebrow, defaults.home.heroPanelEyebrow, 80),
    },
    catalog: {
      eyebrow: cleanText(merged.catalog.eyebrow, defaults.catalog.eyebrow, 100),
      title: cleanText(merged.catalog.title, defaults.catalog.title, 180),
      description: cleanText(merged.catalog.description, defaults.catalog.description, 420),
      primaryCta: cleanText(merged.catalog.primaryCta, defaults.catalog.primaryCta, 60),
      searchPlaceholder: cleanText(merged.catalog.searchPlaceholder, defaults.catalog.searchPlaceholder, 90),
      emptyTitle: cleanText(merged.catalog.emptyTitle, defaults.catalog.emptyTitle, 120),
      emptyText: cleanText(merged.catalog.emptyText, defaults.catalog.emptyText, 360),
      searchCardTitle: cleanText(merged.catalog.searchCardTitle, defaults.catalog.searchCardTitle, 90),
      searchCardText: cleanText(merged.catalog.searchCardText, defaults.catalog.searchCardText, 260),
      filterCardTitle: cleanText(merged.catalog.filterCardTitle, defaults.catalog.filterCardTitle, 90),
      filterCardText: cleanText(merged.catalog.filterCardText, defaults.catalog.filterCardText, 260),
      visibleRefsLabel: cleanText(merged.catalog.visibleRefsLabel, defaults.catalog.visibleRefsLabel, 60),
      allCategoriesLabel: cleanText(merged.catalog.allCategoriesLabel, defaults.catalog.allCategoriesLabel, 40),
      availableOnlyLabel: cleanText(merged.catalog.availableOnlyLabel, defaults.catalog.availableOnlyLabel, 90),
      resultsLabel: cleanText(merged.catalog.resultsLabel, defaults.catalog.resultsLabel, 80),
      toolbarCta: cleanText(merged.catalog.toolbarCta, defaults.catalog.toolbarCta, 80),
      emptyCta: cleanText(merged.catalog.emptyCta, defaults.catalog.emptyCta, 80),
      categoryHeroEyebrow: cleanText(merged.catalog.categoryHeroEyebrow, defaults.catalog.categoryHeroEyebrow, 80),
      categoryPanelEyebrow: cleanText(merged.catalog.categoryPanelEyebrow, defaults.catalog.categoryPanelEyebrow, 80),
      categoryPanelTitle: cleanText(merged.catalog.categoryPanelTitle, defaults.catalog.categoryPanelTitle, 180),
      categoryPanelText: cleanText(merged.catalog.categoryPanelText, defaults.catalog.categoryPanelText, 320),
      categoryBackCta: cleanText(merged.catalog.categoryBackCta, defaults.catalog.categoryBackCta, 60),
      categoryCountSuffix: cleanText(merged.catalog.categoryCountSuffix, defaults.catalog.categoryCountSuffix, 80),
    },
    contactPage: {
      eyebrow: cleanText(merged.contactPage.eyebrow, defaults.contactPage.eyebrow, 100),
      title: cleanText(merged.contactPage.title, defaults.contactPage.title, 180),
      description: cleanText(merged.contactPage.description, defaults.contactPage.description, 420),
      panelEyebrow: cleanText(merged.contactPage.panelEyebrow, defaults.contactPage.panelEyebrow, 100),
      panelTitle: cleanText(merged.contactPage.panelTitle, defaults.contactPage.panelTitle, 180),
      panelText: cleanText(merged.contactPage.panelText, defaults.contactPage.panelText, 420),
      whatsappCta: cleanText(merged.contactPage.whatsappCta, defaults.contactPage.whatsappCta, 60),
      addressLabel: cleanText(merged.contactPage.addressLabel, defaults.contactPage.addressLabel, 50),
      phoneLabel: cleanText(merged.contactPage.phoneLabel, defaults.contactPage.phoneLabel, 50),
      emailLabel: cleanText(merged.contactPage.emailLabel, defaults.contactPage.emailLabel, 50),
      hoursPrefix: cleanText(merged.contactPage.hoursPrefix, defaults.contactPage.hoursPrefix, 80),
      mapTitle: cleanText(merged.contactPage.mapTitle, defaults.contactPage.mapTitle, 80),
    },
    trustBand: {
      whatsappLabel: cleanText(merged.trustBand.whatsappLabel, defaults.trustBand.whatsappLabel, 80),
      whatsappDetail: cleanText(merged.trustBand.whatsappDetail, defaults.trustBand.whatsappDetail, 120),
      locationDetail: cleanText(merged.trustBand.locationDetail, defaults.trustBand.locationDetail, 120),
      adviceLabel: cleanText(merged.trustBand.adviceLabel, defaults.trustBand.adviceLabel, 80),
      adviceDetail: cleanText(merged.trustBand.adviceDetail, defaults.trustBand.adviceDetail, 120),
      scheduleLabel: cleanText(merged.trustBand.scheduleLabel, defaults.trustBand.scheduleLabel, 80),
    },
    locationSection: {
      eyebrow: cleanText(merged.locationSection.eyebrow, defaults.locationSection.eyebrow, 80),
      title: cleanText(merged.locationSection.title, defaults.locationSection.title, 180),
      description: cleanText(merged.locationSection.description, defaults.locationSection.description, 420),
      addressLabel: cleanText(merged.locationSection.addressLabel, defaults.locationSection.addressLabel, 60),
      hoursLabel: cleanText(merged.locationSection.hoursLabel, defaults.locationSection.hoursLabel, 60),
      mapCta: cleanText(merged.locationSection.mapCta, defaults.locationSection.mapCta, 80),
      directionsCta: cleanText(merged.locationSection.directionsCta, defaults.locationSection.directionsCta, 90),
      directionsLoading: cleanText(merged.locationSection.directionsLoading, defaults.locationSection.directionsLoading, 90),
      errorText: cleanText(merged.locationSection.errorText, defaults.locationSection.errorText, 180),
      mapTitle: cleanText(merged.locationSection.mapTitle, defaults.locationSection.mapTitle, 80),
    },
    productPage: {
      breadcrumbHome: cleanText(merged.productPage.breadcrumbHome, defaults.productPage.breadcrumbHome, 40),
      breadcrumbCatalog: cleanText(merged.productPage.breadcrumbCatalog, defaults.productPage.breadcrumbCatalog, 40),
      categoryFallback: cleanText(merged.productPage.categoryFallback, defaults.productPage.categoryFallback, 60),
      descriptionLabel: cleanText(merged.productPage.descriptionLabel, defaults.productPage.descriptionLabel, 60),
      supportEyebrow: cleanText(merged.productPage.supportEyebrow, defaults.productPage.supportEyebrow, 80),
      supportText: cleanText(merged.productPage.supportText, defaults.productPage.supportText, 360),
      supportProof: cleanText(merged.productPage.supportProof, defaults.productPage.supportProof, 80),
      consultCta: cleanText(merged.productPage.consultCta, defaults.productPage.consultCta, 80),
      backCta: cleanText(merged.productPage.backCta, defaults.productPage.backCta, 80),
      quickConsultLabel: cleanText(merged.productPage.quickConsultLabel, defaults.productPage.quickConsultLabel, 80),
      localAttentionLabel: cleanText(merged.productPage.localAttentionLabel, defaults.productPage.localAttentionLabel, 80),
      confidenceTitle: cleanText(merged.productPage.confidenceTitle, defaults.productPage.confidenceTitle, 100),
      confidenceText: cleanText(merged.productPage.confidenceText, defaults.productPage.confidenceText, 260),
      whatsappLabel: cleanText(merged.productPage.whatsappLabel, defaults.productPage.whatsappLabel, 80),
      routeLabel: cleanText(merged.productPage.routeLabel, defaults.productPage.routeLabel, 80),
      relatedEyebrow: cleanText(merged.productPage.relatedEyebrow, defaults.productPage.relatedEyebrow, 80),
      relatedTitle: cleanText(merged.productPage.relatedTitle, defaults.productPage.relatedTitle, 180),
      mobileCta: cleanText(merged.productPage.mobileCta, defaults.productPage.mobileCta, 80),
      availableText: cleanText(merged.productPage.availableText, defaults.productPage.availableText, 80),
      availabilityCheckText: cleanText(merged.productPage.availabilityCheckText, defaults.productPage.availabilityCheckText, 100),
      unitPrefix: cleanText(merged.productPage.unitPrefix, defaults.productPage.unitPrefix, 30),
      recommendedLabel: cleanText(merged.productPage.recommendedLabel, defaults.productPage.recommendedLabel, 80),
      heroPanelEyebrow: cleanText(merged.productPage.heroPanelEyebrow, defaults.productPage.heroPanelEyebrow, 80),
    },
    productCard: {
      featuredBadge: cleanText(merged.productCard.featuredBadge, defaults.productCard.featuredBadge, 60),
      availableBadge: cleanText(merged.productCard.availableBadge, defaults.productCard.availableBadge, 60),
      categoryFallback: cleanText(merged.productCard.categoryFallback, defaults.productCard.categoryFallback, 60),
      availableText: cleanText(merged.productCard.availableText, defaults.productCard.availableText, 60),
      unavailableText: cleanText(merged.productCard.unavailableText, defaults.productCard.unavailableText, 80),
      unitPrefix: cleanText(merged.productCard.unitPrefix, defaults.productCard.unitPrefix, 30),
      viewMoreCta: cleanText(merged.productCard.viewMoreCta, defaults.productCard.viewMoreCta, 60),
      priceCta: cleanText(merged.productCard.priceCta, defaults.productCard.priceCta, 80),
      availabilityCta: cleanText(merged.productCard.availabilityCta, defaults.productCard.availabilityCta, 80),
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
