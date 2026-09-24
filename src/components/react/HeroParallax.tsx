import React from 'react';
import {useScrollProgress, lerp} from './useScrollProgress';

/**
 * HeroParallax — tres filas de tarjetas que se desplazan en direcciones
 * opuestas y rotan en 3D al scrollear.
 *
 * Portado desde tatiana-storefront. Cambios respecto del original:
 *   - El copy estaba hardcodeado dentro del componente; ahora entra por props,
 *     así el contenido sigue viviendo en `src/data/site.ts`.
 *   - Sin `shadow-2xl` en hover ni velo negro sobre la imagen: Air no usa
 *     elevación, y el título va en una placa clara con texto Ink en vez de
 *     texto blanco sobre foto (que no llegaba a contraste AA).
 *   - El motor de scroll dejó de ser `useScroll` de motion, que en este
 *     proyecto nunca actualizaba y dejaba las filas quietas. Ahora se mide a
 *     mano igual que el resto del sitio (ver useScrollProgress).
 *   - Respeta `prefers-reduced-motion`: sin movimiento, las filas quedan
 *     quietas y legibles.
 *
 * NOTA: está pensado para ~15 imágenes (3 filas de 5). Con menos, las repite
 * cíclicamente para no dejar huecos.
 */
export type ParallaxItem = {title: string; link?: string; thumbnail: string};

export const HeroParallax = ({
  items,
  title,
  subtitle,
}: {
  items: ParallaxItem[];
  title?: React.ReactNode;
  subtitle?: string;
}) => {
  const [reduce, setReduce] = React.useState(false);
  React.useEffect(() => {
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  const filled = React.useMemo(() => {
    if (!items.length) return [];
    return Array.from({length: 15}, (_, i) => items[i % items.length]!);
  }, [items]);

  const ref = React.useRef<HTMLDivElement>(null);
  const p = useScrollProgress(ref);

  if (!filled.length) return null;

  const firstRow = filled.slice(0, 5);
  const secondRow = filled.slice(5, 10);
  const thirdRow = filled.slice(10, 15);

  // El grupo entero se endereza en el primer tramo del recorrido…
  const entrada = Math.min(1, p / 0.4);
  const rotateX = reduce ? 0 : lerp(12, 0, entrada);
  const rotateZ = reduce ? 0 : lerp(9, 0, entrada);
  const translateY = reduce ? 0 : lerp(-90, 40, entrada);
  const opacity = reduce ? 1 : lerp(0.45, 1, entrada);

  // …mientras las filas se cruzan a lo largo de todo el recorrido.
  const x = reduce ? 0 : lerp(-240, 240, p);

  return (
    <div
      ref={ref}
      className="relative flex flex-col self-auto overflow-hidden py-[var(--section-pad-lg)] antialiased [perspective:1000px] [transform-style:preserve-3d]"
    >
      {(title || subtitle) && (
        <div className="air-container relative w-full pb-16">
          {title}
          {subtitle ? (
            <p className="mt-6 max-w-[62ch] text-body font-normal text-ink/75">{subtitle}</p>
          ) : null}
        </div>
      )}

      <div
        style={{
          transform: `rotateX(${rotateX}deg) rotateZ(${rotateZ}deg) translateY(${translateY}px)`,
          opacity,
          willChange: 'transform, opacity',
        }}
      >
        <Row items={firstRow} x={x} reverse />
        <Row items={secondRow} x={-x} />
        <Row items={thirdRow} x={x} reverse />
      </div>
    </div>
  );
};

const Row = ({
  items,
  x,
  reverse = false,
}: {
  items: ParallaxItem[];
  x: number;
  reverse?: boolean;
}) => (
  <div
    className={`mb-14 flex space-x-14 ${reverse ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}
    style={{transform: `translateX(${x}px)`, willChange: 'transform'}}
  >
    {items.map((item, i) => (
      <Tile item={item} key={i} />
    ))}
  </div>
);

const Tile = ({item}: {item: ParallaxItem}) => {
  const inner = (
    <>
      <img
        src={item.thumbnail}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
        draggable={false}
      />
      {/* Placa Haze con texto Ink: reemplaza el velo negro + texto blanco del
          original, que no llegaba a contraste AA sobre foto. */}
      <span className="absolute bottom-3 left-3 rounded-[var(--radius-buttons)] bg-surface/95 px-3 py-1.5 text-[13px] font-medium text-ink opacity-0 transition-opacity duration-200 group-hover/tile:opacity-100">
        {item.title}
      </span>
    </>
  );

  return (
    <div className="group/tile relative h-72 w-[24rem] flex-shrink-0 overflow-hidden rounded-[var(--radius-images)] border border-ink/10 transition-transform duration-300 hover:-translate-y-3">
      {item.link ? (
        <a href={item.link} target="_blank" rel="noreferrer" className="block h-full w-full">
          {inner}
        </a>
      ) : (
        inner
      )}
    </div>
  );
};
