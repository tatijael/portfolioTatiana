/**
 * Monta la credencial de la apertura.
 *
 * Dibuja las caras una sola vez y después elige: en escritorio, la versión
 * 3D con física (credencial3d.ts); en pantallas táctiles, o si WebGL falla,
 * la versión plana de Wordmark.astro, que cae y se da vuelta con CSS. Las
 * dos usan los mismos lienzos, así que se ven igual.
 */
import { dibujarCaras, type DatosCredencial } from './credencial-caras';
import type { Credencial3D } from './credencial3d';

export async function montarCredencial(
  hueco: HTMLElement,
  capa: HTMLElement,
  usar3d: boolean,
): Promise<Credencial3D | null> {
  const datos = JSON.parse(hueco.dataset.credencial ?? 'null') as DatosCredencial | null;
  if (!datos) return null;
  const caras = await dibujarCaras(datos);

  // La plana se arma siempre: es la que queda si el 3D no llega a montarse.
  hueco.querySelector('[data-cara-frente]')?.append(caras.frente);
  hueco.querySelector('[data-cara-dorso]')?.append(caras.dorso);
  const cinta = hueco.querySelector<HTMLElement>('[data-cinta]');
  const estamparCinta = () => {
    if (cinta) cinta.style.backgroundImage = `url(${caras.cinta.toDataURL()})`;
  };
  estamparCinta();

  const tarjeta = hueco.querySelector<HTMLButtonElement>('[data-tarjeta]');
  tarjeta?.addEventListener('click', () => {
    const volteada = tarjeta.classList.toggle('is-volteada');
    tarjeta.setAttribute('aria-pressed', String(volteada));
  });

  let credencial: Credencial3D | null = null;
  if (usar3d) {
    try {
      const { montarCredencial3D } = await import('./credencial3d');
      credencial = montarCredencial3D(
        capa,
        hueco,
        caras,
        document.querySelector<HTMLElement>('[data-nav]'),
      );
    } catch {
      credencial = null;
    }
  }
  hueco.classList.add(credencial ? 'es-3d' : 'es-plana');

  // El cambio de tema anima los colores: se repinta al toque y otra vez
  // cuando la transición terminó, que es cuando los valores son los finales.
  let tardio = 0;
  const repintar = () => {
    caras.repintar();
    estamparCinta();
    credencial?.refrescar();
  };
  new MutationObserver(() => {
    repintar();
    clearTimeout(tardio);
    tardio = window.setTimeout(repintar, 900);
  }).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-tema'],
  });

  return credencial;
}
