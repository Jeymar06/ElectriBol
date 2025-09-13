import Fuse from 'fuse.js';
import { Product } from '@/types';

/**
 * Configuración de Fuse.js para búsqueda fuzzy
 */
const fuseOptions = {
  keys: [
    { name: 'title', weight: 0.6 },
    { name: 'sku', weight: 0.4 },
    { name: 'tags', weight: 0.3 },
    { name: 'shortDescription', weight: 0.2 },
    { name: 'description', weight: 0.1 },
  ],
  threshold: 0.35,
  distance: 50,
  includeScore: true,
  includeMatches: true,
};

let fuseInstance: Fuse<Product> | null = null;

/**
 * Inicializa la instancia de Fuse.js
 */
export function initializeFuse(products: Product[]): Fuse<Product> {
  if (!fuseInstance) {
    fuseInstance = new Fuse(products, fuseOptions);
  }
  return fuseInstance;
}

/**
 * Realiza búsqueda fuzzy en productos
 */
export function searchProducts(
  products: Product[], 
  query: string
): any[] {
  const fuse = initializeFuse(products);
  return fuse.search(query);
}

/**
 * Resalta coincidencias en el texto
 */
export function highlightMatches(text: string, matches: any[]): string {
  if (!matches || matches.length === 0) return text;
  
  let highlightedText = text;
  const sortedMatches = matches
    .flatMap(match => match.indices)
    .sort((a, b) => b[0] - a[0]); // Ordenar de mayor a menor para no afectar índices
  
  sortedMatches.forEach(([start, end]) => {
    const before = highlightedText.substring(0, start);
    const match = highlightedText.substring(start, end + 1);
    const after = highlightedText.substring(end + 1);
    highlightedText = `${before}<mark class="bg-electribol-yellow px-1 rounded">${match}</mark>${after}`;
  });
  
  return highlightedText;
}

/**
 * Debounce para optimizar búsquedas
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
