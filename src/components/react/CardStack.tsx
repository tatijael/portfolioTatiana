import * as React from 'react';
import {motion, AnimatePresence, useReducedMotion} from 'motion/react';
import {SquareArrowOutUpRight} from 'lucide-react';

/**
 * CardStack: carrusel en abanico 3D con tarjetas que rotan, se solapan y se
 * pueden arrastrar (drag) o navegar con teclado.
 *
 * Adaptado a Shopify Hydrogen + React Router 7:
 *   - `framer-motion` -> `motion/react` (mismo paquete que ya usa el proyecto).
 *   - `next/link` -> <a> nativo (los href del demo son externos, target _blank).
 *   - Tokens shadcn (foreground/muted-foreground/secondary) -> tokens de la
 *     marca (surface / ink / rosewood), que sí existen en global.css.
 *   - Sin la directiva "use client" de Next.js.
 */
function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(' ');
}

export type CardStackItem = {
  id: string | number;
  title: string;
  description?: string;
  /** Línea técnica corta (stack), debajo de la descripción */
  meta?: string;
  imageSrc?: string;
  href?: string;
  ctaLabel?: string;
  tag?: string;
};

export type CardStackProps<T extends CardStackItem> = {
  items: T[];

  /** Selected index on mount */
  initialIndex?: number;

  /** How many cards are visible around the active (odd recommended) */
  maxVisible?: number;

  /** Card sizing */
  cardWidth?: number;
  cardHeight?: number;

  /** How much cards overlap each other (0..0.8). Higher = more overlap */
  overlap?: number;

  /** Total fan angle (deg). Higher = wider arc */
  spreadDeg?: number;

  /** 3D / depth feel */
  perspectivePx?: number;
  depthPx?: number;
  tiltXDeg?: number;

  /** Active emphasis */
  activeLiftPx?: number;
  activeScale?: number;
  inactiveScale?: number;

  /** Motion */
  springStiffness?: number;
  springDamping?: number;

  /** Behavior */
  loop?: boolean;
  autoAdvance?: boolean;
  intervalMs?: number;
  pauseOnHover?: boolean;

  /** UI */
  showDots?: boolean;
  className?: string;

  /** Hooks */
  onChangeIndex?: (index: number, item: T) => void;

  /** Custom renderer (optional) */
  renderCard?: (item: T, state: {active: boolean}) => React.ReactNode;
};

function wrapIndex(n: number, len: number) {
  if (len <= 0) return 0;
  return ((n % len) + len) % len;
}

/** Minimal signed offset from active index to i, with wrapping (for loop behavior). */
function signedOffset(i: number, active: number, len: number, loop: boolean) {
  const raw = i - active;
  if (!loop || len <= 1) return raw;

  // consider wrapped alternative
  const alt = raw > 0 ? raw - len : raw + len;
  return Math.abs(alt) < Math.abs(raw) ? alt : raw;
}

