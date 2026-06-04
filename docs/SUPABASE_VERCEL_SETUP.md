# ElectriBol: Supabase + Vercel

## Stack recomendado

- Frontend y server routes: `Next.js` en `Vercel`
- Base de datos: `Supabase Postgres`
- Autenticacion: `Supabase Auth`
- Imagenes: `Supabase Storage`
- Permisos: `RLS`

## Variables de entorno

```env
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
NEXT_PUBLIC_WHATSAPP_NUMBER=573015956954

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_STORAGE_BUCKET=product-images
```

## Pasos

1. Crea el proyecto en Supabase.
2. Ejecuta la migracion `supabase/migrations/20260603_electribol_core.sql`.
3. Crea el usuario admin en Supabase Auth.
4. Inserta o actualiza su fila en `profiles` con `role = 'admin'`.
5. Configura variables en Vercel.
6. Despliega el repositorio.

## Sincronizar datos iniciales

Cuando la migracion ya exista en Supabase, ejecuta:

```bash
npm run supabase:sync
```

Ese script:

- sube `categories.json`
- sube `products.json`
- recrea `product_images`
- asegura el perfil admin en `profiles`

## Permisos

- Publico:
  - leer categorias activas
  - leer productos visibles
  - leer imagenes publicas
- Admin:
  - crear, editar y borrar categorias
  - crear, editar y borrar productos
  - subir imagenes
  - consultar auditoria

## Fallback local

Si Supabase no esta configurado, la app puede usar:

- JSON local para datos
- cookie local para admin
- `public/uploads` para imagenes

Ese fallback debe quedarse solo para desarrollo local.
