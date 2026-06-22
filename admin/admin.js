(function () {
  const status = document.querySelector("[data-admin-status]");
  const configWarning = document.querySelector("[data-config-warning]");
  const loginPanel = document.querySelector("[data-login-panel]");
  const adminPanel = document.querySelector("[data-admin-panel]");
  const loginForm = document.querySelector("[data-login-form]");
  const propertyForm = document.querySelector("[data-property-form]");
  const propertyList = document.querySelector("[data-property-list]");
  const signOutButton = document.querySelector("[data-sign-out]");
  const refreshButton = document.querySelector("[data-refresh-properties]");
  const newButton = document.querySelector("[data-new-property]");

  let config = null;
  let client = null;
  let properties = [];

  function setStatus(message) {
    if (status) status.textContent = message || "";
  }

  function slugify(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 90);
  }

  function backendReady() {
    return Boolean(config?.enabled && config.supabaseUrl && config.anonKey);
  }

  async function loadConfig() {
    const response = await fetch("../data/backend-config.json", { cache: "no-store" });
    if (!response.ok) throw new Error("No se pudo cargar backend-config.json");
    config = await response.json();
    if (!backendReady()) {
      configWarning.hidden = false;
      loginForm.querySelectorAll("input, button").forEach((item) => item.disabled = true);
      setStatus("Backend desactivado. Configura Supabase antes de iniciar sesión.");
      return;
    }
    client = window.supabase.createClient(config.supabaseUrl, config.anonKey);
  }

  function parseTypes(value) {
    return String(value || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function parseParagraphs(value) {
    return String(value || "")
      .split(/\n+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function parseDetails(value) {
    return String(value || "")
      .split(/\n+/)
      .map((line) => {
        const parts = line.split(":");
        const label = parts.shift()?.trim();
        const detail = parts.join(":").trim();
        return label && detail ? [label, detail] : null;
      })
      .filter(Boolean);
  }

  function fallbackTranslations(es) {
    return {
      es,
      en: es,
      fr: es,
      de: es,
      ru: es
    };
  }

  function buildPropertyPayload(form) {
    const formData = new FormData(form);
    const id = slugify(formData.get("id") || formData.get("title"));
    const title = String(formData.get("title") || "").trim();
    const price = String(formData.get("price") || "Consultar").trim();
    const location = String(formData.get("location") || "Costa Brava").trim();
    const excerpt = String(formData.get("excerpt") || "").trim();
    const description = parseParagraphs(formData.get("description"));
    const details = parseDetails(formData.get("details"));
    const imageUrl = String(formData.get("image_url") || "").trim();
    const pdf = String(formData.get("pdf") || "").trim();
    const mapEmbed = String(formData.get("map_embed") || "").trim();

    const cardEs = {
      tag: String(formData.get("tag") || "Nuevo").trim(),
      title,
      location,
      price,
      excerpt
    };

    const pageEs = {
      title,
      seo_title: `${title} | LacostaHaus`,
      seo_description: excerpt || `Ficha inmobiliaria de ${title} en LacostaHaus.`,
      details_title: "Detalles de la propiedad",
      price,
      details: details.length ? details : [["Ubicación", location]],
      project_title: "Documentación",
      pdf_title: `Documentación ${title}`,
      download_pdf: "Descargar PDF",
      description_title: "Descripción",
      description: description.length ? description : [excerpt || "Información disponible bajo solicitud."],
      location_title: "Ubicación",
      location_text: location,
      contact_label: "Contacto",
      email_label: "Gmail",
      spoken_label: "Hablamos",
      video_fallback: "Tu navegador no soporta la reproducción de vídeo."
    };

    return {
      id,
      status: formData.get("status") || "draft",
      route: `inmuebles/ficha/?id=${encodeURIComponent(id)}`,
      image_url: imageUrl,
      types: parseTypes(formData.get("types")),
      card_translations: fallbackTranslations(cardEs),
      property_data: {
        media: {
          poster: imageUrl,
          video: "",
          images: imageUrl ? [{ src: imageUrl, alt_es: title }] : [],
          pdf,
          map_embed: mapEmbed
        },
        translations: fallbackTranslations(pageEs)
      },
      show_home: formData.get("show_home") === "on",
      home_hero: formData.get("home_hero") === "on",
      sort_order: Number(formData.get("sort_order")) || 100
    };
  }

  async function uploadImage(id, file) {
    if (!file || !file.size) return "";
    const extension = file.name.split(".").pop() || "jpg";
    const path = `${id}/${Date.now()}.${extension}`;
    const { error } = await client.storage
      .from(config.storageBucket || "property-images")
      .upload(path, file, { upsert: true, contentType: file.type || "image/jpeg" });
    if (error) throw error;
    const { data } = client.storage
      .from(config.storageBucket || "property-images")
      .getPublicUrl(path);
    return data.publicUrl;
  }

  async function loadProperties() {
    const { data, error } = await client
      .from("properties")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) throw error;
    properties = data || [];
    renderProperties();
  }

  function propertyTitle(row) {
    return row.card_translations?.es?.title || row.id;
  }

  function previewHref(row) {
    const route = row.route || `inmuebles/ficha/?id=${encodeURIComponent(row.id)}`;
    const separator = route.includes("?") ? "&" : "?";
    return `../${route}${separator}lang=es`;
  }

  function renderProperties() {
    if (!propertyList) return;
    if (!properties.length) {
      propertyList.innerHTML = "<p>No hay inmuebles online todavía.</p>";
      return;
    }

    propertyList.innerHTML = properties.map((row) => `
      <article class="admin-property-item">
        <img src="${row.image_url || "../assets/masia.svg"}" alt="">
        <div>
          <h3>${propertyTitle(row)}</h3>
          <p>${row.status === "published" ? "Publicado" : "Borrador"} · ${row.card_translations?.es?.price || "Sin precio"}</p>
          <div class="admin-property-actions">
            <button class="admin-secondary" type="button" data-edit="${row.id}">Editar</button>
            <a class="admin-secondary" href="${previewHref(row)}" target="_blank" rel="noopener">Ver</a>
            <button class="admin-danger" type="button" data-delete="${row.id}">Eliminar</button>
          </div>
        </div>
      </article>
    `).join("");
  }

  function resetForm() {
    propertyForm.reset();
    propertyForm.elements.editingId.value = "";
    propertyForm.elements.status.value = "draft";
    propertyForm.elements.sort_order.value = "100";
    propertyForm.elements.show_home.checked = true;
    propertyForm.elements.home_hero.checked = false;
  }

  function fillForm(row) {
    const card = row.card_translations?.es || {};
    const page = row.property_data?.translations?.es || {};
    const media = row.property_data?.media || {};
    propertyForm.elements.editingId.value = row.id;
    propertyForm.elements.id.value = row.id;
    propertyForm.elements.status.value = row.status || "draft";
    propertyForm.elements.sort_order.value = row.sort_order || 100;
    propertyForm.elements.types.value = (row.types || []).join(", ");
    propertyForm.elements.show_home.checked = row.show_home !== false;
    propertyForm.elements.home_hero.checked = row.home_hero === true;
    propertyForm.elements.image_url.value = row.image_url || "";
    propertyForm.elements.tag.value = card.tag || "Nuevo";
    propertyForm.elements.price.value = card.price || page.price || "";
    propertyForm.elements.title.value = card.title || page.title || "";
    propertyForm.elements.location.value = card.location || page.location_text || "";
    propertyForm.elements.excerpt.value = card.excerpt || page.seo_description || "";
    propertyForm.elements.description.value = (page.description || []).join("\n\n");
    propertyForm.elements.details.value = (page.details || []).map((item) => `${item[0]}: ${item[1]}`).join("\n");
    propertyForm.elements.pdf.value = media.pdf || "";
    propertyForm.elements.map_embed.value = media.map_embed || "";
    window.scrollTo({ top: propertyForm.offsetTop - 24, behavior: "smooth" });
  }

  async function saveProperty(event) {
    event.preventDefault();
    setStatus("Guardando inmueble...");
    const payload = buildPropertyPayload(propertyForm);
    const file = propertyForm.elements.image_file.files[0];
    if (file) {
      payload.image_url = await uploadImage(payload.id, file);
      payload.property_data.media.poster = payload.image_url;
      payload.property_data.media.images = [{ src: payload.image_url, alt_es: payload.card_translations.es.title }];
      propertyForm.elements.image_url.value = payload.image_url;
    }

    const { error } = await client
      .from("properties")
      .upsert(payload, { onConflict: "id" });
    if (error) throw error;
    setStatus("Inmueble guardado.");
    await loadProperties();
  }

  async function deleteProperty(id) {
    const row = properties.find((item) => item.id === id);
    if (!row) return;
    if (!confirm(`Eliminar "${propertyTitle(row)}"? Esta acción lo quitará del backend online.`)) return;
    setStatus("Eliminando inmueble...");
    const { error } = await client.from("properties").delete().eq("id", id);
    if (error) throw error;
    setStatus("Inmueble eliminado.");
    await loadProperties();
  }

  function showAdmin(isLoggedIn) {
    loginPanel.hidden = isLoggedIn;
    adminPanel.hidden = !isLoggedIn;
    signOutButton.hidden = !isLoggedIn;
  }

  async function init() {
    try {
      await loadConfig();
      if (!backendReady()) return;

      const { data } = await client.auth.getSession();
      showAdmin(Boolean(data.session));
      if (data.session) await loadProperties();

      client.auth.onAuthStateChange((_event, session) => {
        showAdmin(Boolean(session));
        if (session) loadProperties().catch((error) => setStatus(error.message));
      });
    } catch (error) {
      setStatus(error.message);
    }
  }

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      setStatus("Iniciando sesión...");
      const formData = new FormData(loginForm);
      const { error } = await client.auth.signInWithPassword({
        email: formData.get("email"),
        password: formData.get("password")
      });
      if (error) throw error;
      setStatus("Sesión iniciada.");
    } catch (error) {
      setStatus(error.message);
    }
  });

  propertyForm.addEventListener("submit", (event) => {
    saveProperty(event).catch((error) => setStatus(error.message));
  });

  propertyForm.elements.title.addEventListener("input", () => {
    if (!propertyForm.elements.editingId.value) {
      propertyForm.elements.id.value = slugify(propertyForm.elements.title.value);
    }
  });

  propertyList.addEventListener("click", (event) => {
    const editId = event.target.closest("[data-edit]")?.dataset.edit;
    const deleteId = event.target.closest("[data-delete]")?.dataset.delete;
    if (editId) fillForm(properties.find((row) => row.id === editId));
    if (deleteId) deleteProperty(deleteId).catch((error) => setStatus(error.message));
  });

  refreshButton.addEventListener("click", () => {
    loadProperties().catch((error) => setStatus(error.message));
  });

  newButton.addEventListener("click", resetForm);

  signOutButton.addEventListener("click", async () => {
    await client.auth.signOut();
    setStatus("Sesión cerrada.");
  });

  init();
}());
