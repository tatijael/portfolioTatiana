import {useEffect, useState, type RefObject} from 'react';

export {TOUCH_QUERY} from '../../lib/tactil';

/**
 * Progreso de scroll de un elemento, medido a mano.
 *
 * Reemplaza a `useScroll` de motion, que en este proyecto no actualizaba
 * nunca: depende del frame loop interno de la librería y se quedaba clavado
 * en 0, dejando ContainerScroll congelado inclinado 20° y HeroParallax sin
 * moverse. Verificado con scroll real de rueda: la sección recorría todo el
 * viewport y el transform no cambiaba en ningún momento.
 *
 * Acá se mide con getBoundingClientRect sobre un listener de scroll pasivo,
 * el mismo enfoque que el parallax del layout — que sí funciona de forma
 * confiable, incluso con la pestaña en segundo plano.
 *
 * Escala cruda del recorrido:
 *   0    → el borde superior del elemento toca el fondo del viewport
 *   0.5  → el elemento está centrado en pantalla
 *   1    → el elemento terminó de salir por arriba
 *
 * `from`/`to` recortan ese recorrido. Por ejemplo `{from: 0, to: 0.5}` hace
 * que la animación se complete justo cuando el elemento queda centrado.
 */
export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  {from = 0, to = 1, enabled = true}: {from?: number; to?: number; enabled?: boolean} = {},
) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    let ticking = false;

    const measure = () => {
      ticking = false;
      const vh = window.innerHeight;
      const r = el.getBoundingClientRect();
      const total = r.height + vh;
      if (total <= 0) return;

      const raw = (vh - r.top) / total;
      const span = to - from;
      const v = span > 0 ? (raw - from) / span : 0;
      setProgress(Math.min(1, Math.max(0, v)));
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, {passive: true});
    window.addEventListener('resize', onScroll, {passive: true});
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [ref, from, to, enabled]);

  return progress;
}

/** Interpola linealmente entre dos valores según el progreso. */
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
