const fs = require('fs');
const path = require('path');

// Función para generar SVG placeholder
function generatePlaceholderSVG(text, width = 400, height = 400) {
  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#f3f4f6"/>
    <rect x="10" y="10" width="${width-20}" height="${height-20}" fill="#e5e7eb" stroke="#d1d5db" stroke-width="2" rx="8"/>
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="#6b7280">
      ${text}
    </text>
  </svg>`;
}

// Generar imágenes placeholder para productos
function generateProductImages() {
  const productsDir = path.join(__dirname, '..', 'public', 'images', 'products');
  
  // Crear directorio si no existe
  if (!fs.existsSync(productsDir)) {
    fs.mkdirSync(productsDir, { recursive: true });
  }

  // Generar imágenes para productos 001-075
  for (let i = 1; i <= 75; i++) {
    const productId = String(i).padStart(3, '0');
    
    // Generar imagen principal
    const svg1 = generatePlaceholderSVG(`Producto ${productId}`, 400, 400);
    fs.writeFileSync(path.join(productsDir, `${productId}-1.jpg`), svg1);
    
    // Generar imagen secundaria
    const svg2 = generatePlaceholderSVG(`Vista 2`, 400, 400);
    fs.writeFileSync(path.join(productsDir, `${productId}-2.jpg`), svg2);
  }

  console.log('✅ Imágenes placeholder generadas');
}

// Generar imagen de preview de Instagram
function generateInstagramPreview() {
  const publicDir = path.join(__dirname, '..', 'public');
  const svg = generatePlaceholderSVG('ElectriBol Preview', 1200, 630);
  fs.writeFileSync(path.join(publicDir, 'instagram_preview.png'), svg);
  console.log('✅ Imagen de preview generada');
}

// Generar logo
function generateLogo() {
  const publicDir = path.join(__dirname, '..', 'public');
  const svg = `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#0A5FFF;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#FFD400;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" fill="url(#grad1)" rx="20"/>
    <text x="50" y="60" font-family="Arial, sans-serif" font-size="48" font-weight="bold" text-anchor="middle" fill="white">E</text>
  </svg>`;
  fs.writeFileSync(path.join(publicDir, 'logo.png'), svg);
  console.log('✅ Logo generado');
}

// Ejecutar generación
function main() {
  console.log('Generando imágenes placeholder...');
  generateProductImages();
  generateInstagramPreview();
  generateLogo();
  console.log('🎉 Todas las imágenes han sido generadas');
}

if (require.main === module) {
  main();
}

module.exports = { generateProductImages, generateInstagramPreview, generateLogo };
