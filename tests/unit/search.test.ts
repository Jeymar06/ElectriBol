import { searchProducts, debounce } from '../../src/lib/fuse';
import { Product } from '../../src/types';

// Mock products for testing
const mockProducts: Product[] = [
  {
    id: '001',
    title: 'Lámpara LED 30W',
    category: 'Lámparas LED',
    price: 50000,
    currency: 'COP',
    images: ['/images/products/001-1.jpg'],
    shortDescription: 'Lámpara LED de alta eficiencia',
    description: 'Descripción detallada de la lámpara LED',
    tags: ['LED', '30W', 'Eficiente'],
    sku: 'LAM-30W-001',
    stock: 10,
    rating: 4.5,
    popular: true,
    createdAt: '2025-01-10T12:00:00Z',
  },
  {
    id: '002',
    title: 'Cable THW 12 AWG',
    category: 'Cables Eléctricos',
    price: 15000,
    currency: 'COP',
    images: ['/images/products/002-1.jpg'],
    shortDescription: 'Cable eléctrico de cobre',
    description: 'Cable eléctrico de cobre para instalaciones',
    tags: ['Cable', 'Cobre', '12 AWG'],
    sku: 'CAB-12AWG-001',
    stock: 25,
    rating: 4.2,
    popular: false,
    createdAt: '2025-01-09T12:00:00Z',
  },
  {
    id: '003',
    title: 'Reflector LED 100W',
    category: 'Reflectores',
    price: 120000,
    currency: 'COP',
    images: ['/images/products/003-1.jpg'],
    shortDescription: 'Reflector LED de alta potencia',
    description: 'Reflector LED para iluminación exterior',
    tags: ['LED', '100W', 'Exterior'],
    sku: 'REF-100W-001',
    stock: 5,
    rating: 4.8,
    popular: true,
    createdAt: '2025-01-08T12:00:00Z',
  },
];

describe('Search Functionality', () => {
  describe('searchProducts', () => {
    test('should find products by title', () => {
      const results = searchProducts(mockProducts, 'LED');
      expect(results).toHaveLength(2);
      expect(results[0].item.title).toContain('LED');
    });

    test('should find products by SKU', () => {
      const results = searchProducts(mockProducts, 'LAM-30W-001');
      expect(results).toHaveLength(1);
      expect(results[0].item.sku).toBe('LAM-30W-001');
    });

    test('should find products by tags', () => {
      const results = searchProducts(mockProducts, 'Exterior');
      expect(results).toHaveLength(1);
      expect(results[0].item.tags).toContain('Exterior');
    });

    test('should find products by description', () => {
      const results = searchProducts(mockProducts, 'cobre');
      expect(results).toHaveLength(1);
      expect(results[0].item.description).toContain('cobre');
    });

    test('should return empty array for no matches', () => {
      const results = searchProducts(mockProducts, 'nonexistent');
      expect(results).toHaveLength(0);
    });

    test('should handle empty search query', () => {
      const results = searchProducts(mockProducts, '');
      expect(results).toHaveLength(0);
    });

    test('should handle case insensitive search', () => {
      const results = searchProducts(mockProducts, 'led');
      expect(results).toHaveLength(2);
    });

    test('should prioritize title matches over description matches', () => {
      const results = searchProducts(mockProducts, 'LED');
      expect(results[0].item.title).toContain('LED');
    });

    test('should return results with score and matches', () => {
      const results = searchProducts(mockProducts, 'LED');
      expect(results[0]).toHaveProperty('score');
      expect(results[0]).toHaveProperty('matches');
    });
  });

  describe('debounce', () => {
    test('should delay function execution', (done) => {
      let callCount = 0;
      const debouncedFn = debounce(() => {
        callCount++;
        expect(callCount).toBe(1);
        done();
      }, 100);

      debouncedFn();
      debouncedFn();
      debouncedFn();
    });

    test('should execute function only once after delay', (done) => {
      let callCount = 0;
      const debouncedFn = debounce(() => {
        callCount++;
      }, 100);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      setTimeout(() => {
        expect(callCount).toBe(1);
        done();
      }, 200);
    });
  });
});
