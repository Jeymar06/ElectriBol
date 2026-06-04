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

export interface SiteContent {
  brand: {
    name: string;
    logoUrl: string;
    tagline: string;
    description: string;
    announcement: string;
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
    categoriesTitle: string;
    featuredTitle: string;
    featuredSubtitle: string;
    trustTitle: string;
    trustText: string;
    storyTitle: string;
    storyText: string;
  };
  catalog: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: string;
    searchPlaceholder: string;
    emptyTitle: string;
    emptyText: string;
  };
  contactPage: {
    eyebrow: string;
    title: string;
    description: string;
    panelEyebrow: string;
    panelTitle: string;
    panelText: string;
    whatsappCta: string;
  };
  salesPhrases: string[];
}
