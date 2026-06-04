import 'server-only';

import type { Category, ProductWithCategory } from '@/types';
import { readCategories, readProducts } from '@/lib/storage';

export async function getCategories(activeOnly = true): Promise<Category[]> {
  const categories = await readCategories();
  return activeOnly ? categories.filter((category) => category.active) : categories;
}

export async function getProductsWithCategories(): Promise<ProductWithCategory[]> {
  const [products, categories] = await Promise.all([readProducts(), readCategories()]);

  return products.map((product) => ({
    ...product,
    category: categories.find((category) => category.id === product.categoryId),
  }));
}

export async function getFeaturedProducts(limit = 8): Promise<ProductWithCategory[]> {
  const products = await getProductsWithCategories();
  return products.filter((product) => product.featured).slice(0, limit);
}

export async function getProductBySlug(slug: string): Promise<ProductWithCategory | undefined> {
  const products = await getProductsWithCategories();
  return products.find((product) => product.slug === slug);
}

export async function getProductById(id: string): Promise<ProductWithCategory | undefined> {
  const products = await getProductsWithCategories();
  return products.find((product) => product.id === id);
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const categories = await readCategories();
  return categories.find((category) => category.slug === slug);
}

export async function getProductsByCategory(categoryId: string): Promise<ProductWithCategory[]> {
  const products = await getProductsWithCategories();
  return products.filter((product) => product.categoryId === categoryId);
}

export async function getRelatedProducts(
  product: ProductWithCategory,
  limit = 4
): Promise<ProductWithCategory[]> {
  const products = await getProductsWithCategories();
  return products
    .filter((item) => item.categoryId === product.categoryId && item.id !== product.id)
    .slice(0, limit);
}
