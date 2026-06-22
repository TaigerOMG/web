# Prompt Futuro Backend Inmuebles Online

Usar cuando queramos pasar de editar JSON local a gestionar inmuebles online.

Prompt:

Quiero crear un backend privado para LacostaHaus que me permita iniciar sesion como administrador y crear, editar, traducir y publicar inmuebles sin tocar codigo. La web actual es estatica y usa JSON/JS con idiomas `es`, `en`, `fr`, `de`, `ru`. Necesito mantener el diseño actual de `BetaTest`, pero sustituir la gestion manual por un panel privado.

Requisitos:

- Login privado para administrador.
- CRUD de inmuebles: nombre, precio, ubicacion, tipo de edificacion, descripcion, caracteristicas, imagen principal, galeria, PDF opcional, mapa opcional, estado publicado/borrador.
- Traducciones por idioma para titulos, descripciones, etiquetas y textos SEO.
- Generacion automatica de ruta del inmueble y actualizacion del catalogo.
- Campos SEO: title, description, canonical, slug, imagen social.
- Subida de imagenes con optimizacion y marca de agua LacostaHaus.
- Opcion de destacar inmueble en home y carrusel.
- Guardado online preferiblemente en Google Sheets, Firebase, Supabase o un CMS ligero, priorizando facilidad de mantenimiento.
- Exportacion o cache local para que la web siga cargando rapido.
- Mantener estructura actual de archivos y compatibilidad con GitHub Pages si es posible.

Antes de implementar, analizar el proyecto actual, proponer arquitectura simple y explicar costes, ventajas y limites de cada opcion.
