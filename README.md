# Portfolio — Tatiana Jael Saucedo

Portfolio personal construido con **Astro 5** + **Tailwind CSS v4**, siguiendo el
sistema de diseño **Air**: cielo nocturno a sangre completa, formas escultóricas
de vidrio, tipografía como marca y componentes planos sin sombras.

> **Nota sobre el tema.** El style reference declara `Theme: dark` y describe un
> *"midnight sky"*. El sitio de referencia (air.inc) en cambio es luminoso, y la
> primera versión de este portfolio lo siguió a él. Esta versión vuelve al
> documento: **tema oscuro**, cielo de noche.
>
> **Los tokens no cambiaron: cambiaron sus roles.** El tema claro decía "Ink es
> el texto, Whiteout la superficie de tarjeta, Black Void los bordes". El oscuro
> los espeja:
>
> | Token | Rol en claro | Rol en oscuro |
> |---|---|---|
> | Black Void | bordes y subrayados | **el lienzo de la página** |
> | Ink | texto sobre superficie clara | **tarjetas y secciones levantadas** |
> | Whiteout | superficie de tarjeta | **el texto y los bordes** |
> | Haze | lienzo de la página | hover del botón sólido |
> | Twilight Blue | eyebrow sobre blanco | sin uso — lo reemplaza Twilight Mist |
>
> Por eso las secciones de cielo no necesitaron un solo cambio de color: ya
> escribían en Whiteout sobre fondo profundo. El resto del sitio se acomodó a
> ellas, no al revés.
>
> Se agregaron solo dos tokens, los que el tema claro no necesitaba:
> `--color-twilight-mist` (el eyebrow, porque Twilight Blue mide 3,30:1 sobre el
> lienzo negro y no llega a AA) y `--color-ink-raised` (la tarjeta apoyada sobre
> una sección Ink, donde Ink sobre Ink desaparecería).
>
> **Qué da y qué no da un archivo de tokens.** Da el vocabulario: colores,
> tipografías, escalas, radios, reglas de componentes. No da la fotografía, ni la
> composición, ni el movimiento, ni el contenido. Esa parte se construyó acá a
> mano, y es la que explica por qué un mismo set de tokens puede producir dos
> sitios que no se parecen en nada.

---

