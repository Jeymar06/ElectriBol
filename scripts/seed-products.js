const fs = require('fs');
const path = require('path');

// Categorías de productos
const categories = [
  'Lámparas LED',
  'Cables Eléctricos',
  'Reflectores',
  'Iluminación Exterior',
  'Accesorios',
  'Luminarias',
  'Bombillas',
  'Interruptores',
  'Tubos LED',
  'Plafones'
];

// Tags comunes
const commonTags = [
  'LED', 'Exterior', 'Interior', 'Ahorro', 'Eficiente', 'Duradero',
  'Resistente', 'IP65', 'IP67', 'Blanco Frío', 'Blanco Cálido',
  'Dimmable', 'Sensor', 'Solar', 'Aluminio', 'Plástico', 'Vidrio'
];

// Nombres de productos por categoría
const productNames = {
  'Lámparas LED': [
    'Lámpara LED 9W', 'Lámpara LED 12W', 'Lámpara LED 15W', 'Lámpara LED 18W',
    'Lámpara LED 20W', 'Lámpara LED 24W', 'Lámpara LED 30W', 'Lámpara LED 36W'
  ],
  'Cables Eléctricos': [
    'Cable THW 12 AWG', 'Cable THW 10 AWG', 'Cable THW 8 AWG', 'Cable THW 6 AWG',
    'Cable THW 4 AWG', 'Cable THW 2 AWG', 'Cable THW 1/0 AWG', 'Cable THW 2/0 AWG'
  ],
  'Reflectores': [
    'Reflector LED 30W', 'Reflector LED 50W', 'Reflector LED 100W', 'Reflector LED 150W',
    'Reflector LED 200W', 'Reflector LED 300W', 'Reflector LED 500W', 'Reflector LED 1000W'
  ],
  'Iluminación Exterior': [
    'Luminaria Exterior LED', 'Poste LED Solar', 'Lámpara de Pared LED', 'Luminaria de Techo LED',
    'Proyector LED Exterior', 'Lámpara de Jardín LED', 'Luminaria Vial LED', 'Foco LED Exterior'
  ],
  'Accesorios': [
    'Portalámparas E27', 'Portalámparas E14', 'Portalámparas GU10', 'Portalámparas MR16',
    'Conexión Rápida', 'Empalme Eléctrico', 'Caja de Conexión', 'Tubo Conduit'
  ],
  'Luminarias': [
    'Plafón LED 24W', 'Plafón LED 36W', 'Plafón LED 48W', 'Plafón LED 60W',
    'Luminaria Industrial LED', 'Luminaria Comercial LED', 'Luminaria Residencial LED'
  ],
  'Bombillas': [
    'Bombilla LED E27 9W', 'Bombilla LED E27 12W', 'Bombilla LED E27 15W', 'Bombilla LED E14 6W',
    'Bombilla LED E14 9W', 'Bombilla LED GU10 5W', 'Bombilla LED GU10 7W', 'Bombilla LED MR16 5W'
  ],
  'Interruptores': [
    'Interruptor Simple', 'Interruptor Doble', 'Interruptor Triple', 'Interruptor con Variador',
    'Interruptor con Sensor', 'Interruptor Exterior', 'Interruptor Inteligente'
  ],
  'Tubos LED': [
    'Tubo LED T8 18W', 'Tubo LED T8 24W', 'Tubo LED T8 36W', 'Tubo LED T5 14W',
    'Tubo LED T5 21W', 'Tubo LED T5 28W', 'Tubo LED T5 35W'
  ],
  'Plafones': [
    'Plafón LED Redondo 24W', 'Plafón LED Redondo 36W', 'Plafón LED Cuadrado 24W',
    'Plafón LED Cuadrado 36W', 'Plafón LED Rectangular 48W', 'Plafón LED Rectangular 60W'
  ]
};

// Genera descripción corta
function generateShortDescription(category, name) {
  const descriptions = {
    'Lámparas LED': 'Lámpara LED de alta eficiencia energética, ideal para iluminación general.',
    'Cables Eléctricos': 'Cable eléctrico de cobre, resistente y duradero para instalaciones.',
    'Reflectores': 'Reflector LED de alta potencia, perfecto para iluminación exterior.',
    'Iluminación Exterior': 'Luminaria LED resistente a la intemperie, ideal para exteriores.',
    'Accesorios': 'Accesorio eléctrico de calidad, fácil instalación y uso.',
    'Luminarias': 'Luminaria LED moderna y eficiente, perfecta para cualquier espacio.',
    'Bombillas': 'Bombilla LED de larga duración, ahorro energético garantizado.',
    'Interruptores': 'Interruptor eléctrico de calidad, instalación simple y segura.',
    'Tubos LED': 'Tubo LED de alta eficiencia, reemplazo directo de tubos fluorescentes.',
    'Plafones': 'Plafón LED moderno, iluminación uniforme y eficiente.'
  };
  return descriptions[category] || 'Producto de calidad para iluminación eléctrica.';
}

