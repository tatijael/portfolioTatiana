/**
 * Contenido del sitio — TODO el texto vive acá.
 * Editá este archivo para actualizar el portfolio; no hace falta tocar los
 * componentes .astro.
 *
 * Extraído de tus proyectos existentes:
 *   proyect-astro/          → bio, experiencia, skills, contacto
 *   EmpreTati/              → Cherry Muse (Next.js + Supabase)
 *
 * ⚠️ Revisá los campos marcados con TODO: son los que no pude verificar.
 */

export const site = {
  name: 'Tatiana Jael Saucedo',
  shortName: 'Tatiana Saucedo',
  /** Wordmark cursivo de la nav — corto a propósito, como el "Air" de air.inc */
  logoMark: 'Tati Saucedo',
  /* Este campo arma el <title> de la página y el `jobTitle` del JSON-LD,
     así que es el que más pesa de los tres lugares donde se declara el
     rol. Los otros dos —`hero.wordmarkRole` y el titular de `about`—
     tienen que decir lo mismo: un sitio que se presenta de dos maneras
     distintas hace dudar al que lee, no lo enriquece. */
  role: 'Full Stack Developer & Shopify Specialist',
  location: 'Buenos Aires, Argentina',
  email: 'tatijael@gmail.com',
  // TODO: confirmá que este dominio es el que vas a usar al deployar
  url: 'https://tatianasaucedo.dev',
  description:
    'Desarrolladora full stack y especialista en Shopify. Construyo tiendas y productos web rápidos, escalables y con una experiencia de usuario cuidada.',
} as const;

/* ── Los climas del sitio ─────────────────────────────────────────────────
   El orden de este array ES el orden del control del costado, de arriba
   hacia abajo, y también el orden en que lo recorren las flechas. Los `id`
   son los valores del atributo `data-tema` de <html>, así que tienen que
   coincidir con los bloques de global.css.

   Agregar un clima es: un bloque de variables en global.css y una entrada
   acá. Ningún componente se entera.
--------------------------------------------------------------------------- */
export const temas = [
  { id: 'suave', label: 'Claro suave' },
  { id: 'media', label: 'Claro medio' },
  { id: 'calida', label: 'Cálido' },
  { id: 'noche', label: 'Noche' },
] as const;

/** El que se ve si nunca elegiste: es el que el sitio tuvo siempre. */
export const TEMA_POR_DEFECTO = 'media';

/** Clave de localStorage. Vive acá para que el script del <head> —que no
    puede importar nada— y el del componente no se desincronicen. */
export const TEMA_CLAVE = 'tati:tema';

export const socials = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/tatijael/' },
  { label: 'GitHub', href: 'https://github.com/tatijael' },
  { label: 'Email', href: 'mailto:tatijael@gmail.com' },
] as const;

