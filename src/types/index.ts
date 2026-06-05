export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  reference: string;
  categoryId: string;
  price: number | null;
  compareAtPrice: number | null;
  priceOnRequest: boolean;
  unit: string;
  shortDescription: string;
  description: string;
  images: string[];
  available: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  id: string;
  email: string;
  role: 'admin' | 'editor';
  fullName?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductWithCategory extends Product {
  category?: Category;
}

export interface ProductPayload {
  id?: string;
  name: string;
  reference: string;
  categoryId: string;
  price: number | null;
  compareAtPrice: number | null;
  priceOnRequest: boolean;
  unit: string;
  shortDescription: string;
  description: string;
  images: string[];
  available: boolean;
  featured: boolean;
}

export interface CategoryPayload {
  id?: string;
  name: string;
  description: string;
  icon: string;
  active: boolean;
}

export interface CatalogFilters {
  query: string;
  category: string;
  availableOnly: boolean;
}

export interface AdminSession {
  authenticated: boolean;
  email?: string;
}

export interface EditableBenefit {
  title: string;
  text: string;
}

export interface EditableLabelDetail {
  label: string;
  detail: string;
}

export interface EditableStat {
  label: string;
  value: string;
}

export interface SiteContent {
  brand: {
    name: string;
    logoUrl: string;
    tagline: string;
    description: string;
    announcement: string;
  };
  seo: {
    siteTitle: string;
    titleTemplate: string;
    homeTitle: string;
    homeDescription: string;
    catalogTitle: string;
    catalogDescription: string;
    contactTitle: string;
    contactDescription: string;
    ogImageUrl: string;
  };
  nav: {
    homeLabel: string;
    catalogLabel: string;
    contactLabel: string;
    callCta: string;
    whatsappCta: string;
    footerTitle: string;
    adminAccessLabel: string;
  };
  contact: {
    city: string;
    address: string;
    whatsappNumber: string;
    whatsappDisplay: string;
    email: string;
    hours: string;
    serviceArea: string;
    googleMapsQuery: string;
    googleMapsUrl: string;
    googleMapsEmbedUrl: string;
  };
  home: {
    eyebrow: string;
    headline: string;
    subheadline: string;
    primaryCta: string;
    secondaryCta: string;
    categoriesEyebrow: string;
    categoriesTitle: string;
    categoriesCta: string;
    categoryRefsLabel: string;
    categoryExploreLabel: string;
    trustEyebrow: string;
    featuredTitle: string;
    featuredSubtitle: string;
    featuredEyebrow: string;
    featuredCta: string;
    trustTitle: string;
    trustText: string;
    storyEyebrow: string;
    storyTitle: string;
    storyText: string;
    storyCtaText: string;
    heroStats: EditableStat[];
    heroBullets: string[];
    benefits: EditableBenefit[];
    storyCards: EditableStat[];
    heroRecommendedLabel: string;
    heroPanelEyebrow: string;
  };
  catalog: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: string;
    searchPlaceholder: string;
    emptyTitle: string;
    emptyText: string;
    searchCardTitle: string;
    searchCardText: string;
    filterCardTitle: string;
    filterCardText: string;
    visibleRefsLabel: string;
    allCategoriesLabel: string;
    availableOnlyLabel: string;
    resultsLabel: string;
    toolbarCta: string;
    emptyCta: string;
    categoryHeroEyebrow: string;
    categoryPanelEyebrow: string;
    categoryPanelTitle: string;
    categoryPanelText: string;
    categoryBackCta: string;
    categoryCountSuffix: string;
  };
  contactPage: {
    eyebrow: string;
    title: string;
    description: string;
    panelEyebrow: string;
    panelTitle: string;
    panelText: string;
    whatsappCta: string;
    addressLabel: string;
    phoneLabel: string;
    emailLabel: string;
    hoursPrefix: string;
    mapTitle: string;
  };
  trustBand: {
    whatsappLabel: string;
    whatsappDetail: string;
    locationDetail: string;
    adviceLabel: string;
    adviceDetail: string;
    scheduleLabel: string;
  };
  locationSection: {
    eyebrow: string;
    title: string;
    description: string;
    addressLabel: string;
    hoursLabel: string;
    mapCta: string;
    directionsCta: string;
    directionsLoading: string;
    errorText: string;
    mapTitle: string;
  };
  productPage: {
    breadcrumbHome: string;
    breadcrumbCatalog: string;
    categoryFallback: string;
    descriptionLabel: string;
    supportEyebrow: string;
    supportText: string;
    supportProof: string;
    consultCta: string;
    backCta: string;
    quickConsultLabel: string;
    localAttentionLabel: string;
    confidenceTitle: string;
    confidenceText: string;
    whatsappLabel: string;
    routeLabel: string;
    relatedEyebrow: string;
    relatedTitle: string;
    mobileCta: string;
    availableText: string;
    availabilityCheckText: string;
    unitPrefix: string;
    recommendedLabel: string;
    heroPanelEyebrow: string;
  };
  productCard: {
    featuredBadge: string;
    availableBadge: string;
    categoryFallback: string;
    availableText: string;
    unavailableText: string;
    unitPrefix: string;
    viewMoreCta: string;
    priceCta: string;
    availabilityCta: string;
  };
  salesPhrases: string[];
}
