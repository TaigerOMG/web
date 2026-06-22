# Optimizacion De Imagenes

Estado actual:

- La web ya usa carga diferida (`loading="lazy"`) en imagenes internas de articulos y secciones.
- No se han sustituido imagenes por versiones comprimidas automaticas porque en este entorno no hay ImageMagick ni Pillow disponibles de forma fiable.
- Para evitar confusion, no se han creado imagenes de relleno ni variantes temporales.

Flujo recomendado cuando quieras comprimir:

1. Guardar originales en una carpeta externa, por ejemplo `IMG originales`.
2. Convertir imagenes grandes de articulos a `.webp` o `.jpg` con calidad 78-85.
3. Mantener `.png` solo para logos, transparencias o marcas de agua.
4. Revisar cada pagina despues de cambiar rutas.
5. Cambiar la version de cache en los HTML.

Regla practica:

- Hero: maximo recomendado 300-500 KB.
- Imagen interna de articulo: maximo recomendado 200-350 KB.
- Logo o icono: maximo recomendado 20-80 KB.
- PDFs y videos: subir solo cuando sean realmente necesarios.