// Genera descripción larga
function generateLongDescription(category, name, price) {
  const baseDescription = generateShortDescription(category, name);
  const technicalSpecs = [
    'Voltaje: 110V - 220V',
    'Frecuencia: 60Hz',
    'Temperatura de color: 3000K - 6500K',
    'Índice de reproducción cromática: >80 CRI',
    'Vida útil: 50,000 horas',
    'Garantía: 2 años',
    'Certificación: ICONTEC'
  ];
  
  return `${baseDescription}\n\nEspecificaciones técnicas:\n${technicalSpecs.join('\n')}\n\nPrecio especial por unidad. Consulta por precios por mayor.`;
}

// Genera tags aleatorios
function generateTags(category, name) {
  const tags = [category];
  
  // Agregar tags basados en el nombre
  if (name.includes('LED')) tags.push('LED');
  if (name.includes('Exterior') || name.includes('Solar')) tags.push('Exterior');
  if (name.includes('Interior')) tags.push('Interior');
  if (name.includes('Solar')) tags.push('Solar');
  if (name.includes('Sensor')) tags.push('Sensor');
  if (name.includes('Dimmable')) tags.push('Dimmable');
  
  // Agregar tags aleatorios
  const randomTags = commonTags
    .filter(tag => !tags.includes(tag))
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.floor(Math.random() * 3) + 1);
  
  return [...tags, ...randomTags];
}

// Genera SKU
function generateSKU(category, index) {
  const categoryPrefix = category
    .replace(/\s+/g, '')
    .substring(0, 3)
    .toUpperCase();
  return `${categoryPrefix}-${String(index).padStart(3, '0')}`;
}

// Genera dimensiones aleatorias
function generateDimensions() {
  const widths = ['15cm', '20cm', '25cm', '30cm', '35cm', '40cm'];
  const heights = ['10cm', '12cm', '15cm', '18cm', '20cm', '25cm'];
  const depths = ['5cm', '8cm', '10cm', '12cm', '15cm', '20cm'];
  
  return {
    width: widths[Math.floor(Math.random() * widths.length)],
    height: heights[Math.floor(Math.random() * heights.length)],
    depth: depths[Math.floor(Math.random() * depths.length)]
  };
}

// Genera precio basado en categoría
function generatePrice(category) {
  const priceRanges = {
    'Lámparas LED': [15000, 80000],
    'Cables Eléctricos': [2000, 50000],
    'Reflectores': [50000, 500000],
    'Iluminación Exterior': [80000, 800000],
    'Accesorios': [5000, 25000],
    'Luminarias': [60000, 600000],
    'Bombillas': [8000, 35000],
    'Interruptores': [10000, 50000],
    'Tubos LED': [25000, 120000],
    'Plafones': [40000, 200000]
  };
  
  const [min, max] = priceRanges[category] || [10000, 100000];
  const price = Math.floor(Math.random() * (max - min + 1)) + min;
  
  // Redondear a múltiplos de 1000
  return Math.round(price / 1000) * 1000;
}

// Genera productos
function generateProducts() {
  const products = [];
  let productId = 1;
  
  categories.forEach((category, categoryIndex) => {
    const categoryProducts = productNames[category] || [];
    
    categoryProducts.forEach((productName, productIndex) => {
      const price = generatePrice(category);
      const sku = generateSKU(category, productIndex + 1);
      const tags = generateTags(category, productName);
      
      const product = {
        id: String(productId).padStart(3, '0'),
        title: productName,
        category: category,
        price: price,
        currency: 'COP',
        images: [
          `/images/products/${String(productId).padStart(3, '0')}-1.jpg`,
          `/images/products/${String(productId).padStart(3, '0')}-2.jpg`
        ],
        shortDescription: generateShortDescription(category, productName),
        description: generateLongDescription(category, productName, price),
        tags: tags,
        sku: sku,
        stock: Math.floor(Math.random() * 50) + 1,
        dimensions: generateDimensions(),
        rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0 - 5.0
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        popular: Math.random() > 0.7 // 30% de probabilidad de ser popular
      };
      
      products.push(product);
      productId++;
    });
  });
  
  return products;
}

// Genera y guarda los productos
function main() {
  console.log('Generando productos de ejemplo...');
  
  const products = generateProducts();
  const dataDir = path.join(__dirname, '..', 'data');
  
  // Crear directorio data si no existe
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // Guardar productos
  const productsPath = path.join(dataDir, 'products.json');
  fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
  
  console.log(`✅ Generados ${products.length} productos en ${productsPath}`);
  console.log(`📊 Categorías: ${categories.length}`);
  console.log(`💰 Rango de precios: $${Math.min(...products.map(p => p.price)).toLocaleString()} - $${Math.max(...products.map(p => p.price)).toLocaleString()} COP`);
}

if (require.main === module) {
  main();
}

module.exports = { generateProducts };
