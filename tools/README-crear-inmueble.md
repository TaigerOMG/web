# Crear un inmueble nuevo

1. Duplica `nuevo-inmueble.ejemplo.json`.
2. Cambia `id`, `route`, `image`, `types`, `media`, `card` y `translations`.
3. Pon las imágenes en `BetaTest/assets/properties/nombre-del-inmueble/` o usa una ruta existente de `assets/`.
4. Ejecuta desde PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -NoProfile -File .\tools\add-property.ps1 -InputFile .\tools\mi-inmueble.json
```

El generador crea la carpeta de la ficha, guarda el JSON del inmueble y actualiza `data/properties.json`.

Campos obligatorios:

- `id`
- `route`
- `image`
- `types`
- `translations.es.title`
- `translations.es.price`
- `translations.es.description`

Campos opcionales:

- `media.pdf`
- `media.map_embed`
- `media.video`
- `media.images`
- Traducciones `en`, `fr`, `de`, `ru`

Si solo escribes español, el generador crea las demás entradas con el texto español como base para que la página no quede vacía.
