import React, {useEffect, useRef, useState} from 'react';
import {useScrollProgress, lerp} from './useScrollProgress';

/**
 * ScrollSpin — la persona que gira a medida que scrolleás.
 *
 * Es el efecto del video de referencia, y conviene entender de dónde sale:
 * no hay ninguna animación corriendo. Cada posición del scroll corresponde a
 * un frame concreto de una secuencia, y la sensación de giro la da el
 * material, no el código. Por eso el componente pide una secuencia —la misma
 * persona vista desde ángulos consecutivos— y no una foto sola.
 *
 * ── Los dos modos ────────────────────────────────────────────────────────
 *
 * `frames.length > 1` → MODO SECUENCIA (el efecto real)
 *   Precarga los frames, los dibuja en un canvas y en cada scroll cambia
 *   cuál se dibuja. Un canvas y no 60 <img> apilados: cambiar el `src` de un
 *   <img> parpadea mientras decodifica, y montar los 60 a la vez deja al
 *   navegador con 60 capas que componer en cada frame.
 *
 * `frames.length === 1` → MODO FOTO (lo que hay hoy)
 *   Con una sola foto no existe el otro lado de la persona, y nada puede
 *   inventarlo. Así que en vez de fingir un giro de 360°, la foto pivota en
 *   3D dentro de un rango corto, atada al mismo scroll. Es el gesto, no el
 *   efecto — y se va solo en cuanto haya secuencia, sin tocar código.
 *
 * ── El recorrido ─────────────────────────────────────────────────────────
 * `useScrollProgress` mide en crudo: 0.5 es "el elemento está centrado en
 * pantalla". Como este vive en el hero, que arranca ocupando la pantalla
 * entera, el recorrido útil empieza justo en 0.5 (página sin scrollear) y
 * termina cuando el hero casi terminó de salir por arriba. De ahí el
 * recorte: el giro completo entra en poco menos de una pantalla de scroll.
 */
const SPIN_FROM = 0.5;
const SPIN_TO = 0.92;

/** Grados que pivota la foto en modo foto. Corto a propósito: pasado el
 *  perfil, una foto plana se ve como una hoja de papel de canto. */
const TILT = 20;

export function ScrollSpin({
  frames,
  alt,
}: {
  /** Secuencia ordenada de URLs. Con un solo elemento entra en modo foto. */
  frames: string[];
  alt: string;
}) {
  const layerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  /** Sube con cada frame que termina de cargar. Existe para que el efecto de
   *  dibujo vuelva a correr: sin esto, los frames que llegan tarde no se
   *  dibujarían hasta el próximo scroll. */
  const [loaded, setLoaded] = useState(0);
  const [drawn, setDrawn] = useState(false);
  const [reduce, setReduce] = useState(false);

  const p = useScrollProgress(layerRef, {from: SPIN_FROM, to: SPIN_TO});
  const isSequence = frames.length > 1;
  const poster = frames[0]!;

  useEffect(() => {
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  /* ── Precarga ──────────────────────────────────────────────────────────
     Los frames se piden todos juntos al hidratar. No se espera a tenerlos
     completos para empezar a dibujar: se dibuja el que haya, y el hueco lo
     tapa el <img> del poster que está abajo. Así el hero nunca queda vacío
     esperando la secuencia. */
  useEffect(() => {
    if (!isSequence) return;
    let alive = true;

    imagesRef.current = frames.map((src) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = src;
      img.onload = () => {
        if (alive) setLoaded((n) => n + 1);
      };
      return img;
    });

    return () => {
      alive = false;
      imagesRef.current = [];
    };
  }, [frames, isSequence]);

  /* ── Dibujo ────────────────────────────────────────────────────────────
     Se busca hacia atrás el frame cargado más cercano al que toca. Si el que
     corresponde todavía está en vuelo, se mantiene el anterior en vez de
     dejar el canvas vacío: el giro se ve entrecortado un instante, no roto. */
  useEffect(() => {
    if (!isSequence) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const target = reduce
      ? 0
      : Math.min(frames.length - 1, Math.round(p * (frames.length - 1)));

    let img: HTMLImageElement | undefined;
    for (let i = target; i >= 0; i--) {
      const candidate = imagesRef.current[i];
      if (candidate?.complete && candidate.naturalWidth > 0) {
        img = candidate;
        break;
      }
    }
    if (!img) return;

    // El canvas toma su tamaño del primer frame que llega. Reasignar
    // width/height lo limpia, así que solo se hace cuando cambia de verdad.
    if (canvas.width !== img.naturalWidth) {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    setDrawn(true);
  }, [p, loaded, frames.length, isSequence, reduce]);

  // Modo foto: el pivote va de -TILT a +TILT y pasa por 0 a mitad de camino.
  const tilt = reduce ? 0 : lerp(-TILT, TILT, p);

  return (
    <div className="spin" ref={layerRef}>
      <div className="spin__stage">
        <img
          className="spin__poster"
          src={poster}
          alt={alt}
          style={
            isSequence
              ? undefined
              : {transform: `perspective(1200px) rotateY(${tilt}deg)`}
          }
        />
        {isSequence && (
          <canvas
            className="spin__canvas"
            ref={canvasRef}
            aria-hidden="true"
            style={{opacity: drawn ? 1 : 0}}
          />
        )}
      </div>
    </div>
  );
}

export default ScrollSpin;