export function CardStack<T extends CardStackItem>({
  items,
  initialIndex = 0,
  maxVisible = 7,

  cardWidth = 520,
  cardHeight = 320,

  overlap = 0.48,
  spreadDeg = 48,

  perspectivePx = 1100,
  depthPx = 140,
  tiltXDeg = 12,

  activeLiftPx = 22,
  activeScale = 1.03,
  inactiveScale = 0.94,

  springStiffness = 280,
  springDamping = 28,

  loop = true,
  autoAdvance = false,
  intervalMs = 2800,
  pauseOnHover = true,

  showDots = true,
  className,

  onChangeIndex,
  renderCard,
}: CardStackProps<T>) {
  const reduceMotion = useReducedMotion();
  const len = items.length;

  const [active, setActive] = React.useState(() =>
    wrapIndex(initialIndex, len),
  );
  const [hovering, setHovering] = React.useState(false);

  // keep active in bounds if items change
  React.useEffect(() => {
    setActive((a) => wrapIndex(a, len));
  }, [len]);

  React.useEffect(() => {
    if (!len) return;
    onChangeIndex?.(active, items[active]!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const maxOffset = Math.max(0, Math.floor(maxVisible / 2));

  const cardSpacing = Math.max(10, Math.round(cardWidth * (1 - overlap)));
  const stepDeg = maxOffset > 0 ? spreadDeg / maxOffset : 0;

  const canGoPrev = loop || active > 0;
  const canGoNext = loop || active < len - 1;

  const prev = React.useCallback(() => {
    if (!len) return;
    if (!canGoPrev) return;
    setActive((a) => wrapIndex(a - 1, len));
  }, [canGoPrev, len]);

  const next = React.useCallback(() => {
    if (!len) return;
    if (!canGoNext) return;
    setActive((a) => wrapIndex(a + 1, len));
  }, [canGoNext, len]);

  // keyboard navigation (when container focused)
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  };

  // autoplay
  React.useEffect(() => {
    if (!autoAdvance) return;
    if (reduceMotion) return;
    if (!len) return;
    if (pauseOnHover && hovering) return;

    const id = window.setInterval(
      () => {
        if (loop || active < len - 1) next();
      },
      Math.max(700, intervalMs),
    );

    return () => window.clearInterval(id);
  }, [
    autoAdvance,
    intervalMs,
    hovering,
    pauseOnHover,
    reduceMotion,
    len,
    loop,
    active,
    next,
  ]);

  if (!len) return null;

  const activeItem = items[active]!;

  return (
    <div
      className={cn('w-full', className)}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Stage */}
      {/* `overflow-x: clip` y no `hidden`: el abanico abre las tarjetas más
          allá del ancho del contenedor —esa es la gracia— y sin esto la
          tarjeta más a la derecha empujaba el ancho del documento y dejaba
          scroll horizontal en toda la página. `clip` recorta sin crear un
          contenedor de scroll, y sin tocar el eje vertical, que es por donde
          las tarjetas se levantan. */}
      <div
        className="relative w-full [overflow-x:clip]"
        style={{height: Math.max(380, cardHeight + 80)}}
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        {/* Los halos difuminados del original se quitaron a propósito:
            el sistema Air no usa sombras ni glows. Las tarjetas se separan
            del fondo por superficie y hairline, no por elevación. */}

        <div
          className="absolute inset-0 flex items-end justify-center"
          style={{
            perspective: `${perspectivePx}px`,
          }}
        >
          <AnimatePresence initial={false}>
            {items.map((item, i) => {
              const off = signedOffset(i, active, len, loop);
              const abs = Math.abs(off);
              const visible = abs <= maxOffset;

              // hide far-away cards cleanly
              if (!visible) return null;

              // fan geometry
              const rotateZ = off * stepDeg;
              const x = off * cardSpacing;
              const y = abs * 10; // subtle arc-down feel
              const z = -abs * depthPx;

              const isActive = off === 0;

              const scale = isActive ? activeScale : inactiveScale;
              const lift = isActive ? -activeLiftPx : 0;

              const rotateX = isActive ? 0 : tiltXDeg;

              const zIndex = 100 - abs;

              // drag only on the active card
              const dragProps = isActive
                ? {
                    drag: 'x' as const,
                    dragConstraints: {left: 0, right: 0},
                    dragElastic: 0.18,
                    onDragEnd: (
                      _e: any,
                      info: {offset: {x: number}; velocity: {x: number}},
                    ) => {
                      if (reduceMotion) return;
                      const travel = info.offset.x;
                      const v = info.velocity.x;
                      const threshold = Math.min(160, cardWidth * 0.22);

                      // swipe logic
                      if (travel > threshold || v > 650) prev();
                      else if (travel < -threshold || v < -650) next();
                    },
                  }
                : {};

              return (
                <motion.div
                  key={item.id}
                  className={cn(
                    'absolute bottom-0 overflow-hidden rounded-[var(--radius-cards)] border border-ink/12 bg-surface',
                    'will-change-transform select-none',
                    isActive
                      ? 'cursor-grab active:cursor-grabbing'
                      : 'cursor-pointer',
                  )}
                  style={{
                    width: cardWidth,
                    height: cardHeight,
                    zIndex,
                    transformStyle: 'preserve-3d',
                  }}
                  initial={
                    reduceMotion
                      ? false
                      : {
                          opacity: 0,
                          y: y + 40,
                          x,
                          rotateZ,
                          rotateX,
                          scale,
                        }
                  }
                  animate={{
                    opacity: 1,
                    x,
                    y: y + lift,
                    rotateZ,
                    rotateX,
                    // framer doesn't support translateZ directly in animate on all setups,
                    // so we use a custom transform via style below.
                    scale,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: springStiffness,
                    damping: springDamping,
                  }}
                  // translateZ via style transform (kept stable w/ motion values above)
                  // We apply translateZ by using a CSS transform in a child wrapper.
                  onClick={() => setActive(i)}
                  {...dragProps}
                >
                  <div
                    className="h-full w-full"
                    style={{
                      transform: `translateZ(${z}px)`,
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    {renderCard ? (
                      renderCard(item, {active: isActive})
                    ) : (
                      <DefaultFanCard item={item} active={isActive} />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Dots navigation centered at bottom */}
      {showDots ? (
        <div className="mt-6 flex items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            {items.map((it, idx) => {
              const on = idx === active;
              return (
                <button
                  key={it.id}
                  onClick={() => setActive(idx)}
                  className={cn(
                    'h-2 w-2 rounded-full transition',
                    on ? 'bg-ink' : 'bg-ink/30 hover:bg-ink/50',
                  )}
                  aria-label={`Go to ${it.title}`}
                />
              );
            })}
          </div>
          {activeItem.href ? (
            <a
              href={activeItem.href}
              target="_blank"
              rel="noreferrer"
              className="text-ink/55 transition hover:text-ink"
              aria-label="Open link"
            >
              <SquareArrowOutUpRight className="h-4 w-4" />
            </a>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function DefaultFanCard({item}: {item: CardStackItem; active: boolean}) {
  return (
    <div className="flex h-full w-full flex-col bg-surface">
      {/* Texto arriba, imagen debajo: la tarjeta se lee sin tener que
          recorrerla entera, y la foto queda de fondo del bloque. */}
      <div className="flex flex-col gap-1 px-5 pb-4 pt-5">
        {item.tag ? (
          <div className="text-[13px] font-medium text-rosewood">
            {item.tag}
          </div>
        ) : null}
        <div className="truncate text-[20px] font-medium leading-[1.4] text-ink">
          {item.title}
        </div>
        {item.description ? (
          <div className="text-[13px] leading-[1.5] text-ink/70">
            {item.description}
          </div>
        ) : null}
        {item.meta ? (
          <div className="pt-1 text-[12px] font-medium leading-[1.5] text-ink/55">
            {item.meta}
          </div>
        ) : null}
      </div>

      <div className="relative flex-1 overflow-hidden">
        {item.imageSrc ? (
          <img
            src={item.imageSrc}
            alt=""
            className="h-full w-full object-cover"
            draggable={false}
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-surface-raised text-sm text-ink/55">
            Sin imagen
          </div>
        )}
      </div>
    </div>
  );
}
