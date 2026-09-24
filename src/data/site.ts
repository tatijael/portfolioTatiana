/**
 * Contenido del sitio — TODO el texto vive acá.
 * Editá este archivo para actualizar el portfolio; no hace falta tocar los
 * componentes .astro.
 *
 * Extraído de tus proyectos existentes:
 *   proyect-astro/          → bio, experiencia, skills, contacto
 *   portfolioTatiana/       → Tatiana Storefront (Shopify Hydrogen)
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

   ⚠️ Con ocho ítems la fila mide 967px junto al logo y al botón, y la barra
   horizontal aparece recién en `lg` (1024px): quedan 57px de margen. No es
   mucho. Si sumás un noveno ítem, medí antes — con `gap-4` cada entrada se
   come unos 80px y ya no entra. La salida en ese caso es subir el corte a
   `xl`, no achicar más el aire.

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
};

export const projects: readonly Project[] = [
  /* ── Trabajo de cliente ─────────────────────────────────────────────────
     Estos tres venían del portfolio nuevo y no estaban acá. Van primero a
     propósito: son trabajo pago para terceros, y pesan más que los proyectos
     propios a la hora de que alguien decida contratarte.

     ⚠️ Los `year` los deduje de tu propia experiencia (Sysgarage, 2021—2024),
     no de una fecha que me hayas dado. Ajustalos al año real de cada
     proyecto antes de publicar.
  --------------------------------------------------------------------- */
  {
    title: 'Storefront B2B + B2C',
    year: '2021 — 2024',
    category: 'E-commerce',
    summary:
      'Retailer de vinos operando mayorista y minorista sobre la misma tienda.',
    detail:
      'Retailer canadiense con las dos operaciones en una sola tienda. Diagnostiqué por qué el catálogo por empresa volvía vacío y construí una app de personalización de checkout con extensión de entrega.',
    stack: ['Shopify Plus', 'Liquid', 'Remix', 'Prisma', 'GraphQL'],
    live: null,
    repo: null,
    image: null,
  },
  {
    title: 'Portfolio de escultura',
    year: '2021 — 2024',
    category: 'Web',
    summary: 'Sitio de autor para obra que estaba dispersa en archivos y redes.',
    detail:
      'La obra no tenía lugar propio: vivía en carpetas y posteos sueltos. Armé el sitio completo — páginas de portfolio, colecciones, contacto y responsive.',
    stack: ['WordPress', 'GenerateBlocks', 'CSS', 'JavaScript'],
    live: 'https://ganly.net',
    repo: null,
    image: null,
  },
  {
    title: 'Sitio industrial',
    year: '2021 — 2024',
    category: 'Web',
    summary: 'Rediseño de un catálogo extenso que no se entendía.',
    detail:
      'Un catálogo largo con una arquitectura que no acompañaba. Rediseñé la estructura de contenido y la interfaz alrededor de cómo compra el cliente, no de cómo estaba ordenado el inventario.',
    stack: ['Diseño', 'Front-end'],
    live: null,
    repo: null,
    image: null,
  },

  /* ── Proyectos propios ───────────────────────────────────────────────── */
  {
    title: 'Tatiana Storefront',
    year: '2026',
    category: 'E-commerce',
    summary: 'Storefront headless de Shopify sobre Hydrogen.',
    detail:
      'Tienda headless completa: catálogo, colecciones, carrito, cuenta de cliente, blog y checkout de Shopify. Datos vía Storefront API con codegen tipado, animación con GSAP y scroll suave con Lenis.',
    stack: [
      'Shopify Hydrogen',
      'React Router 7',
      'TypeScript',
      'GraphQL',
      'Tailwind v4',
      'GSAP',
      'Lenis',
    ],
    live: null,
    repo: null,
    image: null,
  },
  {
    title: 'Cherry Muse',
    year: '2026',
    category: 'E-commerce',
    summary: 'Tienda con panel de administración propio, sobre Next.js y Supabase.',
    detail:
      'E-commerce de marca personal con catálogo dinámico, ficha de producto en modal, flujo de pedido y un panel admin para cargar productos. Backend con Supabase; parallax, scroll reveal y contadores animados en el frontend.',
    stack: ['Next.js 16', 'React 19', 'Supabase', 'TypeScript', 'Tailwind v4', 'Lenis'],
    live: null,
    repo: null,
    image: null,
  },
  {
    title: 'Portfolio v1',
    year: '2024',
    category: 'Web',
    summary: 'Primera versión del portfolio, en Astro.',
    detail:
      'Sitio multipágina con transiciones de vista nativas de Astro, secciones de perfil, currículum, portfolio y contacto. La base sobre la que se construyó esta versión.',
    stack: ['Astro', 'Tailwind', 'TypeScript'],
    live: null,
    repo: null,
    image: null,
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
    {title: 'Tatiana Storefront', thumbnail: '/images/sky-hero.jpg'},
    {title: 'Cherry Muse', thumbnail: '/images/sky-poster.jpg'},
    {title: 'Portfolio v1', thumbnail: '/images/sky-warm.jpg'},
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
    lead: 'Cada milisegundo, medido.',
    note: 'Velocidad y SEO técnico',
    body: 'Optimización de carga, estructura de URLs, metadatos y datos estructurados. Medición continua y ajustes hasta que los números cierran.',
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
      body: 'Carrito abandonado, recompra y flujos de retención que corren solos.',
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

   ⚠️ Revisá la fila `ecommerce`: viene del portfolio nuevo y hay ítems que no
   pude verificar contra tu experiencia (GA4, Shopify Functions, Klaviyo).
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
    'Hydrogen',
    'Metafields',
    'Shopify Functions',
    'Checkout Extensions',
    'Catálogos B2B',
    'GraphQL',
    'Klaviyo',
    'Webhooks',
    'Migraciones',
    'Core Web Vitals',
    'GA4',
  ],

  /** Fila inferior: base web, frameworks y herramientas */
  web: [
    'JavaScript',
    'TypeScript',
    'React',
    'Next.js',
    'Astro',
    'Remix',
    'Node.js',
    'Tailwind CSS',
    'HTML5',
    'CSS3',
    'GSAP',
    'Supabase',
    'Prisma',
    'WordPress',
    'Cypress',
    'Jest',
    'Git',
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
      texto: 'Construyo storefronts headless con *Hydrogen* sobre *Remix*, y cuando el proyecto pide tema nativo trabajo en *Liquid* con *metafields* y *Shopify CLI*. Sobre *Shopify Plus* extiendo el checkout con *Checkout Extensions* y *Shopify Functions*, armo *catálogos B2B* y muevo los datos con *GraphQL* y *webhooks*.',
    },
    {
      titulo: 'Fuera de Shopify',
      texto: '*React* y *Next.js* para producto, *Astro* para sitios que tienen que cargar rápido, y *Node.js* con *TypeScript* de punta a punta. Persistencia con *Supabase* y *Prisma*, y las pruebas con *Jest* y *Cypress*.',
    },
    {
      titulo: 'Lo que sostiene el resto',
      texto: 'Mido con *Core Web Vitals* y *GA4* para que las decisiones tengan un número atrás, automatizo el ciclo de vida del cliente con *Klaviyo*, y hago *migraciones* cuando hay que mudar una tienda sin perder nada en el camino.',
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
 * TODO: exportá tu CV a PDF, ponelo en public/ como cv.pdf y cambiá esto a
 * '/cv.pdf'. Mientras siga en null, el botón "Ver CV" no se renderiza —
 * preferible a un link que abre algo que no es un CV.
 */
export const cvUrl: string | null = null;

/* ── Experiencia ──────────────────────────────────────────────────────── */
export const experience = [
  {
    role: 'Frontend Developer',
    company: 'Sysgarage',
    place: 'Miami, USA · Buenos Aires, Argentina',
    period: '2021 — 2024',
    bullets: [
      'Implementé y refiné plataformas Shopify para mejorar la experiencia de usuario y aumentar la tasa de conversión.',
      'Integré APIs de terceros para ampliar funcionalidades: pagos, gestión de inventario y soporte al cliente.',
      'Desarrollé estrategias de keywords y optimicé metadatos y estructura de URLs para mejorar el posicionamiento.',
      'Optimicé la velocidad de carga de los sitios y monitoreé el rendimiento SEO con ajustes continuos.',
    ],
  },
  {
    role: 'Shopify Developer',
    company: 'Innovate Group — Shopify Experts',
    place: 'Rosario, Santa Fe, Argentina',
    period: '2020 — 2021',
    bullets: [
      'Creé plantillas personalizadas y dinámicas con Liquid, e implementé funcionalidades interactivas en JavaScript.',
      'Diseñé interfaces responsive con CSS, SASS y Bootstrap.',
      'Integré y configuré apps de terceros como Klaviyo para marketing automatizado; usé metafields para enriquecer las fichas de producto.',
      'Contribuí a múltiples proyectos de e-commerce con aumento notable de tráfico y crecimiento en conversiones.',
    ],
  },
] as const;

export const education = {
  title: 'Desarrollo Frontend',
  year: '2020',
  place: 'Buenos Aires, Argentina',
} as const;

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