## Arrancar

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # chequeo de tipos + build estático a dist/
npm run preview  # servir dist/ localmente
```

---

## Dónde se edita cada cosa

**Todo el contenido vive en un solo archivo: `src/data/site.ts`.**
No hace falta tocar los `.astro` para actualizar textos.

| Qué querés cambiar | Dónde |
|---|---|
| Nombre, rol, email, dominio | `site` en `src/data/site.ts` |
| Links a redes | `socials` |
| Texto del hero | `hero` |
| Frase poster gigante | `statement` |
| Proyectos (título, stack, links, imagen) | `projects` |
| Servicios | `services` |
| Stack técnico (las dos marquesinas) | `skills.ecommerce` y `skills.web` |
| Bio y foto | `about` |
| Experiencia laboral y formación | `experience`, `education` |
| Textos de contacto y endpoint del form | `contact` |
| Colores, tipografías, espaciados | `src/styles/global.css` (bloque `@theme`) |
| Los tokens crudos del sistema | `design-tokens.json` (ver abajo) |

### Buscá los `TODO` antes de publicar

```bash
grep -n "TODO" src/data/site.ts
```

Hay seis cosas sin verificar que dependen de vos:

1. **`site.url`** — el dominio real donde vas a deployar (afecta canonical y OG).
2. **`projects[].live` y `projects[].repo`** — casi todos están en `null`. Cuando
   tengas las URLs de producción o los repos públicos, cargalas y los links
   aparecen solos.
3. **`contact.formEndpoint`** — ver abajo.
4. **`cvUrl`** — está en `null`, así que el botón "Ver CV" no se muestra.
5. **El `year` de los tres proyectos de cliente** — están en `'2021 — 2024'`, que
   es tu período en Sysgarage, no la fecha real de cada proyecto. Ajustalos.
6. **`skills.ecommerce`** — la fila salió de fusionar dos listas y hay ítems que
   no pude verificar contra tu experiencia. Borrá lo que no uses de verdad.
   El `cv.png` que había en el portfolio viejo era una imagen de 420×372 px, no un
   CV: exportá el tuyo a PDF, ponelo en `public/cv.pdf` y cambiá `cvUrl` a `'/cv.pdf'`.

---

## Formulario de contacto

Hoy `formEndpoint` está en `null`. Con ese valor, al enviar se abre tu cliente de
mail con asunto y cuerpo precargados — nunca queda un botón que no hace nada.

Para recibir los mensajes por mail sin backend:

1. Creá un form en [formspree.io](https://formspree.io) con `tatijael@gmail.com`.
2. Pegá el endpoint en `src/data/site.ts`:
   ```ts
   formEndpoint: 'https://formspree.io/f/xxxxxxx',
   ```

El form ya trae un honeypot (`_gotcha`) contra bots, que Formspree reconoce.

---

## Imágenes

### El fondo de las secciones grandes: grilla, no fotografía

Hero, poster y contacto usan una **grilla hairline en CSS**, no imágenes. Tres
variantes para dar ritmo sin cambiar de vocabulario:

| Clase | Dónde | Trama |
|---|---|---|
| `.air-grid` | Hero | Líneas cada 64px, Whiteout al 7%, sobre Black Void |
| `.air-grid--wide` | Poster | Líneas cada 132px, Whiteout al 6%, sobre Black Void |
| `.air-dots` | Contacto | Puntos cada 26px, Whiteout al 14%, sobre Black Void |

Viven en la misma capa `::before` que usaban las fotos, así que **heredan el
parallax**: la grilla deriva lento y da profundidad sin una sola imagen. Las
velocidades bajaron de 0.10–0.14 a 0.04–0.05, porque una grilla desplazándose
rápido se lee como jitter, no como profundidad.

Todas se desvanecen hacia los bordes con `mask-image` para no cortar en seco
contra la sección siguiente.

**Sobre la regla "sin gradientes":** estos `linear-gradient` tienen paradas duras
y dibujan trazos de 1px — es la técnica estándar para una grilla en CSS. El
resultado visual es línea, no relleno degradado. La regla del sistema apunta a no
simular profundidad con degradados de color, y eso se sigue respetando.

**Contraste:** Whiteout sobre Black Void mide 21:1, el máximo posible. A
diferencia de la fotografía, acá no hace falta medir caso por caso ni aplicar
velos.

### Los cielos (solo en tarjetas y galería)

Las fotos siguen existiendo, pero ya no como fondo de sección: quedaron en las
tarjetas de proyecto y en la galería, como relleno hasta que haya capturas reales.

Son **fotografías reales CC0** de Wikimedia Commons. Ver `CREDITS.md` para el
origen de cada una y por qué se recortó como se recortó.

| Archivo | Dónde se usa | Peso |
|---|---|---|
| `sky-hero.jpg` | hero (`.air-sky`) y poster (`.air-sky--low`, mismo cielo reencuadrado abajo) | 212 KB |
| `sky-warm.jpg` | contacto (`.air-sky-warm`) | 175 KB |
| `sky-poster.jpg` | tarjetas de proyecto, **sin texto encima** | 500 KB |
| `glass-forms.svg` | escultura de vidrio sobre el poster (`.air-drift`) | 1 KB |

Para reemplazarlas, cambiá estas reglas en `src/styles/global.css`:

```css
.air-sky::before      { background-image: url('/images/tu-cielo.jpg'); }
.air-sky-warm::before { background-image: url('/images/tu-atardecer.jpg'); }
```

### Medí antes de cambiar una foto

Esta es la parte que más trabajo dio y la que más fácil se rompe. Una foto linda
puede ser ilegible: lo que importa no es su aspecto general sino **el píxel más
extremo debajo de cada bloque de texto**.

El método, que podés repetir en la consola del navegador:

1. Dibujá la foto en un `<canvas>` con la misma lógica de `background-size: cover`.
2. Pintá encima el velo que use la sección (`.air-veil` o `.air-bleed--scrim`).
3. Recorré los píxeles del rectángulo que ocupa cada texto y quedate con **el
   peor** contraste, no con el promedio.
4. Exigí 4.5:1 para texto normal y 3:1 para texto grande (≥24px, o ≥18.7px bold).

Lo que salió de medir las fotos actuales:

- **Hero, texto Ink, sin velo:** 10.9:1 a 12.4:1. Probé antes el camino
  contrario —texto blanco— y el subtítulo de 16px necesitaba un velo de **0.64**
  de opacidad para llegar a 4.5:1; con ese velo la foto dejaba de ser luminosa,
  que es justo lo que le da carácter. Por eso el hero es Ink.
- **Contacto:** el punto más oscuro daba 4.16:1, apenas por debajo. `.air-veil`
  (12% blanco) lo lleva a 4.82:1.
- **`sky-poster.jpg` no lleva texto encima nunca.** Tiene rango dinámico
  extremo: en cualquier recorte conviven píxeles casi blancos y casi negros, así
  que ningún color de texto llega a AA. Por eso las tarjetas de proyecto muestran
  la imagen sola y el título va debajo, en la tarjeta.

### Parallax

Las secciones fotográficas llevan `data-parallax="0.14"` (el número es la
fracción de la altura de la sección que se desplaza la capa). El motor está en
`src/layouts/Layout.astro`.

Tres detalles de implementación que conviene no romper:

- La foto vive en un `::before` con `inset: -12% 0`, más alto que la sección, para
  que al desplazarse no descubra el borde.
- Se anima `transform` vía la custom property `--parallax`, no
  `background-position`: así el trabajo queda en el compositor y no repinta.
- La visibilidad se chequea con `getBoundingClientRect` y **no** con
  `IntersectionObserver`. Con este puñado de capas cuesta menos, y sobre todo no
  depende de que el navegador entregue callbacks de IO — Chrome los frena en
  pestañas de fondo y ahí el parallax quedaba congelado.

Sobre el poster hay una segunda capa (`.air-drift`, la escultura de vidrio) con
velocidad **negativa**: deriva en sentido contrario al cielo. Todo se desactiva
bajo `prefers-reduced-motion`.

### El retrato que gira en el hero

El giro es **scrubbing de frames**, no una animación: cada posición del scroll
muestra un frame distinto de una secuencia, y el giro lo hace el material
filmado. El componente es `src/components/react/ScrollSpin.tsx` y se configura
en `heroSpin` (`site.ts`).

Con una sola foto el efecto **no existe**: nada puede inventar el otro lado de
una persona. Por eso el componente tiene dos modos, y elige solo según cuántos
frames le pases:

| `frameCount` | Modo | Qué se ve |
|---|---|---|
| `0` | Foto | `poster` pivota ±20° en 3D con el scroll. Es el gesto, no el efecto. |
| `> 1` | Secuencia | El giro real, frame por frame, dibujado en un canvas. |

**Para pasar al modo secuencia:**

1. Grabá 4–6 segundos girando sobre vos misma. Cámara fija, pared lisa, luz
   pareja, giro lento y constante.
2. Extraé los frames ya achicados — se descargan todos, así que el peso importa:

   ```bash
   mkdir -p public/images/spin
   ffmpeg -i giro.mp4 -vf "fps=12,scale=520:-1" -q:v 6 \
     public/images/spin/frame-%03d.jpg
   ```

   12 fps × 5 s = 60 frames de ~25 KB → ~1,5 MB. Si te pasás de 2 MB, bajá el
   `fps` antes que la resolución: el giro tolera menos frames mucho mejor que
   una imagen borrosa.
3. Contá los archivos y poné ese número en `heroSpin.frameCount`.

Los frames tienen que medir **todos lo mismo**: el canvas toma su tamaño del
primero que llega, y si los siguientes cambian de proporción, el retrato salta
de ancho a mitad del giro.

Bajo `prefers-reduced-motion` se queda quieto en el primer frame, en los dos
modos.

### Capturas de proyectos

Mientras `projects[].image` sea `null`, cada card muestra un tile atmosférico con
el título en tipografía comprimida. Para usar una captura real:

1. Poné el archivo en `public/images/` (ej. `storefront.jpg`, ~1600px de ancho).
2. En `site.ts`: `image: '/images/storefront.jpg'`.

---

## Tipografías

El sistema Air nombra cuatro cortes propietarios. Acá están sustituidos por
equivalentes libres, instalados como paquetes (sin requests a Google Fonts):

| Air | Sustituto | Uso |
|---|---|---|
| Control | Inter Variable | Body, nav, botones, links |
| Control Compressed | Anton | Display gigante en mayúsculas |
| Control Cursive | Caveat | La palabra en itálica dentro del headline |
| Control TNT | Inter Variable | Headlines upright |

Si algún día comprás las fuentes reales: cambiá los `@import` del principio de
`global.css` y los valores `--font-*` del bloque `@theme`. Nada más se toca.

---

## `design-tokens.json` — la fuente de verdad

En la raíz está el export de tokens del sistema Air en formato
[DTCG](https://tr.designtokens.org/format/) (`$value` / `$type` / `$description`),
tal cual salió de la extracción de air.inc. Es la referencia contra la que se
audita el CSS.

`src/styles/global.css` es su traducción a CSS: **cada token del JSON existe como
variable CSS con el mismo nombre**.

| Nodo del JSON | Prefijo en CSS |
|---|---|
| `color.*` | `--color-*` |
| `surface.*` | `--surface-*` |
| `font.*` | `--font-*` |
| `spacing.*` | `--spacing-*` (+ `--spacing-unit`) |
| `radius.*` | `--radius-md`, `--radius-lg`, `--radius-lg-2`, `--radius-xl` |
| `typography.*` | clases `.type-*` |

### Los pasos tipográficos

El nodo `typography` no define tamaños sueltos sino **pasos**: familia + tamaño +
peso + interlineado juntos. Están traducidos uno a uno a clases:

```
.type-xs      Control 12px/500/1.5      .type-3xl     Cursive 32px/500/1.1
.type-xs-2    Control 12px/500/1.1      .type-3xl-2   TNT 32px/500/1.1
.type-sm      Control 13px/500/1.5      .type-5xl     TNT 56px/400/1
.type-sm-2    Control 14px/500/1.5      .type-5xl-2   Cursive 56px/400/1
.type-base    Control 16px/500/1.5      .type-5xl-3   Compressed 259px/900/0.85
.type-xl      TNT 20px/500/1.5
.type-xl-2    Cursive 20px/500/1.5
.type-xl-3    Control 20px/500/1.4
```

Usalas cuando el paso aplique tal cual (`.type-xl-3` para títulos de card,
`.type-sm` para links de nav). Cuando necesites un tamaño fluido o un peso
distinto al del paso, usá las utilidades de Tailwind (`text-body`,
`text-heading-lg-fluid`, etc.), que salen del mismo `@theme`.

> ⚠️ El bloque está declarado como **`@theme static`**. Sin `static`, Tailwind
> hace tree-shaking y borra del CSS final cualquier token que ninguna clase use
> — `--surface-*` y `--radius-md` desaparecían. No le saques el `static` si
> querés que el JSON y el CSS sigan siendo equivalentes.

### Dos detalles donde el JSON y el markdown del style reference no coinciden

1. **Radios.** El JSON tiene solo `md/lg/lg-2/xl` (4/8/11/14px). El markdown suma
   radios semánticos: cards 12px, pills 9999px. El CSS tiene los dos juegos.
2. **Peso del paso de 56px.** El JSON dice `fontWeight: 400`; el *Agent Prompt
   Guide* del markdown dice "Control TNT weight 500 at 56px". Los headlines del
   sitio usan **500**, siguiendo el prompt guide. `.type-5xl` sí respeta el 400
   del JSON, por si querés el otro criterio.

### Escala de espaciado: por qué vive fuera de `@theme`

Tailwind v4 usa `--spacing: 4px` como multiplicador (`gap-6` → 24px). Si
`--spacing-4: 4px` se declarara dentro de `@theme`, pisaría ese multiplicador y
`gap-4` pasaría a valer 4px en vez de 16px, rompiendo todo el layout. Por eso los
`--spacing-N` nombrados están en un `:root` aparte, y se consumen como
`py-[var(--spacing-120)]`.

---

## Componentes portados desde el storefront

Cuatro componentes vienen de `tatiana-storefront`. Ninguno dependía de Shopify:
solo de React y `motion/react`, así que fueron portables casi tal cual. Viven en
`src/components/react/` y se montan como **islas** (`client:visible`): se hidratan
recién cuando entran en viewport.

| Componente | Dónde | Qué cambió al portarlo |
|---|---|---|
| `CardStack` | Proyectos | Se fueron los halos difuminados y el `shadow-xl`; borde hairline y radio del sistema. La tarjeta pasó de "texto blanco sobre foto con degradado" a imagen arriba + texto Whiteout sobre superficie Ink debajo. |
| `ContainerScroll` | Showcase | Se fue el `boxShadow` de seis capas. El marco #222 con borde de 4px pasó a superficie Ink con hairline Whiteout. |
| `HeroParallax` | Galería | Copy sacado a `site.ts`; sin velo negro ni texto blanco sobre foto (ahora placa Ink + Whiteout); y se corrigió el mapeo de scroll — ver abajo. |
| `RevealText` | Poster | Sin cambios. Ya respetaba `prefers-reduced-motion`. |

### El costo real en JS

Antes de esto el sitio no enviaba **nada** de JS de framework. Ahora, si el
visitante recorre la página entera:

| Chunk | gzip |
|---|---|
| React DOM (runtime de cliente) | 58,6 KB |
| `motion` | 40,3 KB |
| **GSAP + SplitText + ScrollTrigger (`RevealText`)** | **49,3 KB** |
| CardStack | 4,7 KB |
| Resto (transform, parallax, scroll) | 9,7 KB |
| **Total** | **~163 KB** |

Vale la pena mirarlo con calma: **`RevealText` cuesta 49 KB gzip para animar una
sola línea de texto**, casi lo mismo que React entero. El reveal que ya tenía el
sitio hace algo parecido en CSS puro y pesa 0.

Y hay un segundo problema, más serio que el peso. `gsap.from()` **oculta el texto
primero** y lo revela solo si la animación llega a completarse. Si ScrollTrigger
no dispara —pestaña en segundo plano, error de JS, carga lenta— el titular queda
invisible o desplazado a mitad de camino. Lo verifiqué: las palabras quedaron en
`opacity: 0.14` y trasladadas 226px hacia abajo, con el texto presente en el DOM
pero sin verse.

El reveal en CSS tiene el default opuesto: si el JS no corre, el contenido se ve.
Para un titular que es el momento de mayor impacto de la página, esa diferencia
pesa más que la animación.

Para sacarlo: borrá el `<RevealText>` de `Statement.astro` y dejá `{statement.line}`
directo. Se van 49 KB y GSAP entero del `package.json`.

### El arreglo de HeroParallax

El original era un hero de página completa y usaba
`offset: ['start start', 'end start']`, que asume que la sección arranca pegada al
tope del viewport. Colocado a mitad de página el progreso se desfasaba y la
sección quedaba casi vacía. Ahora usa `['start end', 'end start']`, que corre
mientras la sección cruza la pantalla, con recorridos más cortos (±260px en vez
de ±1000px).

Está pensado para **~15 imágenes**. Con menos las repite en ciclo: no se rompe,
pero se nota. Cargá capturas reales en `gallery.items` dentro de `site.ts`.

---

## El logo

Es un wordmark corto en Control Cursive (`Tati`), no el nombre completo en la
tipografía de interfaz — el equivalente al script "Air" de air.inc. Se edita en
`site.logoMark` dentro de `src/data/site.ts`.

Tiene dos movimientos, ambos anulados bajo `prefers-reduced-motion`:

- **Al cargar** se dibuja de izquierda a derecha (`clip-path` + rotación leve).
- **Al pasar el mouse** escala 6% y se inclina 2.5°.

En el tema claro cambiaba de color al scrollear: Whiteout sobre el cielo, Ink
apenas la nav ganaba fondo, porque abajo del hero empezaban las secciones claras.
En oscuro no hay a qué invertir — el sitio entero es fondo profundo — así que la
nav se queda en Whiteout todo el recorrido. `[data-scrolled]` en `Nav.astro`
sigue existiendo, pero ahora solo enciende la barra esmerilada oscura que la
despega de lo que pasa por debajo.

---

## Reglas del sistema Air (no las rompas sin querer)

- **Sin sombras.** Las superficies se distinguen por color de fondo y bordes de 1px.
- **Sin gradientes en la UI.** La profundidad viene de la fotografía y el contraste
  plano. Los degradados que hay están *dentro* de las imágenes de cielo y en el
  scrim fotográfico — tratamiento de imagen, no chrome de interfaz.
- **Sin botones sólidos de color.** Solo *ghost* (transparente + borde Whiteout) o
  *light* (relleno Whiteout, que sobre lienzo negro es el elemento más brillante
  de la página — justo lo que se le pide a un CTA primario). Las variantes
  `--on-sky` se conservan porque los componentes las nombran, pero en oscuro ya
  no hacen diferencia visual: todo el sitio es "sobre el cielo" ahora.
- **Una sola palabra en cursiva por headline.** Más de una y el gesto se muere.
- **Radios fijos:** 4px inputs · 8px botones · 11–14px cards e imágenes · pill solo
  en filtros.
- **Body nunca por debajo de 16px** ni por encima de peso 500.

### El caso de Signal Blue

**Acá está el pago del tema oscuro.** En claro, el acento saturado del sistema no
se podía usar: `#2b7fff` sobre blanco mide **3.76:1**, por debajo del 4.5:1 que
pide WCAG AA para texto normal, así que `.air-link` tenía que quedarse en Ink y
`--signal` era decorativo.

