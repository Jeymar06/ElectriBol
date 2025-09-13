import { Product } from '@/types';
import productsData from '../../data/products.json';

/**
 * Obtiene todos los productos
 */
export function getAllProducts(): Product[] {
  return productsData as Product[];
}

/**
 * Obtiene un producto por ID
 */
export function getProductById(id: string): Product | undefined {
  return productsData.find((product: Product) => product.id === id);
}

/**
 * Obtiene productos por categoría
 */
export function getProductsByCategory(category: string): Product[] {
  return productsData.filter((product: Product) => 
    product.category.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Obtiene todas las categorías únicas
 */
export function getAllCategories(): string[] {
  const categories = productsData.map((product: Product) => product.category);
  return Array.from(new Set(categories)).sort();
}

/**
 * Obtiene productos populares
 */
export function getPopularProducts(limit: number = 8): Product[] {
  return productsData
    .filter((product: Product) => product.popular)
    .slice(0, limit);
}

/**
 * Obtiene productos en oferta (precio menor a 100000 COP)
 */
export function getProductsOnSale(limit: number = 8): Product[] {
  return productsData
    .filter((product: Product) => product.price < 100000)
    .slice(0, limit);
}

/**
 * Formatea el precio con separadores de miles
 */
export function formatPrice(price: number, currency: string = 'COP'): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  }).format(price);
}

/**
 * Genera URL de WhatsApp con mensaje prellenado
 */
export function generateWhatsAppUrl(
  product: Product, 
  phoneNumber: string = '+573015956954'
): string {
  const message = `Hola Electribol, estoy interesado en: ${product.title} (ID: ${product.id}). ¿Me pueden indicar precio y disponibilidad?`;
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodedMessage}`;
}
