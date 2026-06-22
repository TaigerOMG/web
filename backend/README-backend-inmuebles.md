# Backend privado de inmuebles LacostaHaus

Esta primera version usa Supabase como backend privado y GitHub Pages solo como web publica.

## Que queda protegido

- La pagina publica solo puede leer inmuebles con `status = published`.
- El panel `/admin/` necesita login.
- Crear, editar o borrar inmuebles solo funciona para el email que pongas en las politicas SQL.
- Las claves secretas no se suben a GitHub. La `anon key` puede estar en el frontend porque la seguridad real esta en Row Level Security.

## Pasos en Supabase

1. Crea un proyecto en Supabase.
2. En Authentication, crea tu usuario con email y contrasena.
3. Abre `backend/supabase-schema.sql`.
4. Sustituye `TU_EMAIL_ADMIN@DOMINIO.COM` por tu email real.
5. Ejecuta el SQL en Supabase SQL Editor.
6. En Project Settings > API copia:
   - Project URL
   - anon public key
7. Edita `data/backend-config.json`:

```json
{
  "enabled": true,
  "sourceMode": "merge",
  "supabaseUrl": "https://TU-PROYECTO.supabase.co",
  "anonKey": "TU_ANON_KEY",
  "storageBucket": "property-images"
}
```

## sourceMode

- `merge`: mezcla inmuebles online con los actuales del JSON. Es el modo mas seguro al principio.
- `online`: muestra solo inmuebles publicados en Supabase. Usalo cuando ya migremos todos los inmuebles reales.

## Acceso al panel

Cuando este configurado:

```text
https://lacostahaus.com/admin/
```

En local:

```text
http://127.0.0.1:8123/BetaTest/admin/
```

## Crear un inmueble

1. Entra en `/admin/`.
2. Inicia sesion con tu email.
3. Rellena el formulario.
4. Sube una imagen principal.
5. Guarda como `Borrador` para revisar.
6. Cambia a `Publicado` cuando quieras que aparezca en la web.

## Quitar un inmueble

- Si quieres ocultarlo temporalmente: cambia `Publicado` a `Borrador`.
- Si quieres quitarlo del backend: usa `Eliminar`.

Nota: los inmuebles antiguos que viven en `data/properties.json` no se borran desde Supabase. Cuando quieras pasar todo a online, cambiaremos `sourceMode` a `online` o migraremos esos inmuebles a Supabase.
