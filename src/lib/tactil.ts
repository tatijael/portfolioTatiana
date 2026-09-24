/**
 * Pantalla táctil (teléfono, tablet). En Safari de iPhone el scroll corre en
 * un hilo propio y lo que se mueve con él desde JavaScript llega un frame
 * tarde, así que ahí los efectos atados al scroll se apagan. El CSS usa la
 * misma query (bloque "Pantallas táctiles" de global.css).
 */
export const TOUCH_QUERY = '(hover: none) and (pointer: coarse)';
