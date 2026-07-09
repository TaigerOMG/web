(function () {
  const CONSENT_KEY = "lacostahaus_cookie_consent";
  const LANG_KEY = "lacostahaus_beta_language";
  const SCROLL_RESTORE_KEY = "lacostahaus_restore_scroll";
  const scriptUrl = document.currentScript ? document.currentScript.src : window.location.href;
  const baseUrl = new URL(".", scriptUrl);
  const DATA_VERSION = "20260706-main-image-lightbox";
  const page = document.body.dataset.page || "home";

  let site = null;
  let homeData = null;
  let propertiesData = null;
  let currentLanguage = "es";
  let currentText = null;
  let propertyGalleryItems = [];
  let propertyGalleryIndex = 0;

  const propertyMapLabels = {
    es: "Abrir ubicacion en Google Maps",
    en: "Open location in Google Maps",
    fr: "Ouvrir l'emplacement dans Google Maps",
    de: "Standort in Google Maps offnen",
    ru: "Open location in Google Maps"
  };

  const videoLoadingLabels = {
    es: "Cargando video...",
    en: "Loading video...",
    fr: "Chargement de la video...",
    de: "Video wird geladen...",
    ru: "Loading video..."
  };

  const propertyContactLabels = {
    es: "Contactar por este inmueble",
    en: "Contact us about this property",
    fr: "Nous contacter pour ce bien",
    de: "Kontakt zu dieser Immobilie",
    ru: "Связаться по этому объекту"
  };

  const contactPropertyLabels = {
    es: "Consulta sobre",
    en: "Enquiry about",
    fr: "Demande sur",
    de: "Anfrage zu",
    ru: "Запрос по объекту"
  };

  const propertyDetailsToggleLabels = {
    es: { more: "Ver más detalles", less: "Mostrar menos" },
    en: { more: "View more details", less: "Show less" },
    fr: { more: "Voir plus de détails", less: "Afficher moins" },
    de: { more: "Mehr Details anzeigen", less: "Weniger anzeigen" },
    ru: { more: "Показать больше деталей", less: "Показать меньше" }
  };

  const currencyLabels = {
    es: "Cambio aproximado",
    en: "Approximate exchange",
    fr: "Change approximatif",
    de: "Ungefährer Wechselkurs",
    ru: "Примерный курс"
  };

  const currencyFallbackRates = {
    USD: 1.08,
    RUB: 95,
    GBP: 0.84,
    CHF: 0.93
  };

  const footerUtilityLabels = {
    es: { articles: "Artículos", doubts: "Dudas" },
    en: { articles: "Articles", doubts: "Seller FAQ" },
    fr: { articles: "Articles", doubts: "Questions" },
    de: { articles: "Artikel", doubts: "Fragen" },
    ru: { articles: "Статьи", doubts: "Вопросы" }
  };

  const doubtsNavLabels = {
    es: {
      title: "Dudas",
      items: [
        { label: "Vender sin malvender", route: "articulos/vender-casa-lujo-costa-brava/" },
        { label: "Precio alto", route: "articulos/casa-sobrevalorada-antes-vender/" },
        { label: "Meses sin ofertas", route: "articulos/casa-meses-en-venta-sin-ofertas/" },
        { label: "Documentación", route: "articulos/documentacion-vender-casa-costa-brava/" },
        { label: "Plazos de venta", route: "articulos/cuanto-tarda-vender-casa-lujo-costa-brava/" },
        { label: "Inmobiliaria o particular", route: "articulos/vender-con-inmobiliaria-o-particular/" },
        { label: "Preparar vivienda", route: "articulos/preparar-villa-antes-vender-costa-brava/" }
      ]
    },
    en: {
      title: "Seller FAQ",
      items: [
        { label: "Sell without losing value", route: "articulos/vender-casa-lujo-costa-brava/" },
        { label: "Price too high", route: "articulos/casa-sobrevalorada-antes-vender/" },
        { label: "Months without offers", route: "articulos/casa-meses-en-venta-sin-ofertas/" },
        { label: "Documents", route: "articulos/documentacion-vender-casa-costa-brava/" },
        { label: "Sale timing", route: "articulos/cuanto-tarda-vender-casa-lujo-costa-brava/" },
        { label: "Agency or private", route: "articulos/vender-con-inmobiliaria-o-particular/" },
        { label: "Prepare home", route: "articulos/preparar-villa-antes-vender-costa-brava/" }
      ]
    },
    fr: {
      title: "Questions",
      items: [
        { label: "Vendre sans brader", route: "articulos/vender-casa-lujo-costa-brava/" },
        { label: "Prix trop élevé", route: "articulos/casa-sobrevalorada-antes-vender/" },
        { label: "Mois sans offres", route: "articulos/casa-meses-en-venta-sin-ofertas/" },
        { label: "Documents", route: "articulos/documentacion-vender-casa-costa-brava/" },
        { label: "Délais de vente", route: "articulos/cuanto-tarda-vender-casa-lujo-costa-brava/" },
        { label: "Agence ou seul", route: "articulos/vender-con-inmobiliaria-o-particular/" },
        { label: "Préparer le bien", route: "articulos/preparar-villa-antes-vender-costa-brava/" }
      ]
    },
    de: {
      title: "Fragen",
      items: [
        { label: "Ohne Wertverlust verkaufen", route: "articulos/vender-casa-lujo-costa-brava/" },
        { label: "Zu hoher Preis", route: "articulos/casa-sobrevalorada-antes-vender/" },
        { label: "Monate ohne Angebote", route: "articulos/casa-meses-en-venta-sin-ofertas/" },
        { label: "Unterlagen", route: "articulos/documentacion-vender-casa-costa-brava/" },
        { label: "Verkaufsdauer", route: "articulos/cuanto-tarda-vender-casa-lujo-costa-brava/" },
        { label: "Makler oder privat", route: "articulos/vender-con-inmobiliaria-o-particular/" },
        { label: "Immobilie vorbereiten", route: "articulos/preparar-villa-antes-vender-costa-brava/" }
      ]
    },
    ru: {
      title: "Вопросы",
      items: [
        { label: "Продать без потери цены", route: "articulos/vender-casa-lujo-costa-brava/" },
        { label: "Завышенная цена", route: "articulos/casa-sobrevalorada-antes-vender/" },
        { label: "Месяцы без оферт", route: "articulos/casa-meses-en-venta-sin-ofertas/" },
        { label: "Документы", route: "articulos/documentacion-vender-casa-costa-brava/" },
        { label: "Срок продажи", route: "articulos/cuanto-tarda-vender-casa-lujo-costa-brava/" },
        { label: "Агентство или самому", route: "articulos/vender-con-inmobiliaria-o-particular/" },
        { label: "Подготовить объект", route: "articulos/preparar-villa-antes-vender-costa-brava/" }
      ]
    }
  };

  const serviceClassById = {
    "personal-shopper": "service-card-home--personal-shopper",
    "tasacion-estrategica": "service-card-home--tasacion",
    "venta-internacional": "service-card-home--venta-internacional"
  };

  const serviceHeroImages = {
    "personal-shopper": "assets/servicio-personal-shopper.png",
    "tasacion-estrategica": "assets/servicio-tasacion-estrategica.png",
    "venta-internacional": "assets/venta-internacional-hero.png"
  };

  const articleHeroImages = {
    "comprar-casa-costa-brava": "assets/articulo-compra-costa-brava-hero.png",
    "vender-inmueble-clientes-internacionales": "assets/articulo-venta-internacional-hero.png",
    "tasacion-vivienda-costa-brava": "assets/articulo-tasacion-costa-brava-hero.png",
    "vender-casa-lujo-costa-brava": "assets/articulo-vender-casa-lujo-hero.png",
    "casa-sobrevalorada-antes-vender": "assets/articulo-casa-sobrevalorada-hero-v2.png",
    "casa-meses-en-venta-sin-ofertas": "assets/articulo-casa-meses-venta-hero-v2.png",
    "documentacion-vender-casa-costa-brava": "assets/articulo-documentacion-vender-casa-hero.png",
    "cuanto-tarda-vender-casa-lujo-costa-brava": "assets/articulo-tiempo-vender-casa-lujo-hero.png",
    "vender-con-inmobiliaria-o-particular": "assets/articulo-inmobiliaria-o-particular-hero.png",
    "preparar-villa-antes-vender-costa-brava": "assets/articulo-preparar-villa-hero.png"
  };

  const serviceSectionImages = {
    "personal-shopper": [
      {
        src: "assets/personal-shopper-busqueda-criterio.png",
        alt: "Selección de propiedades en Costa Brava con mapa y criterios de búsqueda"
      },
      {
        src: "assets/personal-shopper-para-quien.png",
        alt: "Comparativa de zonas y propiedades para compradores internacionales e inversores"
      },
      {
        src: "assets/personal-shopper-como-trabajamos.png",
        alt: "Dossier de inmuebles preseleccionados, agenda de visitas y análisis de compra"
      }
    ],
    "tasacion-estrategica": [
      {
        src: "assets/tasacion-mas-que-precio.png",
        alt: "Dossier de valoración inmobiliaria con fotos, planos y datos de mercado"
      },
      {
        src: "assets/tasacion-que-analizamos.png",
        alt: "Análisis de precio, planos y factores clave para valorar una vivienda"
      },
      {
        src: "assets/tasacion-para-propietarios.png",
        alt: "Estrategia de valoración para propietarios con fotos y datos de mercado"
      }
    ],
    "venta-internacional": [
      {
        src: "assets/venta-internacional-presentacion.png",
        alt: "Dossier premium y presentación visual para comprador internacional"
      },
      {
        src: "assets/venta-internacional-multilingue.png",
        alt: "Asesoría inmobiliaria multilingüe para clientes internacionales"
      },
      {
        src: "assets/venta-internacional-canales.png",
        alt: "Estrategia digital y análisis de canales inmobiliarios internacionales"
      }
    ]
  };

  const articleSectionImages = {
    "comprar-casa-costa-brava": [
      {
        src: "assets/articulo-compra-zona-costa-brava.png",
        alt: "Mapa de la Costa Brava con zonas, privacidad y acceso al mar"
      },
      {
        src: "assets/articulo-compra-revisar-antes-visitar.png",
        alt: "Checklist y dossier para filtrar inmuebles antes de visitar"
      },
      {
        src: "assets/articulo-compra-encaje-uso.png",
        alt: "Comparativa visual de inmuebles según uso, costes y potencial"
      }
    ],
    "vender-inmueble-clientes-internacionales": [
      {
        src: "assets/articulo-claridad-comprador-internacional.png",
        alt: "Ficha inmobiliaria clara con planos, fotos y documentación"
      },
      {
        src: "assets/articulo-idiomas-confianza.png",
        alt: "Comunicación multilingüe y confianza con compradores internacionales"
      },
      {
        src: "assets/articulo-medicion-contactos.png",
        alt: "Medición de contactos y canales de marketing inmobiliario"
      }
    ],
    "tasacion-vivienda-costa-brava": [
      {
        src: "assets/articulo-tasacion-precio-no-aislado.png",
        alt: "Valoración de vivienda premium con datos de mercado y Costa Brava al fondo"
      },
      {
        src: "assets/articulo-tasacion-valoracion-estrategica.png",
        alt: "Presentación de estrategia de venta con análisis, precio y negociación"
      },
      {
        src: "assets/articulo-tasacion-datos-preparar.png",
        alt: "Documentación, planos, llaves y fotografías para preparar una tasación"
      }
    ],
    "vender-casa-lujo-costa-brava": [
      {
        src: "assets/articulo-vender-casa-lujo-precio.png",
        alt: "Análisis de precio y posicionamiento para vender una vivienda de lujo"
      },
      {
        src: "assets/articulo-vender-casa-lujo-estrategia.png",
        alt: "Estrategia comercial y valoración para evitar quemar una propiedad premium"
      },
      {
        src: "assets/articulo-vender-casa-lujo-presentacion.png",
        alt: "Dossier premium para presentar una villa o masía antes de vender"
      },
      {
        src: "assets/articulo-vender-casa-lujo-inmobiliaria.png",
        alt: "Estrategia inmobiliaria para compradores cualificados en Costa Brava"
      }
    ],
    "casa-sobrevalorada-antes-vender": [
      {
        src: "assets/articulo-casa-sobrevalorada-senales-v2.png",
        alt: "Señales de sobrevaloración en el precio de una vivienda premium"
      },
      {
        src: "assets/articulo-casa-sobrevalorada-estrategia-v2.png",
        alt: "Valoración estratégica para ajustar el precio antes de publicar"
      },
      {
        src: "assets/articulo-casa-sobrevalorada-presentacion-v2.png",
        alt: "Presentación premium para defender el valor real de una propiedad"
      }
    ],
    "casa-meses-en-venta-sin-ofertas": [
      {
        src: "assets/articulo-casa-meses-venta-diagnostico-v2.png",
        alt: "Diagnostico comercial de una vivienda premium que lleva meses en venta"
      },
      {
        src: "assets/articulo-casa-meses-venta-precio-v2.png",
        alt: "Revision de precio, demanda y posicionamiento antes de relanzar una propiedad"
      },
      {
        src: "assets/articulo-casa-meses-venta-relanzar-v2.png",
        alt: "Relanzamiento profesional de una propiedad premium hacia compradores cualificados"
      }
    ],
    "documentacion-vender-casa-costa-brava": [
      {
        src: "assets/articulo-documentacion-tambien-vende.png",
        alt: "Dossier inmobiliario con fotos, planos y checklist para vender con confianza"
      },
      {
        src: "assets/articulo-documentacion-preparar.png",
        alt: "Documentos, certificado energetico, planos y llaves preparados para vender una casa"
      },
      {
        src: "assets/articulo-documentacion-vender-mejor.png",
        alt: "Dossier LacostaHaus, tablet con galeria y llaves para una venta inmobiliaria ordenada"
      }
    ],
    "cuanto-tarda-vender-casa-lujo-costa-brava": [
      {
        src: "assets/articulo-tiempo-no-solo-mercado.png",
        alt: "Reloj, calendario y datos de mercado para analizar el tiempo de venta de una casa de lujo"
      },
      {
        src: "assets/articulo-tiempo-factores.png",
        alt: "Factores de precio, ubicacion, presentacion y demanda que aceleran o frenan una venta premium"
      },
      {
        src: "assets/articulo-tiempo-revisar-estrategia.png",
        alt: "Revision de estrategia inmobiliaria con calendario, analitica y dossier LacostaHaus"
      }
    ],
    "vender-con-inmobiliaria-o-particular": [
      {
        src: "assets/articulo-inmobiliaria-comision.png",
        alt: "Analisis de comision, valor y estrategia para vender una vivienda premium"
      },
      {
        src: "assets/articulo-inmobiliaria-especializada.png",
        alt: "Dossier boutique, mapa internacional y seguimiento de compradores cualificados"
      },
      {
        src: "assets/articulo-inmobiliaria-vender-solo-caro.png",
        alt: "Comparativa entre gestion desordenada y venta inmobiliaria profesional"
      }
    ],
    "preparar-villa-antes-vender-costa-brava": [
      {
        src: "assets/articulo-preparar-no-reformar-todo.png",
        alt: "Preparacion selectiva de una villa premium sin necesidad de reformarlo todo"
      },
      {
        src: "assets/articulo-preparar-sesion-fotos.png",
        alt: "Villa mediterranea preparada para una sesion de fotografia inmobiliaria"
      },
      {
        src: "assets/articulo-preparar-comercial-documental.png",
        alt: "Dossier comercial, fotos y analisis para preparar la venta de una villa"
      }
    ]
  };

  const serviceFallbackCopy = {
    es: {
      kicker: "Servicio boutique",
      section_title: "Servicio inmobiliario con criterio",
      aside_title: "Incluye",
      cta: "Solicitar información",
      benefits: ["Análisis personalizado.", "Selección de oportunidades.", "Acompañamiento cercano.", "Comunicación clara.", "Seguimiento del proceso."],
      sections: [
        { title: "Enfoque personalizado", paragraphs: ["Adaptamos el servicio al objetivo real del cliente, al tipo de inmueble y a la zona de interés en Costa Brava."] },
        { title: "Decisiones mejor filtradas", paragraphs: ["Trabajamos con criterios claros para reducir ruido, priorizar oportunidades útiles y facilitar una decisión más segura."] }
      ]
    },
    en: {
      kicker: "Boutique service",
      section_title: "Real estate guidance with clear criteria",
      aside_title: "Includes",
      cta: "Request information",
      benefits: ["Personal analysis.", "Opportunity filtering.", "Close guidance.", "Clear communication.", "Process follow-up."],
      sections: [
        { title: "Personal approach", paragraphs: ["We adapt the service to the client's real objective, property type and preferred area on the Costa Brava."] },
        { title: "Better filtered decisions", paragraphs: ["We use clear criteria to reduce noise, prioritise useful opportunities and support a more confident decision."] }
      ]
    },
    fr: {
      kicker: "Service boutique",
      section_title: "Accompagnement immobilier avec critères clairs",
      aside_title: "Inclus",
      cta: "Demander des informations",
      benefits: ["Analyse personnalisée.", "Filtrage des opportunités.", "Accompagnement proche.", "Communication claire.", "Suivi du processus."],
      sections: [
        { title: "Approche personnalisée", paragraphs: ["Nous adaptons le service à l'objectif réel du client, au type de bien et à la zone souhaitée sur la Costa Brava."] },
        { title: "Décisions mieux filtrées", paragraphs: ["Nous travaillons avec des critères clairs pour réduire le bruit, prioriser les opportunités utiles et faciliter une décision plus sûre."] }
      ]
    },
    de: {
      kicker: "Boutique-Service",
      section_title: "Immobilienberatung mit klaren Kriterien",
      aside_title: "Enthält",
      cta: "Information anfragen",
      benefits: ["Persönliche Analyse.", "Filterung von Chancen.", "Enge Begleitung.", "Klare Kommunikation.", "Begleitung des Prozesses."],
      sections: [
        { title: "Persönlicher Ansatz", paragraphs: ["Wir passen den Service an das tatsächliche Ziel, den Immobilientyp und die gewünschte Lage an der Costa Brava an."] },
        { title: "Besser gefilterte Entscheidungen", paragraphs: ["Wir arbeiten mit klaren Kriterien, reduzieren unnötige Optionen und priorisieren sinnvolle Möglichkeiten."] }
      ]
    },
    ru: {
      kicker: "Бутик-сервис",
      section_title: "Недвижимость с понятными критериями",
      aside_title: "Включает",
      cta: "Запросить информацию",
      benefits: ["Персональный анализ.", "Отбор возможностей.", "Близкое сопровождение.", "Понятная коммуникация.", "Контроль процесса."],
      sections: [
        { title: "Персональный подход", paragraphs: ["Мы адаптируем услугу под реальную цель клиента, тип объекта и желаемую зону на Коста-Брава."] },
        { title: "Лучше отфильтрованные решения", paragraphs: ["Мы используем понятные критерии, чтобы убрать лишний шум, выделить полезные возможности и облегчить решение."] }
      ]
    }
  };

  const articleShareLabels = {
    es: { title: "Compartir guía", whatsapp: "WhatsApp", telegram: "Telegram", copy: "Copiar enlace", copied: "Enlace copiado", ctaTitle: "¿Quieres vender con más criterio?", ctaText: "Podemos revisar tu caso, detectar bloqueos y preparar una salida al mercado más cuidada.", ctaButton: "Solicitar valoración" },
    en: { title: "Share guide", whatsapp: "WhatsApp", telegram: "Telegram", copy: "Copy link", copied: "Link copied", ctaTitle: "Want to sell with clearer criteria?", ctaText: "We can review your case, identify blockers and prepare a more careful market launch.", ctaButton: "Request valuation" },
    fr: { title: "Partager le guide", whatsapp: "WhatsApp", telegram: "Telegram", copy: "Copier le lien", copied: "Lien copié", ctaTitle: "Vous voulez vendre avec plus de méthode ?", ctaText: "Nous pouvons étudier votre cas, identifier les freins et préparer une mise sur le marché plus soignée.", ctaButton: "Demander une estimation" },
    de: { title: "Ratgeber teilen", whatsapp: "WhatsApp", telegram: "Telegram", copy: "Link kopieren", copied: "Link kopiert", ctaTitle: "Möchten Sie strukturierter verkaufen?", ctaText: "Wir können Ihren Fall prüfen, Hindernisse erkennen und einen sorgfältigeren Marktstart vorbereiten.", ctaButton: "Bewertung anfragen" },
    ru: { title: "Поделиться гидом", whatsapp: "WhatsApp", telegram: "Telegram", copy: "Скопировать ссылку", copied: "Ссылка скопирована", ctaTitle: "Хотите продавать более продуманно?", ctaText: "Мы можем разобрать ваш объект, найти слабые места и подготовить более сильный выход на рынок.", ctaButton: "Запросить оценку" }
  };

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };
  window.gtag("consent", "default", {
    ad_storage: "denied",
    analytics_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    functionality_storage: "granted",
    security_storage: "granted",
    wait_for_update: 500
  });

  function jsonUrl(name) {
    const url = new URL("data/" + name, baseUrl);
    url.searchParams.set("v", DATA_VERSION);
    return url.href;
  }

  async function loadJson(name) {
    const response = await fetch(jsonUrl(name), { cache: "no-store" });
    if (!response.ok) throw new Error("No se pudo cargar " + name);
    return response.json();
  }

  async function loadJsonPath(path) {
    const url = new URL(path, baseUrl);
    url.searchParams.set("v", DATA_VERSION);
    const response = await fetch(url.href, { cache: "no-store" });
    if (!response.ok) throw new Error("No se pudo cargar " + path);
    return response.json();
  }

  async function loadOptionalJson(name) {
    try {
      return await loadJson(name);
    } catch (error) {
      return null;
    }
  }

  function backendIsReady(config) {
    return Boolean(config?.enabled && config.supabaseUrl && config.anonKey);
  }

  function normalizeSupabaseUrl(url) {
    return String(url || "").replace(/\/+$/, "");
  }

  function backendHeaders(config) {
    return {
      apikey: config.anonKey,
      Authorization: "Bearer " + config.anonKey,
      Accept: "application/json"
    };
  }

  function onlinePropertyRoute(row) {
    return row.route || `inmuebles/ficha/?id=${encodeURIComponent(row.id)}`;
  }

  function onlinePropertyToRegistry(row) {
    return {
      id: row.id,
      route: onlinePropertyRoute(row),
      image: row.image_url || row.image || "",
      types: row.types || [],
      translations: row.card_translations || {},
      propertyData: row.property_data || null,
      isOnlineProperty: true,
      showHome: row.show_home !== false,
      homeHero: row.home_hero === true,
      sortOrder: row.sort_order || 0
    };
  }

  function mergeOnlineProperties(localData, onlineItems, sourceMode) {
    const onlineProperties = (onlineItems || []).map(onlinePropertyToRegistry);
    if (!onlineProperties.length) return localData;

    if (sourceMode === "online") {
      return {
        ...localData,
        homeHeroProperty: onlineProperties.find((property) => property.homeHero)?.id || onlineProperties[0].id,
        homeFeatured: onlineProperties.filter((property) => property.showHome).map((property) => property.id),
        catalog: onlineProperties.map((property) => property.id),
        properties: onlineProperties
      };
    }

    const byId = new Map((localData.properties || []).map((property) => [property.id, property]));
    onlineProperties.forEach((property) => byId.set(property.id, property));
    const onlineIds = onlineProperties.map((property) => property.id);
    const catalog = [...onlineIds, ...(localData.catalog || []).filter((id) => !onlineIds.includes(id))];
    const homeFeatured = [
      ...onlineProperties.filter((property) => property.showHome).map((property) => property.id),
      ...(localData.homeFeatured || []).filter((id) => !onlineIds.includes(id))
    ];

    return {
      ...localData,
      homeHeroProperty: onlineProperties.find((property) => property.homeHero)?.id || localData.homeHeroProperty,
      homeFeatured,
      catalog,
      properties: Array.from(byId.values())
    };
  }

  async function loadBackendProperties(localData) {
    const config = await loadOptionalJson("backend-config.json");
    if (!backendIsReady(config)) return localData;

    const url = new URL("/rest/v1/properties", normalizeSupabaseUrl(config.supabaseUrl));
    url.searchParams.set("select", "*");
    url.searchParams.set("status", "eq.published");
    url.searchParams.set("order", "sort_order.asc.nullslast,created_at.desc");

    try {
      const response = await fetch(url.href, {
        headers: backendHeaders(config),
        cache: "no-store"
      });
      if (!response.ok) throw new Error("Supabase properties " + response.status);
      const rows = await response.json();
      return mergeOnlineProperties(localData, rows, config.sourceMode || "merge");
    } catch (error) {
      console.warn("No se pudieron cargar inmuebles online. Se usa JSON local.", error);
      return localData;
    }
  }

  function getByPath(source, path) {
    return path.split(".").reduce((value, part) => {
      if (value && Object.prototype.hasOwnProperty.call(value, part)) return value[part];
      return undefined;
    }, source);
  }

  function pickTranslation(translations, lang) {
    return translations[lang] || translations.es || Object.values(translations)[0] || {};
  }

  function detectLanguage() {
    const params = new URLSearchParams(window.location.search);
    const queryLang = params.get("lang");
    const supported = new Set(site.languages.map((lang) => lang.code));
    if (queryLang && supported.has(queryLang)) return queryLang;

    const saved = localStorage.getItem(LANG_KEY);
    if (saved && supported.has(saved)) return saved;

    const browserLang = (navigator.language || "").slice(0, 2).toLowerCase();
    if (supported.has(browserLang)) return browserLang;

    return site.defaultLanguage || "es";
  }

  function urlForPath(route, lang = currentLanguage) {
    const target = new URL(route, baseUrl);
    target.searchParams.set("lang", lang);
    return target.href;
  }

  function absoluteRoute(routeName, lang = currentLanguage) {
    return urlForPath(site.routes[routeName] || site.routes.home, lang);
  }

  function mapOpenUrl(embedUrl) {
    if (!embedUrl) return "";
    try {
      const target = new URL(embedUrl);
      target.searchParams.delete("output");
      return target.href;
    } catch (error) {
      return embedUrl;
    }
  }

  function propertyById(id) {
    if (!propertiesData || !Array.isArray(propertiesData.properties)) return null;
    return propertiesData.properties.find((property) => property.id === id) || null;
  }

  function propertyTranslation(property) {
    if (!property) return {};
    return pickTranslation(property.translations || {}, currentLanguage);
  }

  function propertyUrl(property, lang = currentLanguage) {
    return urlForPath((property && property.route) || site.routes.properties, lang);
  }

  function currentPropertyId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id") || document.body.dataset.propertyId || propertiesData?.homeHeroProperty || "";
  }

  function routeForCurrentPage() {
    if (page === "catalog") return "properties";
    if (page === "contact") return "contact";
    if (page === "cookies") return "cookies";
    if (page === "privacy") return "privacy";
    if (page === "agent") return "agent";
    return "home";
  }

  function currentPathRoute() {
    const basePath = new URL(".", baseUrl).pathname;
    return window.location.pathname.replace(basePath, "").replace(/^\/+/, "") || site.routes.home;
  }

  function currentPageUrl(lang = currentLanguage) {
    if (page === "property") {
      const property = propertyById(currentPropertyId());
      return propertyUrl(property, lang);
    }
    if (page === "service" || page === "article" || page === "articles") {
      return urlForPath(currentPathRoute(), lang);
    }
    if (page === "contact") {
      const target = new URL(absoluteRoute("contact", lang));
      const selectedProperty = new URLSearchParams(window.location.search).get("property");
      if (selectedProperty) target.searchParams.set("property", selectedProperty);
      return target.href;
    }
    return absoluteRoute(routeForCurrentPage(), lang);
  }

  function productionUrlForPath(route, lang = currentLanguage) {
    const origin = (site.siteUrl || window.location.origin).replace(/\/+$/, "");
    const cleanRoute = (route || site.routes.home).replace(/^\/+/, "").replace(/index\.html$/, "");
    const target = new URL(cleanRoute, origin + "/");
    if (lang !== site.defaultLanguage) target.searchParams.set("lang", lang);
    return target.href;
  }

  function productionAssetUrl(assetPath) {
    const origin = (site.siteUrl || window.location.origin).replace(/\/+$/, "");
    return new URL((assetPath || "").replace(/^\/+/, ""), origin + "/").href;
  }

  function ensureMeta(selector, create, update) {
    let element = document.querySelector(selector);
    if (!element) {
      element = create();
      document.head.appendChild(element);
    }
    update(element);
  }

  function ensureLink(rel, hreflang, href) {
    const selector = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]`;
    ensureMeta(selector, () => {
      const link = document.createElement("link");
      link.rel = rel;
      if (hreflang) link.hreflang = hreflang;
      return link;
    }, (link) => {
      link.href = href;
    });
  }

  function setSeo(title, description, imagePath = "assets/hero-principal.png") {
    if (title) document.title = title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta && description) meta.setAttribute("content", description);

    const route = page === "property"
      ? ((propertyById(currentPropertyId()) || {}).route || site.routes.properties)
      : (page === "service" || page === "article" || page === "articles" ? currentPathRoute() : site.routes[routeForCurrentPage()]);
    const canonical = productionUrlForPath(route, currentLanguage);
    ensureLink("canonical", null, canonical);
    (site.languages || []).forEach((language) => {
      ensureLink("alternate", language.htmlLang || language.code, productionUrlForPath(route, language.code));
    });
    ensureLink("alternate", "x-default", productionUrlForPath(route, site.defaultLanguage || "es"));
    ensureMeta('meta[property="og:title"]', () => {
      const tag = document.createElement("meta");
      tag.setAttribute("property", "og:title");
      return tag;
    }, (tag) => tag.setAttribute("content", title || document.title));
    ensureMeta('meta[property="og:description"]', () => {
      const tag = document.createElement("meta");
      tag.setAttribute("property", "og:description");
      return tag;
    }, (tag) => tag.setAttribute("content", description || ""));
    ensureMeta('meta[property="og:url"]', () => {
      const tag = document.createElement("meta");
      tag.setAttribute("property", "og:url");
      return tag;
    }, (tag) => tag.setAttribute("content", canonical));
    ensureMeta('meta[property="og:type"]', () => {
      const tag = document.createElement("meta");
      tag.setAttribute("property", "og:type");
      return tag;
    }, (tag) => tag.setAttribute("content", page === "article" ? "article" : "website"));
    ensureMeta('meta[name="twitter:card"]', () => {
      const tag = document.createElement("meta");
      tag.name = "twitter:card";
      return tag;
    }, (tag) => tag.setAttribute("content", "summary_large_image"));
    ensureMeta('meta[property="og:image"]', () => {
      const tag = document.createElement("meta");
      tag.setAttribute("property", "og:image");
      return tag;
    }, (tag) => tag.setAttribute("content", productionAssetUrl(imagePath)));
    ensureMeta('meta[name="twitter:image"]', () => {
      const tag = document.createElement("meta");
      tag.name = "twitter:image";
      return tag;
    }, (tag) => tag.setAttribute("content", productionAssetUrl(imagePath)));
  }

  function setJsonLd(id, data) {
    let script = document.getElementById(id);
    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = id;
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
  }

  function setGlobalStructuredData() {
    const siteUrl = (site.siteUrl || window.location.origin).replace(/\/+$/, "") + "/";
    const logoUrl = productionAssetUrl(site.searchLogo || site.logo || "assets/google-logo-144x144.png");
    const phone = site.contact?.phone || "+34 722 279 795";
    const email = site.contact?.email || "lacostahaus@gmail.com";

    setJsonLd("lacostaOrganizationStructuredData", {
      "@context": "https://schema.org",
      "@type": "RealEstateAgent",
      name: site.brand || "LacostaHaus",
      url: siteUrl,
      logo: logoUrl,
      image: logoUrl,
      telephone: phone,
      email,
      areaServed: ["Costa Brava", "Platja d'Aro", "S'Agaró", "Begur", "Sant Feliu de Guíxols", "Baix Empordà"],
      availableLanguage: ["es", "ca", "ro", "fr", "de", "ru"],
      address: {
        "@type": "PostalAddress",
        addressRegion: "Girona",
        addressCountry: "ES"
      }
    });

    setJsonLd("lacostaWebsiteStructuredData", {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: site.brand || "LacostaHaus",
      url: siteUrl,
      inLanguage: (site.languages || []).map((language) => language.htmlLang || language.code)
    });
  }

  function updateLanguageState() {
    const languageInfo = site.languages.find((lang) => lang.code === currentLanguage) || site.languages[0];
    document.documentElement.lang = languageInfo.htmlLang || currentLanguage;
    localStorage.setItem(LANG_KEY, currentLanguage);
  }

  function updateRoutes() {
    document.querySelectorAll("[data-route]").forEach((element) => {
      element.setAttribute("href", absoluteRoute(element.dataset.route));
    });
  }

  function renderDoubtsMenu() {
    const navList = document.querySelector(".site-nav > ul");
    if (!navList) return;
    navList.querySelector("[data-doubts-menu-item]")?.remove();

    const labels = doubtsNavLabels[currentLanguage] || doubtsNavLabels.es;
    const contactItem = navList.querySelector('[data-route="contact"]')?.closest("li");
    const item = document.createElement("li");
    item.className = "dropdown doubts-dropdown";
    item.dataset.doubtsMenuItem = "";
    item.innerHTML = `
      <a href="${urlForPath("articulos/")}">${labels.title}</a>
      <ul class="dropdown-menu doubts-menu">
        ${labels.items.map((entry) => `<li><a href="${urlForPath(entry.route)}">${entry.label}</a></li>`).join("")}
      </ul>
    `;

    if (contactItem) navList.insertBefore(item, contactItem);
    else navList.appendChild(item);
  }

  function renderLanguageMenu() {
    document.querySelectorAll("[data-language-menu]").forEach((menu) => {
      menu.innerHTML = "";
      site.languages.forEach((language) => {
        const item = document.createElement("li");
        const button = document.createElement("button");
        button.type = "button";
        button.className = "language-option";
        button.textContent = language.label;
        button.dataset.lang = language.code;
        if (language.code === currentLanguage) button.classList.add("is-active");
        button.addEventListener("click", () => {
          sessionStorage.setItem(SCROLL_RESTORE_KEY, String(window.scrollY));
          window.location.href = currentPageUrl(language.code);
        });
        item.appendChild(button);
        menu.appendChild(item);
      });
    });
  }

  function applyStaticTranslations() {
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const value = getByPath(currentText, element.dataset.i18n);
      if (value !== undefined) element.textContent = value;
    });
  }

  function resolveAsset(path) {
    if (!path) return "";
    if (/^(https?:|mailto:|tel:|#)/i.test(path)) return path;

    if (path.startsWith("/images/Inmueble/")) {
      return new URL("assets/inmueble-masia/" + path.split("/").pop(), baseUrl).href;
    }

    if (path.startsWith("/images/")) {
      return new URL("assets/" + path.split("/").pop(), baseUrl).href;
    }

    return new URL(path.replace(/^\//, ""), baseUrl).href;
  }

  function escapeAttribute(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function isVideoSource(src) {
    return /\.mp4(\?|#|$)/i.test(src || "");
  }

  function localImageVariant(src, variant) {
    if (!src || /^(data:|blob:)/i.test(src)) return "";
    try {
      const url = new URL(src, window.location.href);
      if (url.origin !== window.location.origin) return "";
      if (!/\/assets\//.test(url.pathname)) return "";
      if (!/\.(jpe?g|png)$/i.test(url.pathname)) return "";
      const suffix = variant === "thumb" ? "-thumb.jpg" : "-medium.jpg";
      url.pathname = url.pathname.replace(/\.(jpe?g|png)$/i, suffix);
      return url.href;
    } catch (error) {
      return "";
    }
  }

  function imageSrcset(src, includeFull = false) {
    if (!src) return "";
    const thumb = localImageVariant(src, "thumb");
    const medium = localImageVariant(src, "medium");
    const sources = [thumb && `${thumb} 360w`, medium && `${medium} 1280w`].filter(Boolean);
    if (includeFull || !sources.length) sources.push(`${src} 1800w`);
    return sources.join(", ");
  }

  function responsiveImageMarkup(src, alt, sizes, className = "") {
    const full = resolveAsset(src);
    if (!full) return "";
    const preferred = localImageVariant(full, "medium") || full;
    const classAttr = className ? ` class="${escapeAttribute(className)}"` : "";
    return `<img src="${escapeAttribute(preferred)}" srcset="${escapeAttribute(imageSrcset(full))}" sizes="${escapeAttribute(sizes || "100vw")}" alt="${escapeAttribute(alt || "")}"${classAttr} loading="lazy" decoding="async">`;
  }

  function fullImageMarkup(src, alt, className = "") {
    const full = resolveAsset(src);
    if (!full) return "";
    const classAttr = className ? ` class="${escapeAttribute(className)}"` : "";
    return `<img src="${escapeAttribute(full)}" alt="${escapeAttribute(alt || "")}"${classAttr} loading="lazy" decoding="async">`;
  }

  function renderFooter() {
    const footer = document.querySelector("[data-site-footer]");
    if (!footer) return;

    const contact = site.contact;
    const footerLabels = footerUtilityLabels[currentLanguage] || footerUtilityLabels.es;
    const socialLinks = [
      {
        label: "Facebook",
        href: "https://www.facebook.com/",
        svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#6f8cff" d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.92 3.77-3.92 1.09 0 2.23.2 2.23.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.44 2.91h-2.34V22C18.34 21.24 22 17.08 22 12.06Z"/></svg>'
      },
      {
        label: "Instagram",
        href: "https://www.instagram.com/",
        svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="ig" x1="4" y1="20" x2="20" y2="4"><stop stop-color="#feda75"/><stop offset=".35" stop-color="#d62976"/><stop offset=".7" stop-color="#962fbf"/><stop offset="1" stop-color="#4f5bd5"/></linearGradient></defs><path fill="url(#ig)" d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9Zm4.5 3.35A4.65 4.65 0 1 1 12 16.65a4.65 4.65 0 0 1 0-9.3Zm0 2A2.65 2.65 0 1 0 12 14.65a2.65 2.65 0 0 0 0-5.3Zm5.15-2.52a1.05 1.05 0 1 1-1.05 1.05 1.05 1.05 0 0 1 1.05-1.05Z"/></svg>'
      },
      {
        label: "X",
        href: "https://x.com/",
        svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#f4f7fb" d="M13.74 10.62 21.02 2h-1.73l-6.32 7.48L7.92 2H2.1l7.64 11.32L2.1 22h1.73l6.68-7.56L15.84 22h5.82l-7.92-11.38Zm-2.36 2.67-.78-1.13L4.45 3.32h2.64l4.97 7.14.77 1.13 6.45 9.18h-2.64l-5.26-7.48Z"/></svg>'
      },
      {
        label: "Telegram",
        href: "https://t.me/",
        svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#2aabee" d="M21.93 4.18 18.6 19.86c-.25 1.11-.9 1.38-1.82.86l-5.03-3.71-2.43 2.34c-.27.27-.5.5-1.02.5l.36-5.12 9.32-8.42c.4-.36-.09-.56-.63-.2L5.83 13.36.87 11.81c-1.08-.34-1.1-1.08.23-1.6L20.5 2.72c.9-.34 1.69.2 1.43 1.46Z"/></svg>'
      }
    ];
    footer.innerHTML = `
      <div class="container-custom footer-home-v2__grid">
        <div class="footer-brand-home">
          <img src="${resolveAsset(site.logo)}" alt="LacostaHaus logo" class="footer-home-v2__logo">
          <p>${currentText.footer.text}</p>
          <a href="mailto:${contact.email}">${contact.email}</a>
          <a href="tel:${contact.phone.replace(/\s/g, "")}">${contact.phone}</a>
        </div>
        <div>
          <h3>${currentText.footer.quickTitle}</h3>
          <ul>
            <li><a href="${absoluteRoute("home")}">${currentText.nav.home}</a></li>
            <li><a href="${absoluteRoute("properties")}">${currentText.nav.properties}</a></li>
            <li><a href="${absoluteRoute("contact")}">${currentText.nav.contact}</a></li>
            <li><a href="${absoluteRoute("contact")}">${currentText.nav.valuation}</a></li>
          </ul>
        </div>
        <div>
          <h3>${currentText.footer.usefulTitle}</h3>
          <ul>
            <li><a href="${absoluteRoute("home")}#servicios">${currentText.footer.services}</a></li>
            <li><a href="${absoluteRoute("home")}#destacados">${currentText.footer.featured}</a></li>
            <li><a href="${absoluteRoute("home")}#proceso">${currentText.footer.process}</a></li>
            <li><a href="${urlForPath("articulos/")}">${footerLabels.articles}</a></li>
            <li><a href="${urlForPath("articulos/")}">${footerLabels.doubts}</a></li>
            <li><a href="${absoluteRoute("agent")}">${currentText.footer.about}</a></li>
          </ul>
        </div>
        <div>
          <h3>${currentText.footer.legalTitle}</h3>
          <ul>
            <li><a href="${absoluteRoute("privacy")}">${currentText.footer.privacy}</a></li>
            <li><a href="${absoluteRoute("cookies")}">${currentText.footer.cookies}</a></li>
          </ul>
        </div>
        <div>
          <h3>${currentText.footer.socialTitle}</h3>
          <div class="footer-social-home">
            ${socialLinks.map((item) => `<a href="${item.href}" aria-label="${item.label}" title="${item.label}">${item.svg}</a>`).join("")}
          </div>
          <a class="footer-agent-qr" href="${absoluteRoute("agent")}" aria-label="Agente inmobiliario Sergiu Crudu">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&margin=10&data=${encodeURIComponent("https://lacostahaus.com/agente-inmobiliario/")}" alt="QR agente inmobiliario Sergiu Crudu">
            <span>Sergiu Crudu</span>
          </a>
        </div>
      </div>
    `;
  }

  function renderStats() {
    const container = document.querySelector("[data-home-stats]");
    if (!container) return;
    container.innerHTML = currentText.stats.map((stat) => `
      <div class="stat-card-home">
        <strong>${stat.value}</strong>
        <span>${stat.label}</span>
      </div>
    `).join("");
  }

  function renderServices() {
    const container = document.querySelector("[data-home-services]");
    if (!container) return;
    const serviceRoutes = {
      "service-card-home--personal-shopper": "servicios/personal-shopper/",
      "service-card-home--tasacion": "servicios/tasacion-estrategica/",
      "service-card-home--venta-internacional": "servicios/venta-internacional/"
    };
    container.innerHTML = currentText.services.items.map((item) => `
      <a class="service-card-home ${item.className}" href="${urlForPath(serviceRoutes[item.className] || "contacto/")}">
        <h3>${item.title}</h3>
        <p>${item.text}</p>
        <span class="service-card-home__cta">${currentText.services.cta || "Ver servicio"}</span>
      </a>
    `).join("");
  }

  function euroAmountFromText(text) {
    const raw = String(text || "").replace(/[^\d.,]/g, "");
    if (!raw) return 0;

    const lastDot = raw.lastIndexOf(".");
    const lastComma = raw.lastIndexOf(",");
    const lastSeparator = Math.max(lastDot, lastComma);
    const decimalLike = lastSeparator >= 0 && raw.length - lastSeparator - 1 !== 3;

    const normalized = decimalLike
      ? `${raw.slice(0, lastSeparator).replace(/[.,]/g, "")}.${raw.slice(lastSeparator + 1).replace(/[.,]/g, "")}`
      : raw.replace(/[.,]/g, "");
    const value = Number.parseFloat(normalized);
    return Number.isFinite(value) ? value : 0;
  }

  function formatCurrencyValue(value, currency) {
    try {
      return new Intl.NumberFormat(currentLanguage === "en" ? "en-US" : currentLanguage, {
        maximumFractionDigits: 0
      }).format(value) + " " + currency;
    } catch {
      return Math.round(value).toLocaleString("es-ES") + " " + currency;
    }
  }

  async function hydrateCurrencyMenu(priceElement, euroValue) {
    const menu = priceElement.querySelector("[data-currency-menu]");
    if (!menu || !euroValue) return;
    function paint(rates) {
      menu.innerHTML = `
        <span>${currencyLabels[currentLanguage] || currencyLabels.es}</span>
        ${Object.entries(rates).map(([currency, rate]) => `
          <strong>${currency} <em>${formatCurrencyValue(euroValue * rate, currency)}</em></strong>
        `).join("")}
      `;
    }
    paint(currencyFallbackRates);
    try {
      const response = await fetch("https://api.frankfurter.app/latest?from=EUR&to=USD,RUB,GBP,CHF", { cache: "no-store" });
      if (response.ok) {
        const data = await response.json();
        if (data && data.rates) paint({ ...currencyFallbackRates, ...data.rates });
      }
    } catch {}
  }

  function renderPropertyPrice(priceText) {
    const priceElement = document.querySelector("[data-property-price]");
    if (!priceElement) return;
    const euroValue = euroAmountFromText(priceText);
    priceElement.classList.add("property-price-pill");
    priceElement.innerHTML = `
      <span class="property-price-pill__value">${priceText}</span>
      <span class="property-currency-menu" data-currency-menu aria-hidden="true"></span>
    `;
    hydrateCurrencyMenu(priceElement, euroValue);
  }

  function initPropertyDetailsToggle() {
    const panel = document.querySelector(".property-details-panel");
    const list = document.querySelector("[data-property-details]");
    if (!panel || !list) return;
    const labels = propertyDetailsToggleLabels[currentLanguage] || propertyDetailsToggleLabels.es;
    list.classList.add("property-details-list");
    panel.classList.add("property-details-panel--collapsed");

    let toggle = panel.querySelector("[data-property-details-toggle]");
    if (!toggle) {
      toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "property-details-toggle";
      toggle.dataset.propertyDetailsToggle = "";
      list.insertAdjacentElement("afterend", toggle);
    }

    function sync() {
      const expanded = panel.classList.contains("is-expanded");
      toggle.textContent = expanded ? labels.less : labels.more;
      toggle.setAttribute("aria-expanded", String(expanded));
    }

    toggle.addEventListener("click", () => {
      panel.classList.toggle("is-expanded");
      sync();
    });
    sync();
  }

  function orderedProperties(ids) {
    return (ids || [])
      .map((id) => propertyById(id))
      .filter(Boolean);
  }

  function renderHeroPropertyCard() {
    const property = propertyById(propertiesData.homeHeroProperty);
    const text = propertyTranslation(property);
    if (!property || !text.title) return;

    const image = document.querySelector(".visual-card-main__image");
    const title = document.querySelector(".visual-card-main__overlay-text h3");
    const subtitle = document.querySelector(".visual-card-main__overlay-text p");
    const footerTitle = document.querySelector(".visual-card-main__footer h3");
    const footerText = document.querySelector(".visual-card-main__footer p");
    const link = document.querySelector(".visual-card-main__footer a");
    const imageLink = document.querySelector("[data-hero-property-link]");

    if (image) image.style.backgroundImage = `url("${resolveAsset(property.image)}")`;
    if (title) title.textContent = text.title;
    if (subtitle) subtitle.textContent = text.location || "";
    if (footerTitle) footerTitle.textContent = text.price || currentText.visual.footerTitle;
    if (footerText) footerText.textContent = text.excerpt || currentText.visual.footerText;
    if (imageLink) {
      imageLink.href = propertyUrl(property);
      imageLink.setAttribute("aria-label", text.title || "LacostaHaus Selection");
    }
    if (link) {
      link.href = absoluteRoute("properties");
      link.textContent = currentText.visual.link;
    }
  }

  function renderFeaturedCoverflow() {
    const track = document.querySelector("[data-featured-coverflow]");
    if (!track) return;
    const featuredProperties = orderedProperties(propertiesData.homeFeatured);
    track.innerHTML = featuredProperties.map((property) => {
      const text = propertyTranslation(property);
      return `
        <a href="${propertyUrl(property)}" class="coverflow-card">
          ${fullImageMarkup(property.image, text.title || "")}
          <div class="coverflow-info">
            <span>${text.tag || ""}</span>
            <h3>${text.title || ""}</h3>
            <p>${text.location || ""}</p>
            <strong>${text.price || ""}</strong>
          </div>
        </a>
      `;
    }).join("");

    if (featuredProperties.length === 1) {
      track.classList.add("is-single-card");
      const card = track.querySelector(".coverflow-card");
      if (card) {
        card.style.position = "relative";
        card.style.top = "0";
        card.style.left = "0";
        card.style.transform = "none";
        card.style.margin = "0 auto";
        card.style.opacity = "1";
        card.style.pointerEvents = "auto";
      }
    }
  }

  function renderProcess() {
    const container = document.querySelector("[data-home-process]");
    if (!container) return;
    container.innerHTML = currentText.process.items.map((item) => `
      <article class="process-step-home ${item.className}">
        <span>${item.number}</span>
        <h3>${item.title}</h3>
        <p>${item.text}</p>
      </article>
    `).join("");
  }

  function agentContactIcons() {
    return {
      phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.61 21 3 13.39 3 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.24.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2Z"/></svg>',
      whatsapp: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.52 3.48A11.84 11.84 0 0 0 12.08 0C5.52 0 .19 5.33.19 11.88c0 2.1.55 4.15 1.6 5.96L0 24l6.3-1.65a11.9 11.9 0 0 0 5.78 1.47h.01c6.55 0 11.88-5.33 11.88-11.88 0-3.18-1.24-6.16-3.45-8.46Zm-8.43 18.34h-.01a9.86 9.86 0 0 1-5.02-1.37l-.36-.21-3.74.98 1-3.65-.23-.37a9.83 9.83 0 0 1-1.51-5.32C2.22 6.45 6.65 2.02 12.09 2.02c2.63 0 5.1 1.03 6.96 2.89a9.78 9.78 0 0 1 2.9 6.97c0 5.44-4.43 9.94-9.86 9.94Zm5.4-7.39c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.04-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.91-2.2-.24-.58-.48-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.75-.71 2-1.4.25-.69.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z"/></svg>',
      telegram: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M21.93 4.18 18.6 19.86c-.25 1.11-.9 1.38-1.82.86l-5.03-3.71-2.43 2.34c-.27.27-.5.5-1.02.5l.36-5.12 9.32-8.42c.4-.36-.09-.56-.63-.2L5.83 13.36.87 11.81c-1.08-.34-1.1-1.08.23-1.6L20.5 2.72c.9-.34 1.69.2 1.43 1.46Z"/></svg>',
      mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z"/></svg>'
    };
  }

  function renderAgentLanguages(container, languages) {
    if (!container) return;
    container.innerHTML = (languages || []).map((language) => `
      <span class="agent-language-flag-card" title="${language.label}" aria-label="${language.label}">
        <span class="agent-language-flag agent-language-flag--${language.flag}" aria-hidden="true"></span>
      </span>
    `).join("");
  }

  function renderAgentContacts(container, agentText, contact) {
    if (!container) return;
    const icons = agentContactIcons();
    const items = [
      { icon: "phone", label: agentText.phone, href: contact.phone_href },
      { icon: "whatsapp", label: agentText.whatsapp, href: contact.whatsapp },
      { icon: "telegram", label: agentText.telegram, href: contact.telegram },
      { icon: "mail", label: agentText.email, href: contact.email }
    ];
    container.innerHTML = items.map((item) => `
      <a class="agent-contact-link agent-contact-link--${item.icon}" href="${item.href}" target="_blank" rel="noopener">
        ${icons[item.icon]}
        <span>${item.label}</span>
      </a>
    `).join("");
  }

  async function loadAgentData() {
    const agentData = await loadJson("agent.json");
    return {
      data: agentData,
      text: pickTranslation(agentData.translations, currentLanguage)
    };
  }

  async function renderHomeAgentSection() {
    const section = document.querySelector("[data-home-agent-section]");
    if (!section) return;
    const { data, text } = await loadAgentData();
    const contact = data.contact || {};

    section.querySelector("[data-home-agent-kicker]").textContent = text.kicker;
    section.querySelector("[data-home-agent-title]").textContent = text.title;
    section.querySelector("[data-home-agent-role]").textContent = text.role;
    section.querySelector("[data-home-agent-intro]").textContent = text.intro;
    section.querySelector("[data-home-agent-languages-title]").textContent = text.languages_title;
    section.querySelector("[data-home-agent-contact-title]").textContent = text.contact_title;
    section.querySelector("[data-home-agent-profile]").textContent = text.back;
    renderAgentLanguages(section.querySelector("[data-home-agent-languages]"), data.languages);
    renderAgentContacts(section.querySelector("[data-home-agent-contact-list]"), text, contact);
  }

  function renderCatalog() {
    const grid = document.querySelector("[data-catalog-grid]");
    if (!grid) return;
    setSeo(currentText.catalog.title + " | LacostaHaus", currentText.catalog.text);
    const properties = orderedProperties(propertiesData.catalog);
    if (!properties.length) {
      grid.innerHTML = '<p class="catalog-empty">No hay inmuebles publicados todavia.</p>';
      return;
    }
    grid.innerHTML = properties.map((property) => {
      const text = propertyTranslation(property);
      return `
        <a class="catalog-card" href="${propertyUrl(property)}">
          <div class="catalog-card__media">
            ${responsiveImageMarkup(property.image, text.title || "", "(max-width: 860px) 100vw, 33vw")}
          </div>
          <div class="catalog-card__body">
            <span>${text.tag || ""}</span>
            <h2>${text.title || ""}</h2>
            <p>${text.location || ""}</p>
            <p>${text.excerpt || ""}</p>
            <strong>${text.price || ""}</strong>
          </div>
        </a>
      `;
    }).join("");
  }

  function initCoverflow() {
    const track = document.querySelector(".coverflow-track");
    const cards = Array.from(document.querySelectorAll(".coverflow-card"));
    const prevBtn = document.getElementById("coverflowPrev");
    const nextBtn = document.getElementById("coverflowNext");
    if (!track || !cards.length || !prevBtn || !nextBtn) return;
    track.classList.toggle("is-single-card", cards.length === 1);

    const isMobileCoverflow = () => window.matchMedia("(max-width: 850px)").matches;
    const stateClasses = ["is-active", "is-prev", "is-next", "is-prev-2", "is-next-2", "is-single"];
    const clearCoverflowState = () => {
      cards.forEach((card) => {
        card.classList.remove(...stateClasses);
      });
    };

    if (cards.length === 1) {
      clearCoverflowState();
      cards[0].classList.add("is-active", "is-single");
      prevBtn.hidden = true;
      nextBtn.hidden = true;
      return;
    }

    if (isMobileCoverflow()) {
      clearCoverflowState();
      return;
    }

    let current = 0;
    function updateCoverflow() {
      if (isMobileCoverflow()) {
        clearCoverflowState();
        return;
      }
      clearCoverflowState();
      const total = cards.length;
      cards[current].classList.add("is-active");
      cards[(current - 1 + total) % total].classList.add("is-prev");
      cards[(current + 1) % total].classList.add("is-next");
      cards[(current - 2 + total) % total].classList.add("is-prev-2");
      cards[(current + 2) % total].classList.add("is-next-2");
    }

    prevBtn.addEventListener("click", () => {
      current = (current - 1 + cards.length) % cards.length;
      updateCoverflow();
    });
    nextBtn.addEventListener("click", () => {
      current = (current + 1) % cards.length;
      updateCoverflow();
    });
    cards.forEach((card, index) => {
      card.addEventListener("click", (event) => {
        if (isMobileCoverflow()) return;
        if (index !== current) {
          event.preventDefault();
          current = index;
          updateCoverflow();
        }
      });
    });
    updateCoverflow();
  }

  function setMainMedia(src, poster, altText) {
    const mainContainer = document.getElementById("mainContainer");
    if (!mainContainer) return;
    mainContainer.innerHTML = "";
    mainContainer.classList.remove("is-video-loading");
    mainContainer.classList.remove("is-image-openable");
    const isVideo = isVideoSource(src);

    if (isVideo) {
      const video = document.createElement("video");
      video.className = "media-content";
      video.controls = true;
      video.preload = "auto";
      video.playsInline = true;
      video.setAttribute("preload", "auto");
      video.setAttribute("playsinline", "");
      if (poster) video.poster = poster;
      const source = document.createElement("source");
      source.src = src;
      source.type = "video/mp4";
      video.appendChild(source);

      const loader = document.createElement("div");
      loader.className = "video-loading-indicator";
      loader.setAttribute("aria-hidden", "true");
      loader.innerHTML = `
        <span></span>
        <strong>${videoLoadingLabels[currentLanguage] || videoLoadingLabels.es}</strong>
      `;

      const showLoading = () => mainContainer.classList.add("is-video-loading");
      const hideLoading = () => mainContainer.classList.remove("is-video-loading");
      ["loadstart", "waiting", "seeking", "stalled"].forEach((eventName) => {
        video.addEventListener(eventName, showLoading);
      });
      ["loadedmetadata", "loadeddata", "canplay", "canplaythrough", "playing", "seeked", "error"].forEach((eventName) => {
        video.addEventListener(eventName, hideLoading);
      });

      mainContainer.appendChild(video);
      mainContainer.appendChild(loader);
      showLoading();
      window.setTimeout(hideLoading, 1800);
      return;
    }

    const image = document.createElement("img");
    image.className = "media-content";
    image.src = localImageVariant(src, "medium") || src;
    image.srcset = imageSrcset(src);
    image.sizes = "(max-width: 860px) 100vw, 68vw";
    image.alt = altText || "LacostaHaus";
    image.loading = "eager";
    image.decoding = "async";
    image.tabIndex = 0;
    image.setAttribute("role", "button");
    image.setAttribute("aria-label", "Abrir imagen en pantalla completa");
    mainContainer.classList.add("is-image-openable");
    image.addEventListener("click", () => {
      const index = Number(image.dataset.galleryIndex || 0);
      openPropertyLightbox(index);
    });
    image.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        const index = Number(image.dataset.galleryIndex || 0);
        openPropertyLightbox(index);
      }
    });
    mainContainer.appendChild(image);
  }

  function ensurePropertyLightbox() {
    let lightbox = document.querySelector("[data-property-lightbox]");
    if (lightbox) return lightbox;

    lightbox = document.createElement("div");
    lightbox.className = "property-lightbox";
    lightbox.dataset.propertyLightbox = "";
    lightbox.hidden = true;
    lightbox.innerHTML = `
      <button class="property-lightbox__close" type="button" data-lightbox-close aria-label="Cerrar imagen">&times;</button>
      <button class="property-lightbox__nav property-lightbox__nav--prev" type="button" data-lightbox-prev aria-label="Imagen anterior">&lsaquo;</button>
      <figure class="property-lightbox__figure">
        <img data-lightbox-image alt="">
        <figcaption data-lightbox-counter></figcaption>
      </figure>
      <button class="property-lightbox__nav property-lightbox__nav--next" type="button" data-lightbox-next aria-label="Imagen siguiente">&rsaquo;</button>
    `;
    document.body.appendChild(lightbox);

    lightbox.querySelector("[data-lightbox-close]").addEventListener("click", closePropertyLightbox);
    lightbox.querySelector("[data-lightbox-prev]").addEventListener("click", () => stepPropertyLightbox(-1));
    lightbox.querySelector("[data-lightbox-next]").addEventListener("click", () => stepPropertyLightbox(1));
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) closePropertyLightbox();
    });
    document.addEventListener("keydown", (event) => {
      if (lightbox.hidden) return;
      if (event.key === "Escape") closePropertyLightbox();
      if (event.key === "ArrowLeft") stepPropertyLightbox(-1);
      if (event.key === "ArrowRight") stepPropertyLightbox(1);
    });

    return lightbox;
  }

  function updatePropertyLightbox() {
    const lightbox = ensurePropertyLightbox();
    const item = propertyGalleryItems[propertyGalleryIndex];
    if (!item) return;
    const image = lightbox.querySelector("[data-lightbox-image]");
    const counter = lightbox.querySelector("[data-lightbox-counter]");
    image.src = item.full;
    image.alt = item.alt || "LacostaHaus";
    counter.textContent = `${propertyGalleryIndex + 1}/${propertyGalleryItems.length}`;
    lightbox.querySelector("[data-lightbox-prev]").disabled = propertyGalleryItems.length < 2;
    lightbox.querySelector("[data-lightbox-next]").disabled = propertyGalleryItems.length < 2;
  }

  function openPropertyLightbox(index) {
    if (!propertyGalleryItems.length) return;
    propertyGalleryIndex = Math.max(0, Math.min(index || 0, propertyGalleryItems.length - 1));
    const lightbox = ensurePropertyLightbox();
    updatePropertyLightbox();
    lightbox.hidden = false;
    document.documentElement.classList.add("is-property-lightbox-open");
  }

  function closePropertyLightbox() {
    const lightbox = ensurePropertyLightbox();
    lightbox.hidden = true;
    document.documentElement.classList.remove("is-property-lightbox-open");
  }

  function stepPropertyLightbox(direction) {
    if (!propertyGalleryItems.length) return;
    propertyGalleryIndex = (propertyGalleryIndex + direction + propertyGalleryItems.length) % propertyGalleryItems.length;
    updatePropertyLightbox();
  }

  function initPropertyGallery() {
    const thumbs = Array.from(document.querySelectorAll(".thumbnail-container img"));
    if (!thumbs.length) return;

    function setActive(thumb) {
      thumbs.forEach((item) => item.classList.remove("active"));
      thumb.classList.add("active");
      const galleryIndex = thumb.dataset.galleryIndex || "";
      setMainMedia(thumb.dataset.full || thumb.src, thumb.dataset.poster || "", thumb.alt);
      const mainImage = document.querySelector("#mainContainer img.media-content");
      if (mainImage && galleryIndex !== "") mainImage.dataset.galleryIndex = galleryIndex;
    }

    thumbs.forEach((thumb) => {
      thumb.addEventListener("click", () => setActive(thumb));
      thumb.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setActive(thumb);
        }
      });
      thumb.tabIndex = 0;
      thumb.setAttribute("role", "button");
      thumb.setAttribute("aria-label", isVideoSource(thumb.dataset.full || thumb.src) ? "Ver video del inmueble" : "Cambiar imagen principal");
    });

    setActive(thumbs[0]);
  }

  async function renderPropertyPage() {
    if (page !== "property") return;
    const registryProperty = propertyById(currentPropertyId());
    if (!registryProperty) {
      setSeo("Inmueble no disponible | LacostaHaus", "Este inmueble no esta publicado.");
      document.querySelector("[data-property-title]").textContent = "Inmueble no disponible";
      document.querySelector("[data-property-location]").textContent = "";
      document.querySelector("[data-property-details]").innerHTML = "";
      document.querySelector("[data-property-description]").innerHTML = "<p>Este inmueble se ha quitado del catalogo.</p>";
      return;
    }
    const propertyData = registryProperty.propertyData || await loadJsonPath(registryProperty.data);
    const propertyText = pickTranslation(propertyData.translations, currentLanguage);
    const media = propertyData.media || {};
    propertyGalleryItems = [];
    const poster = resolveAsset(media.poster || registryProperty?.image || "");
    const video = resolveAsset(media.video || "");
    const pdf = resolveAsset(media.pdf || "");

    setSeo(propertyText.seo_title, propertyText.seo_description, media.poster || registryProperty?.image || "assets/hero-principal.png");
    renderPropertyPrice(propertyText.price);
    document.querySelector("[data-property-title]").textContent = propertyText.title;
    document.querySelector("[data-property-location]").textContent = propertyText.location_text;
    document.querySelector("[data-property-details-title]").textContent = propertyText.details_title;
    document.querySelector("[data-property-project-title]").textContent = propertyText.project_title;
    document.querySelector("[data-property-description-title]").textContent = propertyText.description_title;
    document.querySelector("[data-property-location-title]").textContent = propertyText.location_title;
    document.querySelector("[data-property-location-text]").textContent = propertyText.location_text;

    document.querySelector("[data-property-details]").innerHTML = (propertyText.details || []).map(([label, value]) => `
      <li><strong>${label}:</strong> ${value}</li>
    `).join("");
    initPropertyDetailsToggle();

    document.querySelector("[data-property-description]").innerHTML = (propertyText.description || []).map((paragraph) => `
      <p>${paragraph}</p>
    `).join("");

    const pdfFrame = document.querySelector("[data-property-pdf]");
    const projectSection = document.querySelector("[data-property-project-section]");
    if (pdfFrame) {
      pdfFrame.src = pdf;
      pdfFrame.title = propertyText.pdf_title;
    }

    const pdfDownload = document.querySelector("[data-property-pdf-download]");
    if (pdfDownload) {
      pdfDownload.href = pdf;
      pdfDownload.textContent = propertyText.download_pdf;
    }
    if (projectSection && !pdf) projectSection.hidden = true;

    const plotSection = document.querySelector("[data-property-plot-section]");
    const plotImage = document.querySelector("[data-property-plot-image]");
    const plotTitle = document.querySelector("[data-property-plot-title]");
    const plotGraphic = resolveAsset(media.plot_graphic || "");
    if (plotSection) plotSection.hidden = !plotGraphic;
    if (plotImage && plotGraphic) {
      plotImage.src = plotGraphic;
      plotImage.alt = propertyText.plot_title || "Gráfico parcela del inmueble";
    }
    if (plotTitle) plotTitle.textContent = propertyText.plot_title || "Gráfico parcela";

    const mapFrame = document.querySelector("[data-property-map]");
    const mapSection = document.querySelector("[data-property-map-section]");
    const mapLink = document.querySelector("[data-property-map-link]");
    const mapLinkLabel = document.querySelector("[data-property-map-link-label]");
    const mapAddress = document.querySelector("[data-property-map-address]");
    if (mapFrame && media.map_embed) mapFrame.src = media.map_embed;
    if (mapSection && !media.map_embed) mapSection.hidden = true;
    if (mapLink && media.map_embed) mapLink.href = media.map_url || mapOpenUrl(media.map_embed);
    if (mapLinkLabel) mapLinkLabel.textContent = propertyMapLabels[currentLanguage] || propertyMapLabels.es;
    if (mapAddress) mapAddress.textContent = propertyText.location_text || "";

    const contactLink = document.querySelector("[data-property-contact-link]");
    if (contactLink) {
      const target = new URL(absoluteRoute("contact"));
      target.searchParams.set("property", registryProperty?.id || currentPropertyId());
      contactLink.href = target.href;
      contactLink.textContent = propertyContactLabels[currentLanguage] || propertyContactLabels.es;
    }

    const thumbs = document.querySelector("[data-property-thumbs]");
    if (thumbs) {
      propertyGalleryItems = (media.images || []).map((image) => {
        const full = resolveAsset(image.src);
        const alt = image["alt_" + currentLanguage] || image.alt_es || propertyText.title;
        return { full, alt };
      }).filter((item) => item.full && !isVideoSource(item.full));

      const videoThumb = video ? `
        <img src="${escapeAttribute(localImageVariant(poster, "thumb") || poster)}" srcset="${escapeAttribute(imageSrcset(poster))}" sizes="112px" data-full="${escapeAttribute(video)}" data-poster="${escapeAttribute(poster)}" alt="${escapeAttribute(propertyText.title)}" class="active" loading="lazy" decoding="async">
      ` : "";
      const imageThumbs = propertyGalleryItems.map((image, index) => {
        const thumbSrc = localImageVariant(image.full, "thumb") || image.full;
        return `<img src="${escapeAttribute(thumbSrc)}" srcset="${escapeAttribute(imageSrcset(image.full))}" sizes="112px" data-full="${escapeAttribute(image.full)}" data-gallery-index="${index}" alt="${escapeAttribute(image.alt)}" loading="lazy" decoding="async">`;
      }).join("");
      if (!videoThumb && !imageThumbs && poster && !isVideoSource(poster)) {
        propertyGalleryItems = [{ full: poster, alt: propertyText.title }];
      }
      const fallbackThumb = !videoThumb && !imageThumbs && poster ? `<img src="${escapeAttribute(localImageVariant(poster, "thumb") || poster)}" srcset="${escapeAttribute(imageSrcset(poster))}" sizes="112px" data-full="${escapeAttribute(poster)}" data-gallery-index="0" alt="${escapeAttribute(propertyText.title)}" class="active" loading="lazy" decoding="async">` : "";
      thumbs.innerHTML = videoThumb + imageThumbs + fallbackThumb;
    }

    initPropertyGallery();
  }

  async function renderContactPage() {
    if (page !== "contact") return;
    const contactData = await loadJson("contact.json");
    const contactText = pickTranslation(contactData.translations, currentLanguage);
    const contact = site.contact;

    setSeo(contactText.seo_title, contactText.seo_description);
    document.querySelector("[data-contact-title]").textContent = contactText.title;
    document.querySelector("[data-contact-subtitle]").textContent = contactText.subtitle;
    document.querySelector("[data-contact-name-label]").textContent = contactText.name_label;
    document.querySelector("[data-contact-email-label]").textContent = contactText.email_label;
    document.querySelector("[data-contact-phone-label]").textContent = contactText.phone_label;
    document.querySelector("[data-contact-message-label]").textContent = contactText.message_label;
    document.querySelector("[data-contact-submit]").textContent = contactText.submit;
    document.querySelector("[data-contact-back]").textContent = contactText.back_home;

    document.getElementById("name").placeholder = contactText.name_placeholder;
    document.getElementById("email").placeholder = contactText.email_placeholder;
    document.getElementById("phone").placeholder = contactText.phone_placeholder;
    document.getElementById("message").placeholder = contactText.message_placeholder;

    const selectedPropertyId = new URLSearchParams(window.location.search).get("property");
    const selectedProperty = propertyById(selectedPropertyId);
    if (selectedProperty) {
      const selectedText = propertyTranslation(selectedProperty);
      const label = contactPropertyLabels[currentLanguage] || contactPropertyLabels.es;
      const title = selectedText.title || selectedProperty.id;
      document.querySelector("[data-contact-subtitle]").textContent = `${label}: ${title}`;

      const subject = document.querySelector('input[name="_subject"]');
      if (subject) subject.value = `Nueva consulta sobre ${title} desde LacostaHaus`;

      const form = document.querySelector(".contact-form-v2");
      let hiddenProperty = document.querySelector('input[name="property"]');
      if (!hiddenProperty && form) {
        hiddenProperty = document.createElement("input");
        hiddenProperty.type = "hidden";
        hiddenProperty.name = "property";
        form.appendChild(hiddenProperty);
      }
      if (hiddenProperty) hiddenProperty.value = title;

      const message = document.getElementById("message");
      if (message) message.placeholder = `${contactText.message_placeholder} (${title})`;
    }

    const phone = document.querySelector("[data-contact-phone]");
    const email = document.querySelector("[data-contact-email]");
    if (phone) {
      phone.textContent = contact.phone;
      phone.href = "tel:" + contact.phone.replace(/\s/g, "");
    }
    if (email) {
      email.textContent = contact.email;
      email.href = "mailto:" + contact.email;
    }
  }

  function renderParagraphs(items) {
    return items.map((item) => `<p>${item}</p>`).join("");
  }

  function sectionImageMarkup(image, className) {
    if (!image || !image.src) return "";
    return `
      <figure class="${className}">
        ${responsiveImageMarkup(image.src, image.alt || "", "(max-width: 860px) 100vw, 760px")}
      </figure>
    `;
  }

  function serviceFallbackText(service) {
    const base = serviceFallbackCopy[currentLanguage] || serviceFallbackCopy.es;
    const className = serviceClassById[service.id];
    const homeService = (currentText.services.items || []).find((item) => item.className === className) || {};
    const spanishText = pickTranslation(service.translations || {}, "es");
    const title = homeService.title || spanishText.title || "";
    const intro = homeService.text || spanishText.intro || "";
    return {
      seo_title: `${title} | LacostaHaus`,
      seo_description: intro,
      kicker: base.kicker,
      title,
      intro,
      section_title: base.section_title,
      sections: base.sections,
      aside_title: base.aside_title,
      benefits: base.benefits,
      cta: base.cta
    };
  }

  async function renderCookiePolicyPage() {
    if (page !== "cookies") return;
    const cookieData = await loadJson("cookie-policy.json");
    const cookieText = pickTranslation(cookieData.translations, currentLanguage);
    const content = document.querySelector("[data-cookie-policy-content]");

    setSeo(cookieText.seo_title, cookieText.seo_description);
    document.querySelector("[data-cookie-title]").textContent = cookieText.title;
    document.querySelector("[data-cookie-updated]").textContent = cookieText.updated;
    document.querySelector("[data-cookie-back]").textContent = cookieText.back_home;

    if (!content) return;
    const tableHeaders = cookieText.table_headers.map((header) => `<th>${header}</th>`).join("");
    const tableRows = cookieText.table_rows.map((row) => `
      <tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>
    `).join("");

    content.innerHTML = `
      <h2>${cookieText.intro_title}</h2>
      ${renderParagraphs(cookieText.intro)}
      <h2>${cookieText.responsible_title}</h2>
      ${renderParagraphs(cookieText.responsible)}
      <h2>${cookieText.types_title}</h2>
      <h3>${cookieText.technical_title}</h3>
      <p>${cookieText.technical_text}</p>
      <h3>${cookieText.analytics_title}</h3>
      <p>${cookieText.analytics_text}</p>
      <h2>${cookieText.table_title}</h2>
      <div class="legal-table-wrap">
        <table class="legal-table">
          <thead><tr>${tableHeaders}</tr></thead>
          <tbody>${tableRows}</tbody>
        </table>
      </div>
      <h2>${cookieText.consent_title}</h2>
      ${renderParagraphs(cookieText.consent)}
      <h2>${cookieText.browser_title}</h2>
      ${renderParagraphs(cookieText.browser)}
      <h2>${cookieText.third_title}</h2>
      ${renderParagraphs(cookieText.third)}
      <h2>${cookieText.changes_title}</h2>
      ${renderParagraphs(cookieText.changes)}
    `;
  }

  async function renderPrivacyPolicyPage() {
    if (page !== "privacy") return;
    const privacyData = await loadJson("privacy-policy.json");
    const privacyText = pickTranslation(privacyData.translations, currentLanguage);
    const content = document.querySelector("[data-privacy-policy-content]");

    setSeo(privacyText.seo_title, privacyText.seo_description);
    document.querySelector("[data-privacy-title]").textContent = privacyText.title;
    document.querySelector("[data-privacy-updated]").textContent = privacyText.updated;
    document.querySelector("[data-privacy-back]").textContent = privacyText.back_home;
    content.innerHTML = `
      <h2>${privacyText.identity_title}</h2>
      ${renderParagraphs(privacyText.identity)}
      <h2>${privacyText.data_title}</h2>
      ${renderParagraphs(privacyText.data)}
      <h2>${privacyText.purpose_title}</h2>
      ${renderParagraphs(privacyText.purpose)}
      <h2>${privacyText.legal_title}</h2>
      ${renderParagraphs(privacyText.legal)}
      <h2>${privacyText.rights_title}</h2>
      ${renderParagraphs(privacyText.rights)}
      <h2>${privacyText.retention_title}</h2>
      ${renderParagraphs(privacyText.retention)}
      <h2>${privacyText.third_title}</h2>
      ${renderParagraphs(privacyText.third)}
    `;
  }

  async function renderAgentPage() {
    if (page !== "agent") return;
    const { data: agentData, text: agentText } = await loadAgentData();
    const contact = agentData.contact || {};

    setSeo(agentText.seo_title, agentText.seo_description, "assets/contacto-asesor.png");
    document.querySelector("[data-agent-kicker]").textContent = agentText.kicker;
    document.querySelector("[data-agent-title]").textContent = agentText.title;
    document.querySelector("[data-agent-role]").textContent = agentText.role;
    document.querySelector("[data-agent-intro]").textContent = agentText.intro;
    document.querySelector("[data-agent-languages-title]").textContent = agentText.languages_title;
    document.querySelector("[data-agent-contact-title]").textContent = agentText.contact_title;
    document.querySelector("[data-agent-back]").textContent = agentText.back;

    renderAgentLanguages(document.querySelector("[data-agent-languages]"), agentData.languages);
    renderAgentContacts(document.querySelector("[data-agent-contact-list]"), agentText, contact);
  }

  async function renderServicePage() {
    if (page !== "service") return;
    const servicesData = await loadJson("services.json");
    const service = (servicesData.services || []).find((item) => item.id === document.body.dataset.serviceId);
    if (!service) return;
    const text = service.translations?.[currentLanguage] || serviceFallbackText(service);

    setSeo(text.seo_title, text.seo_description, serviceHeroImages[service.id] || "assets/hero-principal.png");
    document.querySelector("[data-service-kicker]").textContent = text.kicker;
    document.querySelector("[data-service-title]").textContent = text.title;
    document.querySelector("[data-service-intro]").textContent = text.intro;
    document.querySelector("[data-service-section-title]").textContent = text.section_title;
    document.querySelector("[data-service-aside-title]").textContent = text.aside_title;
    document.querySelector("[data-service-cta]").textContent = text.cta;

    const sections = document.querySelector("[data-service-sections]");
    if (sections) {
      const images = serviceSectionImages[service.id] || [];
      sections.innerHTML = (text.sections || []).map((section, index) => `
        <section>
          <h3>${section.title}</h3>
          ${sectionImageMarkup(images[index], "content-section-image service-section-image")}
          ${renderParagraphs(section.paragraphs || [])}
        </section>
      `).join("");
    }

    const benefits = document.querySelector("[data-service-benefits]");
    if (benefits) {
      benefits.innerHTML = (text.benefits || []).map((benefit) => `<li>${benefit}</li>`).join("");
    }
  }

  async function articlesData() {
    return loadJson("articles.json");
  }

  function articleText(article) {
    return pickTranslation(article.translations || {}, currentLanguage);
  }

  function articleShareMarkup(article, text) {
    const labels = articleShareLabels[currentLanguage] || articleShareLabels.es;
    const shareUrl = productionUrlForPath(article.route, currentLanguage);
    const shareText = encodeURIComponent(`${text.title} | LacostaHaus`);
    const encodedUrl = encodeURIComponent(shareUrl);
    const contactUrl = new URL(absoluteRoute("contact", currentLanguage));
    contactUrl.searchParams.set("utm_source", "articulo");
    contactUrl.searchParams.set("utm_medium", "cta");
    contactUrl.searchParams.set("utm_campaign", article.id);

    return `
      <aside class="article-action-panel" aria-label="${labels.title}">
        <div class="article-share-row">
          <strong>${labels.title}</strong>
          <div class="article-share-actions">
            <a href="https://api.whatsapp.com/send?text=${shareText}%20${encodedUrl}" target="_blank" rel="noopener" data-share-action="whatsapp">${labels.whatsapp}</a>
            <a href="https://t.me/share/url?url=${encodedUrl}&text=${shareText}" target="_blank" rel="noopener" data-share-action="telegram">${labels.telegram}</a>
            <button type="button" data-copy-link="${shareUrl}">${labels.copy}</button>
          </div>
        </div>
        <div class="article-contact-cta">
          <div>
            <h2>${labels.ctaTitle}</h2>
            <p>${labels.ctaText}</p>
          </div>
          <a class="btn-primary-home btn-hover-effect" href="${contactUrl.href}">${labels.ctaButton}</a>
        </div>
      </aside>
    `;
  }

  function initArticleInteractions() {
    document.querySelectorAll("[data-share-action]").forEach((item) => {
      item.addEventListener("click", () => {
        window.gtag?.("event", "share_article", {
          method: item.dataset.shareAction,
          page_path: window.location.pathname
        });
      });
    });

    document.querySelectorAll("[data-copy-link]").forEach((button) => {
      button.addEventListener("click", async () => {
        const labels = articleShareLabels[currentLanguage] || articleShareLabels.es;
        const original = button.textContent;
        try {
          await navigator.clipboard.writeText(button.dataset.copyLink);
          button.textContent = labels.copied;
        } catch (error) {
          button.textContent = button.dataset.copyLink;
        }
        setTimeout(() => {
          button.textContent = original;
        }, 1800);
      });
    });
  }

  async function renderArticleListPage() {
    if (page !== "articles") return;
    const data = await articlesData();
    const text = pickTranslation(data.translations || {}, currentLanguage);
    const list = document.querySelector("[data-article-list]");

    setSeo(text.seo_title, text.seo_description, "assets/articulos-guias-costa-brava-hero.png");
    document.querySelector("[data-articles-title]").textContent = text.title;
    document.querySelector("[data-articles-intro]").textContent = text.intro;

    if (list) {
      list.innerHTML = (data.articles || []).map((article) => {
        const item = articleText(article);
        const cardImage = articleHeroImages[article.id] || "assets/articulos-guias-costa-brava-hero.png";
        return `
          <a class="article-card" href="${urlForPath(article.route)}">
            <figure class="article-card__media">
              ${responsiveImageMarkup(cardImage, item.title, "(max-width: 860px) 100vw, 360px")}
            </figure>
            <span>${item.category}</span>
            <h2>${item.title}</h2>
            <p>${item.excerpt}</p>
            <strong>${item.read_more}</strong>
          </a>
        `;
      }).join("");
    }
  }

  async function renderArticlePage() {
    if (page !== "article") return;
    const data = await articlesData();
    const article = (data.articles || []).find((item) => item.id === document.body.dataset.articleId);
    if (!article) return;
    const text = articleText(article);

    const heroImage = articleHeroImages[article.id] || (articleSectionImages[article.id] || [])[0]?.src || "assets/articulos-guias-costa-brava-hero.png";
    setSeo(text.seo_title, text.seo_description, heroImage);
    document.title = text.seo_title || `${text.title} | LacostaHaus`;
    const categoryEl = document.querySelector("[data-article-category]");
    const titleEl = document.querySelector("[data-article-title]");
    const excerptEl = document.querySelector("[data-article-excerpt]");
    const dateEl = document.querySelector("[data-article-date]");
    if (categoryEl) categoryEl.textContent = text.category;
    if (titleEl) titleEl.textContent = text.title;
    if (excerptEl) excerptEl.textContent = text.excerpt;
    if (dateEl) dateEl.textContent = text.date;

    const content = document.querySelector("[data-article-content]");
    const images = articleSectionImages[article.id] || [];
    if (content) {
      content.innerHTML = (text.sections || []).map((section, index) => `
        <section>
          <h2>${section.title}</h2>
          ${sectionImageMarkup(images[index], "content-section-image article-section-image")}
          ${renderParagraphs(section.paragraphs || [])}
        </section>
      `).join("") + articleShareMarkup(article, text);
      initArticleInteractions();
    }
    setJsonLd("articleStructuredData", {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: text.title,
      description: text.seo_description || text.excerpt,
      author: { "@type": "Organization", name: site.brand || "LacostaHaus" },
      publisher: {
        "@type": "Organization",
        name: site.brand || "LacostaHaus",
        logo: { "@type": "ImageObject", url: productionAssetUrl(site.logo || "assets/logo-lacostahaus.png") }
      },
      mainEntityOfPage: productionUrlForPath(article.route, currentLanguage),
      dateModified: "2026-06-18",
      inLanguage: document.documentElement.lang || currentLanguage,
      image: productionAssetUrl(heroImage)
    });
    setJsonLd("articleBreadcrumbStructuredData", {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: site.brand || "LacostaHaus", item: productionUrlForPath(site.routes.home, currentLanguage) },
        { "@type": "ListItem", position: 2, name: "Artículos", item: productionUrlForPath("articulos/", currentLanguage) },
        { "@type": "ListItem", position: 3, name: text.title, item: productionUrlForPath(article.route, currentLanguage) }
      ]
    });
  }

  function initCookies() {
    const banner = document.getElementById("cookieBanner");
    if (!banner) return;
    const accept = document.getElementById("cookieAccept");
    const reject = document.getElementById("cookieReject");
    const saved = localStorage.getItem(CONSENT_KEY);

    function updateConsent(granted) {
      window.gtag("consent", "update", {
        ad_storage: granted ? "granted" : "denied",
        analytics_storage: granted ? "granted" : "denied",
        ad_user_data: granted ? "granted" : "denied",
        ad_personalization: granted ? "granted" : "denied",
        functionality_storage: "granted",
        security_storage: "granted"
      });
    }

    function loadGtm() {
      if (!site.gtmId || window.__lacostahausGtmLoaded) return;
      window.__lacostahausGtmLoaded = true;
      window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
      const firstScript = document.getElementsByTagName("script")[0];
      const gtmScript = document.createElement("script");
      gtmScript.async = true;
      gtmScript.src = "https://www.googletagmanager.com/gtm.js?id=" + encodeURIComponent(site.gtmId);
      firstScript.parentNode.insertBefore(gtmScript, firstScript);
    }

    function close(value) {
      localStorage.setItem(CONSENT_KEY, value);
      banner.hidden = true;
    }

    loadGtm();

    if (saved === "accepted") {
      updateConsent(true);
      banner.hidden = true;
    } else if (saved === "rejected") {
      updateConsent(false);
      banner.hidden = true;
    } else {
      banner.hidden = false;
    }

    if (accept) {
      accept.addEventListener("click", () => {
        updateConsent(true);
        close("accepted");
      });
    }

    if (reject) {
      reject.addEventListener("click", () => {
        updateConsent(false);
        close("rejected");
      });
    }
  }

  function analyticsAllowed() {
    return localStorage.getItem(CONSENT_KEY) === "accepted";
  }

  function trackEvent(name, params = {}) {
    if (!analyticsAllowed()) return;
    const payload = {
      page_path: window.location.pathname,
      page_language: currentLanguage,
      ...params
    };
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: name, ...payload });
    window.gtag?.("event", name, payload);
  }

  function eventLabel(element) {
    return (element?.textContent || element?.getAttribute("aria-label") || "").trim().replace(/\s+/g, " ").slice(0, 90);
  }

  function initAnalyticsEvents() {
    document.addEventListener("click", (event) => {
      const link = event.target.closest("a, button");
      if (!link) return;
      const href = link.getAttribute("href") || "";
      const absoluteHref = link.href || href;
      const label = eventLabel(link);

      if (absoluteHref.includes("api.whatsapp.com") || absoluteHref.includes("wa.me")) {
        trackEvent("contact_whatsapp_click", { link_text: label, link_url: absoluteHref });
        return;
      }

      if (absoluteHref.includes("t.me")) {
        trackEvent("contact_telegram_click", { link_text: label, link_url: absoluteHref });
        return;
      }

      if (href.startsWith("mailto:")) {
        trackEvent("contact_email_click", { link_text: label, link_url: href });
        return;
      }

      if (href.startsWith("tel:")) {
        trackEvent("contact_phone_click", { link_text: label, link_url: href });
        return;
      }

      if (link.closest(".language-menu")) {
        trackEvent("language_change_click", { link_text: label, link_url: absoluteHref });
        return;
      }

      if (link.closest(".site-nav")) {
        trackEvent("navigation_click", { link_text: label, link_url: absoluteHref });
        return;
      }

      if (link.closest(".catalog-card")) {
        trackEvent("property_catalog_click", { link_text: label, link_url: absoluteHref });
        return;
      }

      if (link.closest(".coverflow-card")) {
        trackEvent("property_showcase_click", { link_text: label, link_url: absoluteHref });
        return;
      }

      if (link.closest(".hero-selection-card")) {
        trackEvent("property_selection_click", { link_text: label, link_url: absoluteHref });
        return;
      }

      if (link.matches(".btn-primary-home, .btn-secondary-home, .btn-outline, .btn-hover-effect") || link.closest(".service-card-home")) {
        trackEvent("cta_click", { link_text: label, link_url: absoluteHref });
      }
    });
  }

  function dropdownTrigger(dropdown) {
    return Array.from(dropdown.children).find((child) => child.tagName === "A");
  }

  function closeMobileDropdowns(nav, except = null) {
    nav.querySelectorAll(".dropdown.is-open").forEach((dropdown) => {
      if (dropdown === except) return;
      dropdown.classList.remove("is-open");
      const trigger = dropdownTrigger(dropdown);
      if (trigger) trigger.setAttribute("aria-expanded", "false");
    });
  }

  function initMenuToggle() {
    const button = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".site-nav");
    if (!button || !nav) return;
    const mobileQuery = window.matchMedia("(max-width: 940px)");

    button.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(isOpen));
      if (!isOpen) closeMobileDropdowns(nav);
    });

    nav.querySelectorAll(".dropdown").forEach((dropdown) => {
      const menu = dropdown.querySelector(".dropdown-menu");
      const trigger = dropdownTrigger(dropdown);
      if (!menu || !trigger) return;
      trigger.setAttribute("aria-haspopup", "true");
      trigger.setAttribute("aria-expanded", "false");

      trigger.addEventListener("click", (event) => {
        if (!mobileQuery.matches) return;
        if (!dropdown.classList.contains("is-open")) {
          event.preventDefault();
          closeMobileDropdowns(nav, dropdown);
          dropdown.classList.add("is-open");
          trigger.setAttribute("aria-expanded", "true");
          return;
        }
        if (trigger.getAttribute("href") === "#") {
          event.preventDefault();
        }
      });
    });

    const resetDropdowns = () => {
      if (!mobileQuery.matches) closeMobileDropdowns(nav);
    };
    if (mobileQuery.addEventListener) {
      mobileQuery.addEventListener("change", resetDropdowns);
    } else if (mobileQuery.addListener) {
      mobileQuery.addListener(resetDropdowns);
    }
  }

  async function init() {
    try {
      [site, homeData] = await Promise.all([
        loadJson("site.json"),
        loadJson("home.json")
      ]);
      propertiesData = await loadBackendProperties(await loadJson("properties.json"));
      currentLanguage = detectLanguage();
      currentText = pickTranslation(homeData.translations, currentLanguage);

      updateLanguageState();
      setSeo(currentText.seo.title, currentText.seo.description);
      setGlobalStructuredData();
      updateRoutes();
      renderDoubtsMenu();
      renderLanguageMenu();
      applyStaticTranslations();
      renderFooter();
      initMenuToggle();
      initAnalyticsEvents();

      if (page === "home") {
        renderStats();
        renderServices();
        renderHeroPropertyCard();
        renderFeaturedCoverflow();
        renderProcess();
        await renderHomeAgentSection();
        initCoverflow();
      }

      if (page === "catalog") renderCatalog();
      await renderPropertyPage();
      await renderContactPage();
      await renderCookiePolicyPage();
      await renderPrivacyPolicyPage();
      await renderAgentPage();
      await renderServicePage();
      await renderArticleListPage();
      await renderArticlePage();

      initCookies();
      document.body.classList.add("is-ready");
      const restoreScroll = sessionStorage.getItem(SCROLL_RESTORE_KEY);
      if (restoreScroll !== null) {
        sessionStorage.removeItem(SCROLL_RESTORE_KEY);
        requestAnimationFrame(() => window.scrollTo({ top: Number(restoreScroll) || 0, behavior: "auto" }));
      }
    } catch (error) {
      console.error(error);
      document.body.classList.add("is-ready");
    }
  }

  init();
})();
