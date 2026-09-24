import React, {useRef} from 'react';
import gsap from 'gsap';
import {useGSAP} from '@gsap/react';
import {SplitText} from 'gsap/SplitText';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);

/**
 * RevealText (GSAP): revela un título palabra por palabra "subiendo" desde
 * detrás de una máscara, con un leve giro y cascada (stagger).
 *
 * Usa SplitText para partir el texto en palabras envueltas en una máscara
 * (`mask: 'words'`) y ScrollTrigger para dispararlo al entrar en pantalla.
 * Respeta `prefers-reduced-motion`. Mismo API que la versión anterior, así
 * que todos los títulos del sitio se actualizan sin tocar nada más.
 */
export function RevealText({
  text,
  className = '',
  children,
}: {
  /** Texto plano a revelar. Si pasás `children`, este prop se ignora. */
  text?: string;
  className?: string;
  /** Contenido con marcado propio (por ejemplo un titular con cursiva).
   *  SplitText parte igual: corta por palabras respetando los elementos. */
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      // Accesibilidad: si el usuario pidió menos movimiento, mostramos directo.
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      // Esperamos a que las fuentes carguen para que el corte no se desfase.
      document.fonts.ready.then(() => {
        const split = SplitText.create(el, {
          type: 'words',
          mask: 'words',
          wordsClass: 'split-word',
        });

        const tween = gsap.from(split.words, {
          yPercent: 120,
          rotateZ: 6,
          opacity: 0,
          duration: 0.85,
          ease: 'power3.out',
          stagger: 0.07,
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true,
          },
        });

        // Red de seguridad. `gsap.from()` esconde el texto primero y lo revela
        // solo si la animación llega a completarse: si ScrollTrigger no
        // dispara —pestaña en segundo plano, error de JS, carga lenta— el
        // titular queda invisible o congelado a mitad de camino.
        //
        // Este watchdog revisa a los 2,5s: si el elemento está en pantalla y
        // la animación no arrancó, limpia las props y muestra el texto. Es
        // preferible perder la animación a perder el titular.
        window.setTimeout(() => {
          const box = el.getBoundingClientRect();
          const enPantalla = box.top < window.innerHeight && box.bottom > 0;
          if (enPantalla && tween.progress() < 1) {
            tween.kill();
            gsap.set(split.words, {clearProps: 'all'});
          }
        }, 2500);
      });
    },
    {scope: ref},
  );

  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {children ?? text}
    </span>
  );
}
