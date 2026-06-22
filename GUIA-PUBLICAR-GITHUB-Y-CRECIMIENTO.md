# Publicar LacostaHaus en GitHub y hacerla crecer

## 1. Subir la web a GitHub

La web que debe publicarse es la carpeta `BetaTest`.

### Opcion A: desde GitHub web

1. Entra en tu repositorio de GitHub.
2. Abre la rama donde publicas la web.
3. Sube el contenido de `BetaTest`, no la carpeta entera dentro de otra carpeta, si quieres que `lacostahaus.com` cargue desde la raiz.
4. Comprueba que en la raiz del repositorio queden `index.html`, `style.css`, `script.js`, `assets`, `data`, `articulos`, `inmuebles`, `servicios`, `contacto`, `sitemap.xml`, `robots.txt` y `CNAME` si usas dominio propio.
5. Haz commit con un mensaje claro, por ejemplo: `Update LacostaHaus beta site`.

### Opcion B: GitHub Desktop

1. Abre GitHub Desktop.
2. Elige el repositorio de la web.
3. Copia el contenido de `BetaTest` dentro de la carpeta local del repositorio.
4. Revisa los cambios.
5. Escribe un resumen de commit.
6. Pulsa `Commit`.
7. Pulsa `Push origin`.

## 2. Activar GitHub Pages

1. En GitHub entra en `Settings`.
2. Abre `Pages`.
3. En `Build and deployment`, selecciona publicar desde una rama.
4. Elige la rama correcta.
5. Elige `/root` si los archivos estan en la raiz del repositorio.
6. Guarda.
7. Espera el despliegue y abre la URL publicada.

## 3. Dominio propio

1. Mantén un archivo `CNAME` en la raiz con:

```text
lacostahaus.com
```

2. En el panel del dominio configura DNS hacia GitHub Pages.
3. En GitHub Pages activa `Enforce HTTPS` cuando esté disponible.

## 4. Despues de publicar

1. Abre `https://lacostahaus.com/sitemap.xml`.
2. Entra en Google Search Console.
3. Añade la propiedad `lacostahaus.com`.
4. Envia el sitemap.
5. Revisa indexacion, cobertura y consultas.
6. Conecta Google Tag Manager/Analytics cuando este lista la medicion.

## 5. Para tener mas visitas reales

- Publicar articulos con dudas concretas de propietarios.
- Enlazar cada articulo con servicios y contacto.
- Añadir inmuebles reales completos con fotos optimizadas.
- Conseguir enlaces externos locales: directorios, colaboradores, medios, perfiles sociales y partners.
- Mantener sitemap actualizado.
- Usar titulos naturales, no repetidos ni artificiales.
- Medir llamadas, WhatsApp, Telegram, formularios y clics en inmuebles.
- Publicar versiones en idiomas prioritarios cuando el contenido sea relevante para compradores internacionales.

## 6. Para tener mas interacciones

- Mantener botones de contacto visibles en articulos e inmuebles.
- Usar enlaces con UTM para saber de donde vienen los contactos.
- Compartir articulos en redes y grupos con contexto, no solo el enlace.
- Preparar fichas con CTA especifico: no "contacto" generico, sino "consultar este inmueble".
- Activar el backend privado cuando quieras subir inmuebles online sin tocar codigo.

