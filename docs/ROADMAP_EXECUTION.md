# Roadmap de Ejecucion

## Objetivo

Elevar ElectriBol desde una base funcional a una vitrina mas preparada para produccion,
con mejor conversion, mejor seguridad operativa y mejores señales para tomar decisiones.

## Ejecutado en esta fase

### 1. Seguridad

- login admin sin credenciales precargadas en frontend
- fallback local deshabilitado en produccion
- cookies mas estrictas para admin
- rate limit en login admin
- rate limit en uploads del panel
- headers de seguridad mas completos

### 2. Estructura

- documentacion operativa movida a `docs/`
- configuracion de testing agrupada en `config/testing/`
- explorer de VS Code mas limpio con `.vscode/settings.json`

### 3. Diseno y UX

- home rediseñada con mas continuidad visual
- motion con `GSAP`
- secciones de catalogo y producto alineadas con la nueva direccion visual
- acceso admin discreto desde footer

### 4. Copy comercial

- textos orientados al cliente final
- mensajes menos tecnicos y menos internos
- WhatsApp y contacto con tono comercial mas natural

### 5. SEO y conversion

- `robots.txt`
- `sitemap.xml`
- schema `LocalBusiness / HardwareStore`
- CTA de WhatsApp mas contextuales
- CTA de catalogo para busquedas vacias

### 6. Analitica operativa

- endpoint interno `/api/events`
- tracking de clics en WhatsApp
- tracking de mapa y rutas
- tracking de busquedas vacias
- resumen de interacciones visible en admin

## Siguiente bloque recomendado

### Prioridad alta

- cargar contenido real de productos
- reemplazar placeholders con fotos reales
- enriquecer fichas con potencia, uso, medidas y marcas

### Prioridad media

- eventos adicionales: vistas por categoria, scroll profundo, formularios
- ordenamiento manual de productos destacados
- filtros comerciales mas finos

### Prioridad de produccion

- rotar claves ya expuestas en conversaciones
- activar MFA para admin
- mover rate limit a Redis o servicio persistente
- revisar politicas RLS y backups
