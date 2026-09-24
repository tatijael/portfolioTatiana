import {Suspense, lazy} from 'react';

/**
 * GlassPiece — la escultura de vidrio 3D del hero, servida desde Spline.
 *
 * Esto es lo que hace que air.inc se vea como se ve: la pieza central no es un
 * efecto CSS, es un render 3D con refracción y dispersión cromática. No hay
 * forma de reproducirlo con SVG, Tailwind ni Framer Motion — por eso los
 * intentos anteriores daban manchones en lugar de vidrio.
 *
 * El componente solo se monta si `site.ts` tiene una escena cargada. Mientras
 * `splineScene` sea null, esta isla no se renderiza y su JS ni siquiera se
 * descarga: el hero queda con el cielo pastel solo, que ya funciona.
 *
 * Cómo generar la escena: ver la sección "La pieza 3D" del README.
 */
const Spline = lazy(() => import('@splinetool/react-spline'));

export default function GlassPiece({
  scene,
  className = '',
}: {
  scene: string;
  className?: string;
}) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 -z-[1] ${className}`}
      aria-hidden="true"
    >
      <Suspense fallback={null}>
        <Spline scene={scene} style={{width: '100%', height: '100%'}} />
      </Suspense>
    </div>
  );
}
