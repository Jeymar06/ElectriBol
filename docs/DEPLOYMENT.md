# Despliegue

## Produccion recomendada

- Hosting: `Vercel`
- Base de datos: `Supabase`
- Auth: `Supabase Auth`
- Storage: `Supabase Storage`

## Variables minimas en Vercel

```env
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
NEXT_PUBLIC_WHATSAPP_NUMBER=573015956954

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_STORAGE_BUCKET=product-images
```

## Flujo

1. Importa el repo en `Vercel`.
2. Agrega las variables de entorno.
3. Ejecuta la migracion SQL de `supabase/migrations/20260603_electribol_core.sql`.
4. Crea el admin en `Supabase Auth`.
5. Crea o actualiza su fila en `profiles` con `role = 'admin'`.
6. Despliega o redeploya.

## Verificaciones

```bash
npm run lint
npm run type-check
npm run build
```

## Seguridad

- No pongas secretos en variables `NEXT_PUBLIC_*`
- No uses fallback local en produccion
- Manten `SUPABASE_SERVICE_ROLE_KEY` solo en servidor
- Activa MFA para la cuenta admin en Supabase si el equipo la necesita
- Revisa los logs de Vercel y Supabase despues de cada cambio sensible
