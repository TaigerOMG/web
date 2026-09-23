# Envío de formularios a Telegram

La web sigue siendo estática, por lo que el token del bot no se guarda en `script.js` ni en `data/site.json`. El formulario publica un `POST` en `/api/telegram`; el archivo `api/telegram.js` está preparado para Vercel y envía el mensaje al chat o canal configurado.

Configura estas variables de entorno en el proveedor que ejecute la función:

- `TELEGRAM_BOT_TOKEN`: token del bot creado con BotFather.
- `TELEGRAM_CHAT_ID`: ID numérico del chat o `@nombre_del_canal`. Para un canal, añade el bot como administrador con permiso para publicar.
- `ALLOWED_ORIGIN`: opcional; por defecto `https://lacostahaus.com`.

GitHub Pages no ejecuta funciones server-side. Si la web continúa alojada únicamente en GitHub Pages, el formulario mostrará un enlace de respaldo a Telegram con el mensaje estructurado ya preparado. Para entrega automática, despliega esta carpeta en Vercel (o mueve `api/telegram.js` a otro endpoint serverless) y conserva `/api/telegram` en `data/site.json`.

No introduzcas el token del bot en ningún archivo público del repositorio.

