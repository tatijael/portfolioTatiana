import React, {useRef} from 'react';
import {useScrollProgress, lerp} from './useScrollProgress';

/**
 * ContainerScroll — la pantalla que rota y se endereza al entrar en viewport.
 *
 * Portado desde tatiana-storefront, con dos cambios de fondo respecto del
 * original:
 *
 * 1. PRESENTACIÓN → tokens de Air. Sin `boxShadow` (el original apilaba seis
 *    sombras para simular volumen; Air no usa elevación). El marco #222 con
 *    borde de 4px pasó a superficie Whiteout con hairline Ink, y el interior
 *    a Surface Raised — el rosa muy tenue que hace que la "pantalla" se
 *    distinga del marco blanco que la sostiene.
 *
 * 2. MOTOR DE SCROLL → medición propia. El original usaba `useScroll` de
 *    motion apoyado en un contenedor de 60–80rem: esa altura enorme ERA la
 *    pista que alimentaba la animación. Al recortarla para sacar el espacio
 *    vacío, el rango quedó degenerado y el progreso se clavó en 0 — la
 *    tarjeta quedaba congelada inclinada 20°, sin animar jamás.
 *
 *    Poner un `offset` explícito no alcanzó: `useScroll` seguía sin
 *    actualizar. Medido con scroll real de rueda, la sección recorría todo el
 *    viewport y el transform no cambiaba nunca. Por eso ahora el progreso se
 *    calcula a mano (ver useScrollProgress), que además deja este componente
 *    sin depender de motion.
 */
export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  /** Opcional a propósito: Astro entrega los slots nombrados como props en
   *  runtime, pero TypeScript no puede verlo desde el .astro. */
  titleComponent?: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // `to: 0.5` → la tarjeta termina de enderezarse justo cuando la sección
  // queda centrada en pantalla, y se mantiene plana de ahí en adelante.
  const p = useScrollProgress(containerRef, {from: 0.06, to: 0.5});

  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const rotate = lerp(20, 0, p);
  const scale = isMobile ? lerp(0.8, 0.95, p) : lerp(1.05, 1, p);
  const translate = lerp(0, -60, p);

  return (
    <div
      className="relative flex h-auto items-center justify-center p-2 md:px-12 md:py-6"
      ref={containerRef}
    >
      <div className="relative w-full py-4 md:py-8" style={{perspective: '1000px'}}>
        <div
          className="mx-auto max-w-5xl text-center"
          style={{transform: `translateY(${translate}px)`}}
        >
          {titleComponent}
        </div>

        <div
          className="mx-auto -mt-8 h-[24rem] w-full max-w-5xl rounded-[var(--radius-xl)] border border-ink/15 bg-surface p-2 md:h-[34rem] md:p-3"
          style={{
            transform: `rotateX(${rotate}deg) scale(${scale})`,
            willChange: 'transform',
          }}
        >
          <div className="h-full w-full overflow-hidden rounded-[var(--radius-images)] bg-surface-raised">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