/* ── La navegación ────────────────────────────────────────────────────────
   Una entrada por sección con ancla, en el mismo orden en que aparecen en
   la página. Si agregás una sección a index.astro, va también acá: el menú
   no se arma solo.

   Desde `lg` se muestran como una tira de links en la barra (sin
   Contacto, que ya es el botón de al lado); debajo de `lg` van en el panel
   del botón "Menú". ⚠️ Con siete links la tira entra con poco margen en
   1024px: si sumás uno, medí antes y, si no entra, subí el corte a `xl`.

   "Contacto" está repetido en el botón "Trabajemos juntos", que apunta al
   mismo ancla. Es a propósito: el botón es la acción, el ítem del menú es
   la ubicación, y alguien que recorre el menú de arriba abajo espera
   encontrar la última sección ahí.
--------------------------------------------------------------------------- */
export const nav = [
  { label: 'Lo que hago', href: '#perfil' },
  { label: 'Proyectos', href: '#proyectos' },
  { label: 'Stack', href: '#stack' },
  { label: 'Galería', href: '#galeria' },
  { label: 'Sobre mí', href: '#sobre-mi' },
  { label: 'Experiencia', href: '#experiencia' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Contacto', href: '#contacto' },
] as const;

/* ── Hero ─────────────────────────────────────────────────────────────────
   Es el hero previo a la fusión: título cromado a dos líneas sobre negro,
   con el texto de apoyo empujado a la derecha. No usa el sistema Air —tiene
   su propia tipografía y su propio violeta— y por eso es el único componente
   con estilos propios en vez de clases `air-*`.
--------------------------------------------------------------------------- */
export const hero = {
  eyebrow: 'HOLA, SOY',
  eyebrowName: 'TATI',
  /** Las dos líneas del título cromado. Van en mayúsculas, cortas. */
  line1: 'SHOPIFY',
  line2: 'DEVELOPER',
  asideTag: '// CONSTRUYENDO ECOMMERCE DESDE 2021',
  aside:
    'Desarrolladora full stack enfocada en Shopify Plus: temas a medida, apps propias y las integraciones B2B que nadie quiere tocar.',
  scrollHint: '↓ SCROLL PARA RECORRER',

  /* ── La pantalla de apertura (el wordmark) ──────────────────────────────
     El retrato es `retrato.jpg` y no `me.jpg` a propósito: me.jpg tiene el
     fondo azul marino quemado en el archivo y sobre el papel claro del tema
     deja un recuadro oscuro. Si alguna vez hay una versión de me.jpg con
     fondo claro o transparente, se puede cambiar acá y listo. */
  wordmarkRole: 'Full Stack and Shopify Developer',
  wordmarkPhoto: '/images/retrato.jpg',
  wordmarkPhotoAlt: 'Tatiana Saucedo en su escritorio',
  primaryCta: { label: 'Ver proyectos', href: '#proyectos' },
  secondaryCta: { label: 'Contacto', href: '#contacto' },
} as const;

/* ── El retrato que gira al scrollear ─────────────────────────────────────
   El efecto es scrubbing de frames: cada posición del scroll muestra un
   frame distinto de una secuencia, y el giro lo hace el material. No es una
   animación que se pueda calcular a partir de una foto — para que la persona
   gire de verdad hace falta verla desde todos los ángulos.

   CÓMO CONSEGUIR LA SECUENCIA
   1. Grabá un video de 4 a 6 segundos girando sobre vos misma, cámara fija,
      contra una pared lisa y bien iluminada. Girá parejo y despacio.
   2. Sacale los frames y achicalos (el peso importa: se descargan todos):
        ffmpeg -i giro.mp4 -vf "fps=12,scale=520:-1" -q:v 6 \
          public/images/spin/frame-%03d.jpg
      12 fps por 5 segundos son 60 frames de ~25 KB → 1,5 MB en total.
   3. Contá cuántos archivos quedaron y poné ese número en `frameCount`.

   Mientras `frameCount` sea 0 se usa `poster`: una sola foto, que pivota
   apenas con el scroll. Es el gesto, no el efecto — ver ScrollSpin.tsx.
--------------------------------------------------------------------------- */
export const heroSpin = {
  /** Cantidad de frames de la secuencia. 0 = todavía no hay secuencia. */
  frameCount: 0,
  /** Carpeta de los frames, nombrados frame-001.jpg … frame-NNN.jpg */
  dir: '/images/spin',
  ext: 'jpg',
  /** Foto fija: se ve mientras cargan los frames, y es todo lo que hay
   *  mientras `frameCount` sea 0. */
  poster: '/images/me.jpg',
  alt: 'Tatiana Saucedo',
} as const;

/* ── Declaración poster-scale ─────────────────────────────────────────── */
export const statement = {
  line: 'HACELO RÁPIDO.',
  caption:
    'Cada milisegundo de carga es una conversión. Optimizo desde el primer render hasta el checkout.',
} as const;

/* ── Proyectos ────────────────────────────────────────────────────────── */
export type Project = {
  title: string;
  year: string;
  category: 'E-commerce' | 'Producto' | 'Web';
  summary: string;
  detail: string;
  stack: readonly string[];
  /** TODO: agregá la URL en producción cuando esté deployado (o dejá null) */
  live: string | null;
  /** TODO: agregá el repo si es público (o dejá null) */
  repo: string | null;
  image: string | null;
  /** 'contain' muestra la imagen entera sobre blanco en vez de recortarla;
      'top' la recorta igual que 'cover' pero anclada arriba (para capturas
      de apps, donde lo importante es el encabezado y el menú). */
  imageFit?: 'cover' | 'contain' | 'top';
};

export const projects: readonly Project[] = [
  /* ── Trabajo de cliente ─────────────────────────────────────────────────
     Venían del portfolio nuevo. "Sitio industrial" se sacó el 2026-09-22:
     no era un trabajo tuyo. "Tatiana Storefront" (proyecto propio en
     Hydrogen) y "Portfolio v1" también, a pedido tuyo: de los propios
     queda solo Cherry Muse. Van primero a
     propósito: son trabajo pago para terceros, y pesan más que los proyectos
     propios a la hora de que alguien decida contratarte.

     ⚠️ Los `year` los deduje de tu propia experiencia (Sysgarage, 2021—2024),
     no de una fecha que me hayas dado. Ajustalos al año real de cada
     proyecto antes de publicar.
  --------------------------------------------------------------------- */
  {
    // zyn.ca (B2C) y zynwholesale.com (B2B, solo con login). La imagen es
    // la home de zyn.ca; la del login mayorista está en zyn-wholesale.jpg.
    title: 'ZYN — Storefront B2C + B2B',
    year: '2021 — Hoy',
    category: 'E-commerce',
    summary:
      'Retailer de vinos y spirits de Calgary, Canadá, con tienda minorista y un canal mayorista privado.',
    detail:
      'Desarrollo las dos tiendas sobre Shopify Plus. zyn.ca es la tienda al público: miles de etiquetas, colecciones por tipo y bodega, case deals y eventos. zynwholesale.com es el canal B2B: acceso restringido con login, y cada cliente ve precios solo cuando tiene asignado el catálogo de su empresa. Diagnostiqué por qué el catálogo por empresa volvía vacío y adapté el tema mayorista al mobile con el mismo lenguaje que el minorista.',
    stack: ['Shopify Plus', 'Liquid', 'JavaScript', 'Catálogos B2B', 'Metafields', 'GraphQL'],
    live: 'https://zyn.ca',
    repo: null,
    image: '/images/zyn.jpg',
  },
  {
    // Mismo cliente que el storefront de arriba (ZYN). Stack sacado de
    // zyn-wineries/package.json.
    title: 'Back-office para Shopify',
    year: '2021 — Hoy',
    category: 'Producto',
    summary:
      'Web app interna donde el cliente opera su tienda Shopify sin entrar al admin.',
    detail:
      'Panel a medida conectado a la tienda: alta y edición de productos, bundles, órdenes de compra, actualización de costos desde Cin7 y CSV, y fulfillment por CSV que asigna el tracking a cada pedido y le avisa al comprador. Suma gestión de retiro en tienda, contenido, catálogos (tipos, medidas, presentaciones) y backups de Shopify.',
    stack: ['React', 'Material UI', 'Node.js', 'Express', 'Prisma', 'Shopify Admin API', 'Cin7'],
    live: null,
    repo: null,
    image: '/images/zyn-backoffice.jpg',
    imageFit: 'top',
  },
  {
    // Sale de tres repos de Sysgarage: zyn-checkout-customize (checkout y
    // cuenta de cliente), zyn-picking-list y zyn-app-ats-shipment (admin).
    title: 'Extensiones de checkout y admin',
    year: '2024 — 2026',
    category: 'E-commerce',
    summary:
      'Apps de Shopify que extienden el checkout, la cuenta de cliente y el admin de la misma tienda.',
    detail:
      'En el checkout, una Checkout UI Extension que suma Shipping Protection con un porcentaje configurable, y una Shopify Function que oculta métodos de envío según los productos del carrito. En la cuenta de cliente, la descarga de factura desde cada pedido. En el admin, "Print picking list" (desde la orden o en lote desde el listado) y "Generate ATS Shipment", un asistente que crea el envío con el transportista e imprime la etiqueta. Hoy las migro a Polaris web components.',
    stack: ['Checkout UI Extensions', 'Shopify Functions', 'Admin UI Extensions', 'Remix', 'Polaris', 'Prisma'],
    live: null,
    repo: null,
    // Dev Dashboard de Shopify con las tres apps. Shipping Protection y el
    // picking list (con los datos del cliente tapados) van en la galería.
    image: '/images/zyn-extensiones.jpg',
    imageFit: 'top',
  },
  {
    // Hecho de cero por vos: el sitio completo y el store locator.
    // Verificado en benditoaceite.com (2026-09-22): tema Shopify con
    // secciones propias; el locator es la sección `map_points_google` en
    // /pages/puntos-de-venta. La imagen es una captura de la home.
    // TODO: confirmá el año y si fue dentro de Sysgarage.
    title: 'Bendito Aceite',
    year: '2024',
    category: 'E-commerce',
    summary: 'Tienda Shopify de aceite de oliva hecha de cero, con buscador de puntos de venta.',
    detail:
      'Construí la tienda entera desde cero: tema a medida con secciones propias (hero en video, carruseles de productos y recetas) y el flujo de compra completo. El store locator es una sección hecha a mano sobre Google Maps: se busca por dirección o código postal y lista los locales más cercanos con su marcador en el mapa.',
    stack: ['Shopify', 'Liquid', 'JavaScript', 'Google Maps API'],
    live: 'https://www.benditoaceite.com',
    repo: null,
    image: '/images/bendito-aceite.jpg',
  },
  {
    // ganly.net — WordPress con GeneratePress, bilingüe EN/ES.
    // TODO: confirmá el año.
    title: 'Marcela Ganly Sculpture',
    year: '2021 — 2024',
    category: 'Web',
    summary: 'Sitio de autor para una escultora en bronce.',
    detail:
      'Armé el sitio completo de la artista: la obra organizada por colecciones (bronce figurativo y de forma libre, metal y resina, escultura para llevar puesta), la página de la artista, contacto por WhatsApp, versión en inglés y en español, y responsive.',
    stack: ['WordPress', 'GeneratePress', 'GenerateBlocks', 'CSS', 'JavaScript'],
    live: 'https://ganly.net',
    repo: null,
    image: '/images/ganly.jpg',
  },

  /* ── Proyectos propios ───────────────────────────────────────────────── */
  {
    title: 'Cherry Muse',
    year: '2026',
    category: 'Catálogo online',
    summary: 'Catálogo con pedido directo por WhatsApp y panel de administración propio, sobre Next.js y Supabase.',
    detail:
      'Catálogo online de marca personal, con productos cargados desde Supabase y un panel admin para gestionarlos. No tiene carrito: como cada pedido se hace por encargo y tarda 7 días, cada ficha lleva un botón "Lo quiero ya" que abre WhatsApp con el mensaje armado. Parallax, scroll reveal y contadores animados en el frontend.',
    stack: ['Next.js 16', 'React 19', 'Supabase', 'TypeScript', 'Tailwind v4', 'Lenis'],
    live: 'https://cherrymuseok.vercel.app',
    repo: null,
    image: '/images/cherry-muse.jpg',
  },
] as const;

/* ── Pieza 3D del hero (Spline) ───────────────────────────────────────────
   La escultura de vidrio que hace que air.inc se vea como se ve NO es un
   efecto de código: es un render 3D. Este campo apunta a una escena de Spline.

   Mientras sea null, la isla no se monta y su JS ni se descarga — el hero
   funciona igual, solo con el cielo pastel.

   TODO: creá la escena en spline.design (instrucciones paso a paso en el
   README, sección "La pieza 3D"), exportala como "Public URL / React" y pegá
   acá el enlace .splinecode. Ejemplo:
   'https://prod.spline.design/XXXXXXXX/scene.splinecode'
--------------------------------------------------------------------------- */
export const splineScene: string | null = null;

/* ── Showcase (ContainerScroll) ───────────────────────────────────────────
   La pantalla que rota y escala al scrollear, portada del storefront.
   TODO: sacá una captura del storefront andando (1600×1000 aprox), ponela en
   public/images/ y cargala acá. Mientras sea null se muestra un panel de
   marcador, no una imagen rota.
--------------------------------------------------------------------------- */
export const showcase = {
  eyebrow: 'En vivo',
  title: 'Así se ve un storefront',
  cursive: 'headless',
  after: '.',
  subtitle:
    'Hydrogen sirviendo datos de Shopify desde el borde, con las animaciones corriendo del lado del cliente solo donde hacen falta.',
  image: null as string | null,
  imageAlt: 'Captura de Tatiana Storefront en funcionamiento',
} as const;

/* ── Galería (HeroParallax) ───────────────────────────────────────────────
   Tres filas de tarjetas que se cruzan al scrollear.
   ⚠️ Está pensada para ~15 imágenes. Con menos, el componente las repite en
   ciclo: no se rompe, pero se nota. Cargá capturas reales de tus proyectos
   acá y la sección cobra sentido de verdad.
--------------------------------------------------------------------------- */
export const gallery = {
  eyebrow: 'Galería',
  title: 'Fragmentos de lo que',
  cursive: 'hago',
  after: '.',
  subtitle:
    'Capturas, detalles de interfaz y piezas sueltas de los proyectos en los que estuve.',
  items: [
    {title: 'ZYN', link: 'https://zyn.ca', thumbnail: '/images/zyn.jpg'},
    {title: 'ZYN Back-office', thumbnail: '/images/zyn-backoffice.jpg'},
    {title: 'Cherry Muse', link: 'https://cherrymuseok.vercel.app', thumbnail: '/images/cherry-muse.jpg'},
    {title: 'Apps de Shopify', thumbnail: '/images/zyn-extensiones.jpg'},
    {title: 'Print picking list', thumbnail: '/images/zyn-picking-list.jpg'},
    {title: 'Bendito Aceite', link: 'https://www.benditoaceite.com', thumbnail: '/images/bendito-aceite.jpg'},
    {title: 'Bendito — Puntos de venta', link: 'https://www.benditoaceite.com/pages/puntos-de-venta', thumbnail: '/images/bendito-aceite-locator.jpg'},
    {title: 'Marcela Ganly Sculpture', link: 'https://ganly.net', thumbnail: '/images/ganly.jpg'},
    {title: 'ZYN Wholesale', link: 'https://zynwholesale.com', thumbnail: '/images/zyn-wholesale.jpg'},
    {title: 'Shipping Protection', thumbnail: '/images/zyn-shipping-protection.jpg'},
  ] as { title: string; link?: string; thumbnail: string }[],
} as const;

/* ── Servicios ────────────────────────────────────────────────────────── */
export const services = [
  {
    title: 'Shopify',
    /** Línea principal, en blanco sobre la tarjeta de vidrio */
    lead: 'Tiendas que cargan rápido y venden.',
    /** Línea chica, apagada */
    note: 'Temas a medida y headless',
    body: 'Temas en Liquid, secciones dinámicas, metafields e integración de apps de terceros (pagos, inventario, Klaviyo). También headless con Hydrogen cuando el proyecto lo pide.',
    /** Marca la tarjeta destacada y muestra el badge flotante */
    destacado: 'Lo que más hago',
  },
  {
    title: 'Producto',
    lead: 'Interfaces que no se rompen.',
    note: 'React, Next.js y Astro',
    body: 'Componentes reutilizables, estado prolijo, tipado con TypeScript y diseño responsive que aguanta todos los breakpoints.',
    destacado: null,
  },
  {
    title: 'Performance',
    lead: 'Sitios que cargan rápido.',
    note: 'Velocidad y SEO técnico',
    body: 'Auditorías con Lighthouse y revisión de SEO: velocidad de carga, estructura de URLs, metadatos y keywords, para que la tienda se encuentre y no haga esperar.',
    destacado: null,
  },
  /* Soporte era una sección aparte, con su propio titular grande debajo de
     estas tarjetas. Eran dos cabeceras del mismo peso en la misma sección y
     se leía como dos secciones mal pegadas.

     Es la cuarta forma de trabajar juntos, así que es la cuarta tarjeta. El
     detalle —los seis ítems de `support.items`— va debajo de la grilla, como
     nota al pie de esta tarjeta y no como un bloque con voz propia. */
  {
    title: 'Soporte',
    lead: 'El día a día de una tienda que ya está andando.',
    note: 'Mensual o puntual',
    body: 'Administración técnica de Shopify: lo que consume horas cuando el catálogo es grande y la operación pesa.',
    destacado: null,
  },
] as const;

/* ── Soporte y operación de tienda ─────────────────────────────────────────
   El trabajo de todos los días sobre tiendas que ya están andando. No entra
   en las tres tarjetas de arriba —que son formas de arrancar un proyecto—,
   pero es buena parte de lo que hacés y conviene que se lea suelto.
--------------------------------------------------------------------------- */
/* El detalle de la tarjeta ( 004 ). Ya no tiene titular ni bajada propios:
   se los llevó la tarjeta. Lo que queda acá es la letra chica —qué incluye
   el soporte y cómo se contrata—, que es lo único que no entraba adentro. */
export const support = {
  eyebrow: 'El soporte, en detalle',
  items: [
    {
      title: 'Catálogo masivo',
      body: 'Carga, limpieza y estructura de productos, variantes, metafields y colecciones.',
    },
    {
      title: 'Ajustes de tema',
      body: 'Cambios puntuales de diseño y código en Liquid y CSS, con foco en cómo se ve en mobile.',
    },
    {
      title: 'Configuración técnica',
      body: 'Envíos, pasarelas de pago, impuestos y apps de terceros conectadas como corresponde.',
    },
    {
      title: 'Email marketing',
      body: 'Diseño de emails y flujos en Klaviyo: carrito abandonado, recompra y retención que corren solos.',
    },
    {
      title: 'Automatizaciones',
      body: 'Shopify Flow para el trabajo repetitivo: etiquetas, alertas de stock, reglas de pedidos.',
    },
    {
      title: 'Rediseños y puesta a punto',
      body: 'Tiendas existentes que necesitan orden, velocidad o una vuelta de diseño.',
    },
  ],
  /** Cómo se contrata: mensual o puntual. */
  nota: 'Soporte mensual o algo puntual para destrabar. Escribime y lo vemos.',
} as const;

/* ── Stack ─────────────────────────────────────────────────────────────────
   Se renderiza como dos marquesinas que corren en direcciones opuestas
   (ver Services.astro). Fusión de las dos listas que había: la del portfolio
   de agosto (lenguajes, frameworks, testing) y la del nuevo (el terreno
   Shopify, que es donde está el grueso de tu trabajo).

   Agregá o sacá lo que quieras — la animación se adapta a cualquier largo.
   Conviene mantener las filas parejas para que ninguna quede muy vacía.

   Lista confirmada por vos el 2026-09-22. Afuera a propósito: Recharge, Vue,
   GA4, Core Web Vitals y Migraciones (no los usás). Checkout UI Extensions,
   Functions y Admin UI Extensions están respaldados por los repos de
   Sysgarage (zyn-checkout-customize, zyn-picking-list, zyn-app-ats-shipment).
   Borrá lo que no uses de verdad — una lista corta y cierta vale más que una
   larga y dudosa.
--------------------------------------------------------------------------- */
export const skills = {
  eyebrow: 'Stack técnico',

  /** Fila superior: e-commerce y el ecosistema Shopify */
  ecommerce: [
    'Shopify Plus',
    'Liquid',
    'Shopify CLI',
    'Shopify APIs',
    'Hydrogen',
    'Oxygen',
    'Remix',
    'Checkout UI Extensions',
    'Shopify Functions',
    'Admin UI Extensions',
    'Polaris',
    'Metafields',
    'Catálogos B2B',
    'GraphQL',
    'Webhooks',
    'Shopify Flow',
    'Klaviyo',
    'Lighthouse',
    'SEO técnico',
    'Performance Optimization',
    'Conversion Rate Optimization',
  ],

  /** Fila inferior: base web, frameworks y herramientas */
  web: [
    'JavaScript',
    'TypeScript',
    'React',
    'Next.js',
    'Astro',
    'Node.js',
    'Express',
    'Prisma',
    'Supabase',
    'HTML5',
    'CSS3',
    'Sass',
    'Tailwind CSS',
    'Material UI',
    'Mobile First',
    'GSAP',
    'Figma',
    'Git / GitHub',
    'Asana',
    'Jira',
    'CI/CD con GitHub Actions',
    'Cypress',
    'Jest',
    'WordPress',
    'IA: Claude, Codex, ChatGPT, Copilot',
  ],
} as const;

/* ── Lo que hago ──────────────────────────────────────────────────────────
   La sección que ocupa el lugar que dejó el hero. La apertura dice QUIÉN
   sos; esta dice QUÉ hacés, y lo dice con nombres propios.

   No repite a `skills`: ahí las tecnologías son una marquesina de fichas,
   una lista de nombres sin contexto. Acá cada nombre va dentro de una
   oración que explica para qué lo usás, que es lo que un cliente necesita
   leer para saber si sos la persona.

   ── El asterisco ──────────────────────────────────────────────────────
   Lo que va entre *asteriscos* se resalta y se le dibuja un subrayado al
   entrar en pantalla. Es la única sintaxis del archivo y existe para que el
   texto siga siendo texto editable acá adentro: la alternativa era partir
   cada párrafo en un array de fragmentos, y entonces corregir una coma
   dejaba de ser corregir una coma.
--------------------------------------------------------------------------- */
export const perfil = {
  eyebrow: 'Lo que hago',
  headlineBefore: 'Full stack, con el',
  cursive: 'checkout',
  headlineAfter: ' incluido.',

  lead: 'Soy desarrolladora full stack. Trabajo el e-commerce de punta a punta —del storefront al checkout— y también producto web fuera de Shopify.',

  bloques: [
    {
      titulo: 'En Shopify',
      texto: 'Construyo storefronts headless con *Hydrogen* sobre *Remix*, y cuando el proyecto pide tema nativo trabajo en *Liquid* con *metafields* y *Shopify CLI*. Sobre *Shopify Plus* extiendo el checkout con *Checkout UI Extensions* y *Shopify Functions*, hago apps de admin en *Remix* —imprimir picking lists, generar envíos—, armo *catálogos B2B* y muevo los datos con *GraphQL* y *webhooks*. Las interfaces de esas apps van con *Polaris*.',
    },
    {
      titulo: 'Fuera de Shopify',
      texto: '*React* y *Next.js* para producto, *Astro* para sitios que tienen que cargar rápido, y *Node.js* con *TypeScript* de punta a punta. Persistencia con *Supabase* y *Prisma*, y las pruebas con *Jest* y *Cypress*. También construyo *back-offices* conectados a Shopify: web apps propias donde el cliente carga productos, actualiza costos y despacha pedidos por CSV con el tracking incluido.',
    },
    {
      titulo: 'Lo que sostiene el resto',
      texto: 'Conecto la tienda con lo que la rodea: integro APIs y apps de terceros —pagos, inventario, *Klaviyo* para email marketing— y sincronizo datos con los sistemas del cliente, como *Cin7* para costos. Y antes de publicar, reviso cada sitio con *Lighthouse* y ajusto el *SEO*.',
    },
  ],

  // Sale de `experience`: el primer puesto de Shopify arranca en 2020.
  // ⚠️ El hero desmontado decía "desde 2021" — si el año bueno es ese,
  // cambialo acá.
  cierre: 'Desde 2020, entre agencias Shopify Experts y equipos de producto.',
} as const;

/* ── Sobre mí ─────────────────────────────────────────────────────────── */
export const about = {
  eyebrow: 'Sobre mí',
  headlineBefore: 'Full stack con cabeza de',
  cursive: 'negocio',
  headlineAfter: '.',
  /* Acá NO va una presentación. La página ya se presenta dos veces antes de
     llegar a esta sección —la apertura y "Lo que hago"—, y una tercera no
     agrega información: resta. Lo que queda es lo único que no está en
     ningún otro lado, que es cómo trabajás y cómo pensás. */
  paragraphs: [
    'Trabajo cómoda en equipos colaborativos, haciendo de puente entre diseño, desarrollo y las personas que definen el producto. Me gusta entender el porqué antes de escribir la primera línea.',
    'Mi fortaleza es la resolución de problemas: identificar el cuello de botella real, no el síntoma, y resolverlo de forma que no vuelva a aparecer.',
  ],
  // Original de 5043×6225 (7 MB) reescalado a 972×1200 JPEG (246 KB).
  portrait: '/images/retrato.jpg',
  portraitAlt: 'Retrato de Tatiana Jael Saucedo',
} as const;

/**
 * CV descargable.
 * public/cv.pdf se genera desde src/pages/cv.astro con `npm run cv`, a
 * partir de los mismos datos de este archivo: si cambiás la experiencia,
 * volvé a correrlo. Si lo pasás a null, el botón "Descargar CV" no se
 * renderiza —
 * preferible a un link que abre algo que no es un CV.
 */
export const cvUrl: string | null = '/cv.pdf';

/* ── Experiencia ──────────────────────────────────────────────────────── */
export const experience = [
  {
    // Título y fechas como en LinkedIn: "Shopify Developer | Full Stack",
    // may. 2021 — actualidad, remoto, contractor.
    role: 'Shopify Developer · Full Stack',
    company: 'Sysgarage',
    place: 'Remoto · Miami, USA',
    period: '2021 — Hoy',
    bullets: [
      'Desarrollo las tiendas Shopify Plus de ZYN, retailer de vinos canadiense: zyn.ca (B2C) y zynwholesale.com (B2B, con acceso por login y catálogo por empresa), en Liquid y JavaScript, con enfoque mobile first.',
      'Checkout: una Checkout UI Extension que suma Shipping Protection y una Shopify Function que personaliza los métodos de envío según el carrito. En la cuenta de cliente, la descarga de facturas por pedido.',
      'Admin: apps en Remix con UI Extensions para imprimir picking lists (por orden o en lote) y generar envíos con el transportista, con etiqueta incluida. Hoy las migro a Polaris web components.',
      'Back-office full stack (React, Material UI, Node.js, Express, Prisma) conectado a la tienda: productos, bundles, costos sincronizados con Cin7 y fulfillment por CSV con tracking.',
      'Integré APIs de terceros —pagos, inventario, Klaviyo— y audito los sitios con Lighthouse para trabajar velocidad de carga y SEO técnico.',
      // Respaldado por los repos: ramas feature/*, PRs numerados, rama
      // staging, Dockerfile en las apps y deploy a Heroku en zyn-wineries.
      'Cómo trabajo: contractor remoto dentro del equipo, con las tareas organizadas en Asana, ramas por feature, pull requests con code review, un ambiente de staging antes de producción y deploys con Docker y Heroku.',
    ],
  },
  {
    // LinkedIn: "Frontend Developer", nov. 2020 — abr. 2021.
    role: 'Frontend Developer',
    company: 'Innovate Group — Shopify Experts',
    place: 'Rosario, Santa Fe, Argentina',
    period: '2020 — 2021',
    // "Aumento notable de tráfico y conversiones" se fue: sin un número
    // atrás no suma. Si tenés uno (ej. "+30% de conversión"), vuelve.
    // ⚠️ Sin repos para verificar: escrito a partir de "hacía todo el front
    // de distintas páginas". Borrá lo que no hayas hecho.
    bullets: [
      'Hice el front completo de tiendas Shopify para distintos clientes de la agencia: home, colecciones, fichas de producto, carrito, landings de campaña y páginas institucionales.',
      'Pasé diseños de Figma a temas en Liquid, con plantillas y secciones dinámicas que el cliente puede editar solo desde el personalizador.',
      'Personalicé y extendí temas existentes, y mantuve las tiendas ya publicadas con cambios y ajustes a pedido.',
      'Maqueté interfaces responsive con HTML, CSS, SASS y Bootstrap, probadas en distintos navegadores y dispositivos.',
      'Sumé la interacción en JavaScript: menús, sliders, filtros de colección, variantes de producto y carrito.',
      'Usé metafields para enriquecer las fichas de producto más allá de lo que trae Shopify por defecto.',
      'Integré y configuré apps de terceros como Klaviyo para automatizar el email marketing de las tiendas.',
    ],
  },
] as const;

// Sale de LinkedIn (linkedin.com/in/tatijael, sección Educación), 2026-09-22.
// ⚠️ LinkedIn dice "ene. 2025 – ago. 2035" para Backend: casi seguro es
// 2025. Corregilo también allá.
export const education = [
  {
    title: 'Backend Development',
    school: 'Ada ITW',
    period: '2025',
    detail: 'APIs REST con Node.js y Express, bases de datos e integración con frontends en React.',
  },
  {
    title: 'Frontend Development Bootcamp',
    school: 'Ada ITW',
    period: '2020',
    detail: 'HTML, CSS, SASS, JavaScript, React y Git, con proyectos en equipos Agile y Scrum.',
  },
  {
    title: 'Técnica Superior en Administración Pública',
    school: 'Instituto Terciario N° 6029',
    period: '2011 — 2014',
    detail: null,
  },
  {
    title: 'Secundario completo',
    school: 'Colegio Santa Catalina de Bolonia · Tartagal, Salta',
    // TODO: año de egreso, si querés mostrarlo.
    period: null,
    detail: null,
  },
] as const;

/* ── Idiomas ───────────────────────────────────────────────────────────
   Van debajo de Formación y también en el CV. B1 es lo que declaraste vos
   (2026-09-22); si rendís un examen o subís de nivel, cambialo acá. */
export const languages = [
  { label: 'Español', level: 'Nativo' },
  { label: 'Inglés', level: 'Intermedio (B1)' },
] as const;

/* ── Contacto ─────────────────────────────────────────────────────────── */
export const contact = {
  eyebrow: 'Contacto',
  headlineBefore: 'Contame qué querés',
  cursive: 'construir',
  headlineAfter: '.',
  subtitle:
    'Proyectos de e-commerce, frontend de producto o una tienda que necesita andar más rápido. Respondo dentro de las 48 hs.',
  /** Línea chica debajo de los botones. */
  nota: 'Respondo dentro de las 48 hs, en español o inglés.',
} as const;
