# Guía rápida: subir LacostaHaus a GitHub y añadir inmuebles

## Publicar en GitHub Pages

No borres lo que ya tienes sin copia. Hazlo así:

1. En GitHub, crea una rama nueva, por ejemplo `beta-lacostahaus`.
2. Descarga o clona el repositorio en tu equipo.
3. Haz una copia de seguridad de lo actual, especialmente `CNAME`, imágenes y cualquier carpeta antigua que quieras conservar.
4. Para que la web salga como `https://lacostahaus.com/` y no como `/BetaTest/`, copia el contenido de `BetaTest` a la raíz del repositorio:
   - `index.html`
   - `style.css`
   - `script.js`
   - `assets/`
   - `data/`
   - `inmuebles/`
   - `masia/`
   - `contacto/`
   - `agente-inmobiliario/`
   - `servicios/`
   - `articulos/`
   - `politica-cookies/`
   - `politica-privacidad/`
5. Mantén el archivo `CNAME` si ya apunta a `lacostahaus.com`.
6. Sube los cambios a la rama nueva.
7. Revisa la previsualización de GitHub Pages.
8. Si todo está bien, fusiona la rama con `main`.

## Qué no conviene hacer

- No borres `CNAME` si el dominio ya funciona.
- No mezcles archivos antiguos y nuevos con el mismo nombre sin revisar.
- No subas solo `BetaTest` si quieres que la web final sea `lacostahaus.com`; si subes la carpeta completa, la URL quedará como `lacostahaus.com/BetaTest/`.

## Añadir nuevos inmuebles

El flujo limpio es usar el generador:

```powershell
cd "C:\Users\atmin\Documents\Web BETA"
powershell -ExecutionPolicy Bypass -File ".\BetaTest\tools\add-property.ps1" -InputJson ".\BetaTest\tools\nuevo-inmueble.ejemplo.json"
```

Antes de ejecutarlo, duplica `nuevo-inmueble.ejemplo.json`, cambia:

- `id`
- `route`
- `image`
- `types`
- `translations.es.title`
- `translations.es.price`
- `translations.es.excerpt`
- `media.images`
- `media.video` si existe
- `media.pdf` si existe
- `media.map_embed` si existe

Después revisa:

- La nueva carpeta creada para la ficha.
- `data/properties.json`, donde aparece el inmueble en catálogo/carrusel.
- Las imágenes dentro de `assets/`.

## Medición de campañas

Para saber de dónde llega un visitante, usa enlaces con UTM:

```text
https://lacostahaus.com/contacto/?utm_source=instagram&utm_medium=social&utm_campaign=masia_port_daro
```

Ejemplos:

- `utm_source=blog`
- `utm_source=instagram`
- `utm_source=telegram`
- `utm_medium=organic`
- `utm_medium=social`
- `utm_campaign=masia_port_daro`
