/* ⚠️ HUÉRFANO desde el 2026-09-21. Nadie lo importa.
 *
 * Dibujaba los proyectos como un abanico de tarjetas. Lo reemplazó la pila
 * `sticky` de Projects.astro, que hace el efecto sin JS: al desmontarlo se
 * fue del bundle un chunk de 134 kB (este componente más `motion`).
 *
 * Queda por si el abanico vuelve a hacer falta. Si no vuelve, se puede
 * borrar junto con la dependencia `motion` si ningún otro componente la usa.
 */
import {CardStack, type CardStackItem} from './CardStack';

/**
 * Adaptador entre los proyectos del sitio y el CardStack portado del
 * storefront. Vive del lado React porque CardStack lo es; toda la data sigue
 * viniendo de `src/data/site.ts`.
 */
export type StackProject = {
  title: string;
  summary: string;
  detail: string;
  stack: readonly string[];
  category: string;
  year: string;
  live: string | null;
  image: string | null;
  fallbackImage: string;
};

export default function ProjectStack({projects}: {projects: StackProject[]}) {
  const items: CardStackItem[] = projects.map((p, i) => ({
    id: `${p.title}-${i}`,
    title: p.title,
    description: p.detail,
    meta: p.stack.join(' · '),
    imageSrc: p.image ?? p.fallbackImage,
    href: p.live ?? undefined,
    tag: `${p.year} · ${p.category}`,
  }));

  return (
    <CardStack
      items={items}
      cardWidth={460}
      cardHeight={380}
      spreadDeg={40}
      overlap={0.46}
      loop
      showDots
    />
  );
}
