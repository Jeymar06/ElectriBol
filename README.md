# ElectriBol

Showroom y panel administrativo para ElectriBol construido con `Next.js 14`, `TypeScript`,
`Tailwind CSS` y `Supabase`.

## Stack

- Frontend y rutas server: `Next.js`
- Base de datos: `Supabase Postgres`
- Auth: `Supabase Auth`
- Storage: `Supabase Storage`
- Deploy recomendado: `Vercel`

## Estructura

```text
src/
  app/                 App Router, paginas y API routes
  components/          UI publica y admin
  lib/                 auth, catalogo, storage, supabase y seguridad
  styles/              tokens y estilos globales
  types/               tipos compartidos
  utils/               helpers puros
data/                  fallback local para desarrollo
public/                assets estaticos y uploads locales
scripts/               seeds y sincronizacion con Supabase
supabase/migrations/   esquema SQL
docs/                  guias operativas
```

## Variables de entorno

Copia `env.example` a `.env.local` y completa solo lo que uses.

### Produccion recomendada

```env
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
NEXT_PUBLIC_WHATSAPP_NUMBER=573015956954

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_STORAGE_BUCKET=product-images
```

### Fallback local de admin

Solo para desarrollo local.

```env
ADMIN_EMAIL=
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=
```

## Desarrollo

```bash
npm install
npm run dev
```

App local:

```text
http://localhost:3000
```

## Calidad

```bash
npm run lint
npm run type-check
npm run build
```

## Seguridad

- No guardes secretos en `NEXT_PUBLIC_*`
- `SUPABASE_SERVICE_ROLE_KEY` se usa solo en servidor
- El login admin usa `Supabase Auth` y valida rol `admin` en `profiles`
- El fallback local queda deshabilitado en produccion
- El login admin tiene rate limiting basico en servidor
- La cookie admin es `httpOnly`, `sameSite=strict` y `secure` en produccion

## Guias

- [Despliegue](docs/DEPLOYMENT.md)
- [Supabase + Vercel](docs/SUPABASE_VERCEL_SETUP.md)
- [Checklist](docs/CHECKLIST.md)
- [Resumen](docs/PROJECT_SUMMARY.md)
