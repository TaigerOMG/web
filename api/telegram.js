const MAX_MESSAGE_LENGTH = 1500;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "https://lacostahaus.com";

function json(res, status, body) {
  res.status(status).setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

function clean(value, maxLength) {
  return String(value || "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, maxLength);
}

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.status(204).setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN).setHeader("Access-Control-Allow-Methods", "POST, OPTIONS").setHeader("Access-Control-Allow-Headers", "Content-Type").end();
    return;
  }
  if (req.method !== "POST") {
    json(res, 405, { ok: false, error: "method_not_allowed" });
    return;
  }

  const origin = req.headers.origin;
  if (origin && origin !== ALLOWED_ORIGIN) {
    json(res, 403, { ok: false, error: "origin_not_allowed" });
    return;
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) {
    json(res, 503, { ok: false, error: "telegram_not_configured" });
    return;
  }

  let body;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
  } catch (error) {
    json(res, 400, { ok: false, error: "invalid_json" });
    return;
  }
  if (clean(body.website, 100)) {
    json(res, 400, { ok: false, error: "spam_detected" });
    return;
  }

  const name = clean(body.name, 80);
  const email = clean(body.email, 120);
  const phone = clean(body.phone, 30);
  const message = clean(body.message, MAX_MESSAGE_LENGTH);
  const property = clean(body.property, 180);
  const language = clean(body.language, 10);
  const pageUrl = clean(body.page_url, 500);

  if (name.length < 2 || !email.includes("@") || phone.length < 6 || message.length < 10) {
    json(res, 422, { ok: false, error: "invalid_form" });
    return;
  }

  const telegramText = [
    "🏡 Nueva solicitud desde LacostaHaus",
    "",
    `Nombre: ${name}`,
    `Email: ${email}`,
    `Teléfono: ${phone}`,
    property ? `Inmueble: ${property}` : "",
    language ? `Idioma: ${language}` : "",
    "",
    "Mensaje:",
    message,
    "",
    pageUrl ? `Página: ${pageUrl}` : ""
  ].filter(Boolean).join("\n").slice(0, 3900);

  try {
    const response = await fetch(`https://api.telegram.org/bot${encodeURIComponent(botToken)}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: telegramText, disable_web_page_preview: true })
    });
    if (!response.ok) {
      json(res, 502, { ok: false, error: "telegram_delivery_failed" });
      return;
    }
    json(res, 200, { ok: true });
  } catch (error) {
    json(res, 502, { ok: false, error: "telegram_unreachable" });
  }
}