Sobre el lienzo oscuro mide **5.58:1**, y **4.58:1** sobre una tarjeta Ink. Las
dos pasan AA, así que `.air-link--signal` por fin sirve donde el sistema quería
usarlo — sin tocar el token ni aceptar un contraste flojo.

El default de `.air-link` sigue siendo Whiteout, que en oscuro cumple el rol que
tenía Ink. Sigue valiendo la regla de **un solo acento saturado por página**:
poné `--signal` en el link que importa, no en todos.

### Clases del sistema

En `src/styles/global.css`, bajo `@layer components`: `.air-btn-ghost`
(+`--on-sky`), `.air-btn-light` (+`--bordered`), `.air-pill`, `.air-link`
(+`--signal`, `--white`), `.air-card` (+`--haze`), `.air-card-glass`,
`.air-image`, `.air-input`, `.air-display`, `.air-cursive`, `.air-eyebrow`,
`.air-logo`, `.air-container`, `.air-bleed` (+`--scrim`), `.air-sky`,
`.air-sky-warm`, `.air-glass`.

---

## Estructura

```
design-tokens.json         ← tokens del sistema Air en formato DTCG
src/
├── data/site.ts           ← TODO el contenido
├── styles/global.css      ← tokens Air + componentes
├── layouts/Layout.astro   ← head, SEO, JSON-LD, reveal on scroll
├── components/
│   ├── Nav.astro          ← barra de 72px + menú mobile
│   ├── Hero.astro         ← full-bleed + headline dual-style
│   ├── Projects.astro     ← filtro por categoría + grid
│   ├── ProjectCard.astro  ← Haze card
│   ├── Statement.astro    ← display 259px a sangre
│   ├── About.astro        ← bio + experiencia
│   ├── Services.astro     ← servicios + stack
│   ├── Contact.astro      ← form + CTAs
│   ├── Footer.astro
│   └── ui/                ← Button, DualHeadline, SectionHeader
└── pages/index.astro
```

---

## Accesibilidad y performance

- Salto al contenido, `:focus-visible` visible, labels reales en todos los inputs.
- Las animaciones de entrada respetan `prefers-reduced-motion`.
- Sin JS, la página se ve completa: el reveal solo se activa si hay JavaScript.
- Cero requests externos: fuentes y texturas son locales.
- JSON-LD de tipo `Person` + Open Graph configurados.

Pendiente cuando definas el dominio: generar una imagen `og:image` de 1200×630 y
sumarla en `src/layouts/Layout.astro`.

---

## Deploy

Es un sitio estático (`dist/`). Funciona sin configuración en:

- **Vercel** — importá el repo, detecta Astro solo.
- **Netlify** — build: `npm run build`, publish: `dist`.
- **Cloudflare Pages** — igual que Netlify.

Antes de publicar, actualizá `site` en `astro.config.mjs` y `site.url` en
`src/data/site.ts` con el dominio real.
