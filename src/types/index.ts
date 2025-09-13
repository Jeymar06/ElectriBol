export interface Product {
  id: string;
  title: string;
  category: string;
  price: number;
  currency: string;
  images: string[];
  shortDescription: string;
  description: string;
  tags: string[];
  sku: string;
  stock: number;
  dimensions?: {
    width: string;
    height: string;
    depth: string;
  };
  rating: number;
  createdAt: string;
  popular: boolean;
}

export interface SearchFilters {
  categories: string[];
  priceRange: [number, number];
  sortBy: 'price-asc' | 'price-desc' | 'newest' | 'popularity';
  searchQuery: string;
}

export interface QuoteItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  sku: string;
}

export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface CompanyInfo {
  name: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  hours: string;
  googleMapsEmbedKey?: string;
}
