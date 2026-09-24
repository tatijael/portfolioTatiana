import {useRef, type ReactNode} from 'react';
import {motion, useReducedMotion} from 'motion/react';
import {useScrollProgress, lerp} from './useScrollProgress';

/**
 * ScrollExpandMedia — una pieza (foto o video) que arranca chica en el centro
 * de la pantalla y se abre a pantalla completa a medida que scrolleás,
 * mientras el título se parte en dos y se va hacia los costados y el fondo se
 * desvanece. Cuando terminó de abrirse, aparece el contenido de abajo.
 *
 * Portado del componente de 21st.dev, con tres cambios de fondo:
 *
 * 1. NEXT.JS → ASTRO. Sin `"use client"` ni `next/image`: es una isla React
 *    dentro de un sitio Astro, así que el <img> es nativo y el componente se
 *    hidrata cuando el navegador queda libre (`client:idle`).
 *
 * 2. FRAMER-MOTION → motion/react, que es el paquete que ya usa el proyecto.
 *    Es la misma librería con otro nombre; no hace falta instalar nada.
 *
 * 3. EL SCROLL NO SE SECUESTRA. El original escuchaba `wheel` con
 *    preventDefault y forzaba `window.scrollTo(0, 0)` hasta terminar de
 *    expandirse: la página quedaba clavada y el usuario perdía el control del
 *    scroll. Acá el progreso se mide sobre el scroll real (useScrollProgress,
 *    el mismo motor del resto del sitio), con una sección alta y un escenario
 *    `sticky` adentro. El efecto se ve igual, pero el scroll sigue siendo del
 *    usuario y convive con Lenis, el nav fijo y los anchors.
 *
 * Respeta `prefers-reduced-motion`: ahí la pieza se muestra abierta y quieta.
 */
export type ScrollExpandMediaProps = {
  mediaType?: 'video' | 'image';
  /** Ruta de la foto o del video (en public/). */
  mediaSrc: string;
  /** Poster del video, mientras carga. */
  posterSrc?: string;
  /** Fondo a pantalla completa que se desvanece al abrirse la pieza. */
  bgImageSrc?: string;
  title?: string;
  /** Línea chica arriba del título (año, categoría, lo que sea). */
  date?: string;
  /** Pista para el usuario: "Scrolleá para abrir". */
  scrollToExpand?: string;
  /** Mezcla el título con lo que tiene detrás, como el original. */
  textBlend?: boolean;
  /** Alto del recorrido de scroll que dura la apertura. */
  scrollLength?: string;
  children?: ReactNode;
};

export default function ScrollExpandMedia({
  mediaType = 'image',
  mediaSrc,
  posterSrc,
  bgImageSrc,
  title,
  date,
  scrollToExpand,
  textBlend = false,
  scrollLength = '220vh',
  children,
}: ScrollExpandMediaProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // La apertura ocupa la primera mitad del recorrido: cuando la sección queda
  // centrada, la pieza ya está abierta y lo que sigue se lee sin animación.
  const raw = useScrollProgress(trackRef, {from: 0.08, to: 0.55});
  const p = reduceMotion ? 1 : raw;

  const firstWord = title ? title.split(' ')[0] : '';
  const restOfTitle = title ? title.split(' ').slice(1).join(' ') : '';

  // De 300×400 en el centro a casi toda la pantalla.
  const width = `calc(${lerp(300, 0, p)}px + ${p} * 94vw)`;
  const height = `calc(${lerp(400, 0, p)}px + ${p} * 84vh)`;
  const spread = p * 14; // cuánto se abren las dos mitades del título, en vw

  return (
    <div ref={trackRef} className="relative" style={{height: scrollLength}}>
      <div className="sticky top-0 flex h-svh w-full items-center justify-center overflow-hidden">
        {/* Fondo a pantalla completa: se apaga a medida que la pieza se abre,
            así el degradado del sitio queda como único fondo al final.
            El velo pasó de negro a Canvas con el tema claro: lo que hace es
            acercar la imagen al lienzo, y el lienzo ahora es papel. */}
        {bgImageSrc ? (
          <motion.div
            className="absolute inset-0 z-0"
            animate={{opacity: 1 - p}}
            transition={{duration: 0.1}}
            aria-hidden="true"
          >
            <img
              src={bgImageSrc}
              alt=""
              className="h-full w-full object-cover object-center"
              draggable={false}
            />
            <div className="absolute inset-0 bg-canvas/40" />
          </motion.div>
        ) : null}

        {/* La pieza */}
        <div
          className="absolute z-10 overflow-hidden rounded-[var(--radius-images)]"
          style={{width, height, maxWidth: '94vw', maxHeight: '84vh'}}
        >
          {mediaType === 'video' ? (
            <video
              src={mediaSrc}
              poster={posterSrc}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              controls={false}
              disablePictureInPicture
              className="h-full w-full object-cover"
            />
          ) : (
            <img
              src={mediaSrc}
              alt={title ?? ''}
              className="h-full w-full object-cover"
              draggable={false}
            />
          )}
          {/* Velo que se levanta con la apertura: al principio la pieza es una
              silueta oscura, al final se ve limpia. */}
          <motion.div
            className="absolute inset-0 bg-canvas"
            animate={{opacity: 0.55 - p * 0.55}}
            transition={{duration: 0.2}}
            aria-hidden="true"
          />
        </div>

        {/* Título: dos mitades que se van a los costados */}
        <div
          className={`relative z-20 flex w-full flex-col items-center gap-3 text-center ${
            textBlend ? 'mix-blend-difference' : ''
          }`}
        >
          {date ? (
            <p
              className="air-eyebrow"
              style={{transform: `translateX(-${spread}vw)`}}
            >
              {date}
            </p>
          ) : null}

          {title ? (
            <h2 className="flex flex-col items-center gap-1 font-control-tnt text-heading-lg-fluid font-medium text-ink">
              <span style={{transform: `translateX(-${spread}vw)`}}>
                {firstWord}
              </span>
              <span style={{transform: `translateX(${spread}vw)`}}>
                {restOfTitle}
              </span>
            </h2>
          ) : null}

          {scrollToExpand ? (
            <motion.p
              className="text-caption font-medium text-ink/70"
              animate={{opacity: 1 - p * 2}}
              transition={{duration: 0.2}}
              style={{transform: `translateX(${spread}vw)`}}
            >
              {scrollToExpand}
            </motion.p>
          ) : null}
        </div>
      </div>

      {children ? (
        <motion.div
          className="relative z-10"
          animate={{opacity: p >= 0.95 ? 1 : 0}}
          transition={{duration: 0.7}}
        >
          {children}
        </motion.div>
      ) : null}
    </div>
  );
}
