# Guía de Despliegue - ElectriBol

## 🚀 Despliegue Rápido

### 1. Vercel (Recomendado)

**Pasos:**
1. Ve a [vercel.com](https://vercel.com) y crea una cuenta
2. Conecta tu repositorio de GitHub
3. Importa el proyecto `electribol-showroom`
4. Configura las variables de entorno:
   ```
   NEXT_PUBLIC_ADMIN_PASS=tu_contraseña_segura
   NEXT_PUBLIC_WHATSAPP_NUMBER=+573015956954
   ```
5. Haz clic en "Deploy"

**Ventajas:**
- Despliegue automático en cada push
- CDN global
- SSL automático
- Dominio personalizado gratuito

### 2. Netlify

**Pasos:**
1. Ve a [netlify.com](https://netlify.com) y crea una cuenta
2. Conecta tu repositorio de GitHub
3. Configura el build:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. Configura las variables de entorno en Site settings
5. Haz clic en "Deploy site"

### 3. VPS/Server

**Requisitos:**
- Node.js 18+
- Nginx (opcional)
- PM2 (recomendado)

**Pasos:**
```bash
# 1. Clonar repositorio
git clone https://github.com/tu-usuario/electribol-showroom.git
cd electribol-showroom

# 2. Instalar dependencias
npm install

# 3. Generar productos de ejemplo
npm run seed

# 4. Construir aplicación
npm run build

# 5. Instalar PM2
npm install -g pm2

# 6. Ejecutar aplicación
pm2 start npm --name "electribol" -- start

# 7. Configurar PM2 para inicio automático
pm2 startup
pm2 save
```

## 🔧 Configuración Post-Despliegue

### 1. Dominio Personalizado

**Vercel:**
1. Ve a Project Settings > Domains
2. Agrega tu dominio
3. Configura los DNS según las instrucciones

**Netlify:**
1. Ve a Site settings > Domain management
2. Agrega tu dominio
3. Configura los DNS

### 2. Variables de Entorno

Configura estas variables en tu plataforma de despliegue:

```env
# Panel de administración
NEXT_PUBLIC_ADMIN_PASS=contraseña_super_segura

# WhatsApp (cambia por tu número)
NEXT_PUBLIC_WHATSAPP_NUMBER=+573015956954

# Google Maps (opcional)
NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY=tu_api_key

# Analytics (opcional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 3. Base de Datos

**Opción 1: JSON (Actual)**
- Los productos se almacenan en `data/products.json`
- Edita directamente o usa el panel de administración

**Opción 2: CMS Headless (Recomendado para producción)**
- Strapi
- Contentful
- Sanity
- Directus

### 4. Imágenes

**Opción 1: Almacenamiento local**
- Sube las imágenes a `public/images/products/`
- Nombra los archivos: `001-1.jpg`, `001-2.jpg`, etc.

**Opción 2: CDN (Recomendado)**
- Cloudinary
- AWS S3
- Vercel Blob

## 📊 Monitoreo

### 1. Analytics

**Google Analytics:**
```tsx
// En src/app/layout.tsx
useEffect(() => {
  gtag('config', process.env.NEXT_PUBLIC_GA_ID);
}, []);
```

**Vercel Analytics:**
```bash
npm install @vercel/analytics
```

### 2. Performance

**Lighthouse:**
- Ejecuta auditorías regulares
- Optimiza imágenes
- Minimiza JavaScript

**Core Web Vitals:**
- LCP < 2.5s
- FID < 100ms
- CLS < 0.1

## 🔒 Seguridad

### 1. Headers de Seguridad

Ya configurados en `next.config.js`:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: origin-when-cross-origin

### 2. Panel de Administración

- Cambia la contraseña por defecto
- Usa contraseñas seguras
- Considera autenticación adicional

### 3. HTTPS

- Vercel y Netlify lo configuran automáticamente
- Para VPS, configura SSL con Let's Encrypt

## 🚨 Troubleshooting

### Error: "Module not found"

```bash
# Limpiar caché
rm -rf .next node_modules
npm install
npm run build
```

### Error: "Build failed"

```bash
# Verificar logs
npm run build -- --debug

# Verificar tipos
npm run type-check
```

### Error: "Images not loading"

1. Verifica que las imágenes estén en `public/images/`
2. Verifica los nombres de archivo en `products.json`
3. Verifica los permisos de archivos

### Error: "WhatsApp not working"

1. Verifica el formato del número: `+573015956954`
2. Verifica que no haya espacios
3. Prueba el enlace manualmente

## 📈 Optimizaciones

### 1. Performance

```bash
# Analizar bundle
npm run build
npx @next/bundle-analyzer

# Optimizar imágenes
npx @squoosh/cli --webp public/images/products/*.jpg
```

### 2. SEO

- Verifica meta tags en cada página
- Configura sitemap.xml
- Configura robots.txt
- Verifica JSON-LD

### 3. Caching

```javascript
// En next.config.js
async headers() {
  return [
    {
      source: '/images/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ];
}
```

## 🔄 Actualizaciones

### 1. Actualización de Código

```bash
# Pull cambios
git pull origin main

# Instalar nuevas dependencias
npm install

# Rebuild
npm run build

# Restart (si usas PM2)
pm2 restart electribol
```

### 2. Actualización de Productos

**Panel de Administración:**
1. Ve a `/admin`
2. Ingresa la contraseña
3. Edita productos
4. Los cambios se guardan automáticamente

**Manual:**
1. Edita `data/products.json`
2. Haz commit y push
3. El sitio se actualiza automáticamente

## 📞 Soporte

Si tienes problemas con el despliegue:

1. **Revisa los logs** de tu plataforma
2. **Verifica las variables** de entorno
3. **Consulta la documentación** de Next.js
4. **Contacta soporte** de tu plataforma

**ElectriBol** - Iluminación de Calidad ⚡
