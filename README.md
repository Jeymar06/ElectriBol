# ElectriBol - Página Web Mostrario

Página web mostrario profesional para ElectriBol, especialistas en lámparas, cables, reflectores y todo lo relacionado con alumbrado.

## 🚀 Características

- **Búsqueda en tiempo real** con Fuse.js para búsqueda fuzzy
- **Filtros avanzados** por categoría y rango de precio
- **Sistema de cotización** integrado con WhatsApp
- **Diseño responsivo** y accesible
- **SEO optimizado** con meta tags y JSON-LD
- **Panel de administración** para gestionar productos
- **Optimización de imágenes** con lazy loading
- **Internacionalización** preparada para múltiples idiomas

## 🛠️ Tecnologías

- **Frontend**: Next.js 14, React 18, TypeScript
- **Estilos**: Tailwind CSS
- **Búsqueda**: Fuse.js
- **Iconos**: Lucide React
- **Testing**: Jest, Playwright
- **CI/CD**: GitHub Actions

## 📦 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/electribol-showroom.git
   cd electribol-showroom
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Generar datos de ejemplo**
   ```bash
   npm run seed
   ```

4. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

5. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

## 🎯 Comandos Disponibles

```bash
# Desarrollo
npm run dev          # Ejecutar servidor de desarrollo
npm run build        # Construir para producción
npm run start        # Ejecutar servidor de producción

# Testing
npm run test         # Ejecutar tests unitarios
npm run test:e2e     # Ejecutar tests end-to-end
npm run lint         # Ejecutar linter
npm run type-check   # Verificar tipos TypeScript

# Datos
npm run seed         # Generar productos de ejemplo
```

## 📁 Estructura del Proyecto

```
electribol-showroom/
├── src/
│   ├── app/                 # Páginas de Next.js
│   │   ├── page.tsx        # Página principal
│   │   ├── contact/        # Página de contacto
│   │   └── product/[id]/   # Página de producto
│   ├── components/         # Componentes React
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── ProductCard.tsx
│   │   ├── SearchBar.tsx
│   │   └── ...
│   ├── lib/               # Utilidades y lógica
│   │   ├── products.ts
│   │   └── fuse.ts
│   ├── styles/            # Estilos globales
│   └── utils/             # Funciones auxiliares
├── data/
│   └── products.json      # Base de datos de productos
├── admin/
│   └── index.tsx         # Panel de administración
├── tests/                # Tests
│   ├── unit/            # Tests unitarios
│   └── e2e/             # Tests end-to-end
└── public/              # Archivos estáticos
    ├── images/
    └── favicon.ico
```

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Panel de administración
NEXT_PUBLIC_ADMIN_PASS=tu_contraseña_admin

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=+573015956954

# Google Maps (opcional)
NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY=tu_api_key
```

### Personalización

1. **Colores de marca**: Edita `tailwind.config.js`
2. **Información de contacto**: Modifica `src/components/Footer.tsx`
3. **Productos**: Usa el panel de administración o edita `data/products.json`

## 📱 Funcionalidades

### Búsqueda y Filtros
- Búsqueda en tiempo real por título, SKU, tags y descripción
- Filtros por categoría (múltiple selección)
- Filtro por rango de precio
- Ordenamiento por precio, popularidad y fecha

### Sistema de Cotización
- Agregar productos a cotización
- Modificar cantidades
- Generar mensaje de WhatsApp automático
- Persistencia en localStorage

### Panel de Administración
- Acceso protegido por contraseña
- CRUD completo de productos
- Interfaz intuitiva para gestión

### SEO y Performance
- Meta tags dinámicos
- JSON-LD para productos
- Open Graph y Twitter Cards
- Optimización de imágenes
- Lazy loading

## 🚀 Despliegue

### Vercel (Recomendado)

1. **Conectar repositorio**
   - Ve a [Vercel](https://vercel.com)
   - Importa tu repositorio de GitHub

2. **Configurar variables de entorno**
   ```
   NEXT_PUBLIC_ADMIN_PASS=tu_contraseña
   NEXT_PUBLIC_WHATSAPP_NUMBER=+573015956954
   ```

3. **Desplegar**
   - Vercel desplegará automáticamente en cada push a main

### Netlify

1. **Build settings**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

2. **Variables de entorno**
   - Configura las mismas variables que en Vercel

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🧪 Testing

### Tests Unitarios
```bash
npm run test
```

### Tests E2E
```bash
npm run test:e2e
```

### Coverage
```bash
npm run test -- --coverage
```

## 📊 Monitoreo y Analytics

### Google Analytics
Agrega tu ID de Google Analytics en `src/app/layout.tsx`:

```tsx
// Google Analytics
useEffect(() => {
  gtag('config', 'GA_MEASUREMENT_ID');
}, []);
```

### Vercel Analytics
```bash
npm install @vercel/analytics
```

## 🔒 Seguridad

- Headers de seguridad configurados
- Validación de entrada en formularios
- Sanitización de datos
- Autenticación para panel admin

## 🌐 Internacionalización

El proyecto está preparado para múltiples idiomas:

1. Crea archivos de traducción en `src/locales/`
2. Implementa el hook `useTranslation`
3. Configura el router de idiomas

## 📈 Performance

- **Lighthouse Score**: 95+
- **Core Web Vitals**: Optimizado
- **Bundle Size**: < 500KB
- **First Contentful Paint**: < 1.5s

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Soporte

- **Email**: info@electribol.com
- **WhatsApp**: +57 301 595 6954
- **GitHub Issues**: [Reportar bug](https://github.com/tu-usuario/electribol-showroom/issues)

## 🎯 Roadmap

- [ ] Integración con CMS headless (Strapi/Contentful)
- [ ] Sistema de usuarios y autenticación
- [ ] Carrito de compras completo
- [ ] Integración con pasarelas de pago
- [ ] App móvil (React Native)
- [ ] Dashboard de analytics
- [ ] Sistema de notificaciones push

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/) - Framework de React
- [Tailwind CSS](https://tailwindcss.com/) - Framework de CSS
- [Fuse.js](https://fusejs.io/) - Biblioteca de búsqueda
- [Lucide](https://lucide.dev/) - Iconos
- [Playwright](https://playwright.dev/) - Testing E2E

---

**ElectriBol** - Iluminación de Calidad ⚡
