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
