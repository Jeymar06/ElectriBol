import { test, expect } from '@playwright/test';

test.describe('Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should search for products by name', async ({ page }) => {
    // Buscar en el campo de búsqueda
    await page.fill('input[placeholder="Buscar productos..."]', 'LED');
    
    // Esperar a que aparezcan resultados
    await page.waitForSelector('[data-testid="search-results"]', { timeout: 5000 });
    
    // Verificar que hay resultados
    const results = await page.locator('[data-testid="product-card"]');
    await expect(results).toHaveCount.greaterThan(0);
    
    // Verificar que los resultados contienen "LED"
    const firstResult = results.first();
    await expect(firstResult).toContainText('LED');
  });

  test('should show no results message for invalid search', async ({ page }) => {
    // Buscar algo que no existe
    await page.fill('input[placeholder="Buscar productos..."]', 'xyz123nonexistent');
    
    // Esperar a que aparezca el mensaje de no resultados
    await page.waitForSelector('text=No se encontraron productos', { timeout: 5000 });
    
    // Verificar que aparece el mensaje
    await expect(page.locator('text=No se encontraron productos')).toBeVisible();
  });

  test('should filter by category', async ({ page }) => {
    // Hacer clic en una categoría
    await page.click('text=Lámparas LED');
    
    // Verificar que los productos mostrados pertenecen a esa categoría
    const productCards = page.locator('[data-testid="product-card"]');
    const firstCard = productCards.first();
    await expect(firstCard).toContainText('Lámparas LED');
  });

  test('should sort products by price', async ({ page }) => {
    // Cambiar el ordenamiento a precio ascendente
    await page.selectOption('select', 'price-asc');
    
    // Esperar a que se actualicen los resultados
    await page.waitForTimeout(1000);
    
    // Verificar que los precios están ordenados
    const prices = await page.locator('[data-testid="product-price"]').allTextContents();
    const numericPrices = prices.map(price => 
      parseInt(price.replace(/[^0-9]/g, ''))
    );
    
    // Verificar que están ordenados de menor a mayor
    for (let i = 1; i < numericPrices.length; i++) {
      expect(numericPrices[i-1]).toBeLessThanOrEqual(numericPrices[i]);
    }
  });
});
