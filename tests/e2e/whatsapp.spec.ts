import { test, expect } from '@playwright/test';

test.describe('WhatsApp Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should open WhatsApp with correct message when clicking product WhatsApp button', async ({ page }) => {
    // Hacer clic en el primer producto
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await firstProduct.click();
    
    // Esperar a que se abra el modal
    await page.waitForSelector('[data-testid="product-modal"]');
    
    // Hacer clic en el botón de WhatsApp
    const whatsappButton = page.locator('button:has-text("Consultar por WhatsApp")');
    await whatsappButton.click();
    
    // Verificar que se abre una nueva pestaña con WhatsApp
    const [newPage] = await Promise.all([
      page.waitForEvent('popup'),
      whatsappButton.click()
    ]);
    
    // Verificar que la URL contiene WhatsApp
    await expect(newPage).toHaveURL(/wa\.me/);
    
    // Cerrar la nueva pestaña
    await newPage.close();
  });

  test('should open WhatsApp from floating button', async ({ page }) => {
    // Hacer clic en el botón flotante de WhatsApp
    const floatingButton = page.locator('.whatsapp-float button');
    await floatingButton.click();
    
    // Verificar que se abre una nueva pestaña
    const [newPage] = await Promise.all([
      page.waitForEvent('popup'),
      floatingButton.click()
    ]);
    
    // Verificar que la URL contiene WhatsApp
    await expect(newPage).toHaveURL(/wa\.me/);
    
    // Cerrar la nueva pestaña
    await newPage.close();
  });

  test('should add product to quote and send via WhatsApp', async ({ page }) => {
    // Hacer clic en "Agregar a cotización" del primer producto
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    const addToQuoteButton = firstProduct.locator('button:has-text("Agregar a cotización")');
    await addToQuoteButton.click();
    
    // Hacer clic en el icono de cotización en el header
    const quoteButton = page.locator('button[aria-label="Ver cotización"]');
    await quoteButton.click();
    
    // Verificar que se abre el panel de cotización
    await page.waitForSelector('[data-testid="quote-panel"]');
    
    // Hacer clic en "Enviar por WhatsApp"
    const sendWhatsAppButton = page.locator('button:has-text("Enviar por WhatsApp")');
    await sendWhatsAppButton.click();
    
    // Verificar que se abre una nueva pestaña con WhatsApp
    const [newPage] = await Promise.all([
      page.waitForEvent('popup'),
      sendWhatsAppButton.click()
    ]);
    
    // Verificar que la URL contiene WhatsApp
    await expect(newPage).toHaveURL(/wa\.me/);
    
    // Cerrar la nueva pestaña
    await newPage.close();
  });

  test('should show WhatsApp button on contact page', async ({ page }) => {
    // Ir a la página de contacto
    await page.goto('/contact');
    
    // Verificar que hay botones de WhatsApp
    const whatsappButtons = page.locator('button:has-text("WhatsApp"), a:has-text("WhatsApp")');
    await expect(whatsappButtons).toHaveCount.greaterThan(0);
    
    // Hacer clic en el primer botón de WhatsApp
    const firstWhatsAppButton = whatsappButtons.first();
    await firstWhatsAppButton.click();
    
    // Verificar que se abre una nueva pestaña
    const [newPage] = await Promise.all([
      page.waitForEvent('popup'),
      firstWhatsAppButton.click()
    ]);
    
    // Verificar que la URL contiene WhatsApp
    await expect(newPage).toHaveURL(/wa\.me/);
    
    // Cerrar la nueva pestaña
    await newPage.close();
  });
});
