/**
 * Las dos caras de la credencial y el estampado de la cinta, dibujados en
 * canvas a partir de los datos de `credencial` (site.ts).
 *
 * Se dibujan y no se cargan como imagen por dos motivos: los datos se
 * cambian en site.ts sin abrir un editor de diseño, y los colores salen del
 * tema activo, así que la credencial acompaña al cambiar de clima. Los mismos
 * lienzos sirven de textura para la versión 3D y de cara para la plana.
 */
import type { credencial } from '../data/site';

export type DatosCredencial = typeof credencial;

/** Proporción 2:3, la de una credencial vertical. */
export const ANCHO = 720;
export const ALTO = 1080;

const SANS = "'Inter Variable', ui-sans-serif, system-ui, sans-serif";
const DISPLAY = "'Archivo Variable', 'Inter Variable', ui-sans-serif, sans-serif";
const MONO = "'JetBrains Mono Variable', ui-monospace, monospace";
const CURSIVA = "'Caveat', cursive";

interface Paleta {
  tinta: string;
  tintaSuave: string;
  papel: string;
  rosewood: string;
  petalo: string;
  rubor: string;
  durazno: string;
}

const paleta = (): Paleta => {
  const cs = getComputedStyle(document.documentElement);
  const v = (nombre: string, respaldo: string) =>
    cs.getPropertyValue(nombre).trim() || respaldo;
  return {
    tinta: v('--color-ink', '#1f2a3a'),
    tintaSuave: v('--color-ink-soft', '#3a4759'),
    papel: v('--color-surface', '#ffffff'),
    rosewood: v('--color-rosewood', '#3c5a7d'),
    petalo: v('--color-petal', '#dbe8f4'),
    rubor: v('--hero-blush', '#dbe8f4'),
    durazno: v('--hero-peach', '#f8d8bf'),
  };
};

/** Espera las fuentes que usa el dibujo: canvas no las pide por su cuenta. */
export const cargarFuentes = () =>
  Promise.all(
    [
      `900 100px ${DISPLAY}`,
      `500 100px ${SANS}`,
      `500 100px ${MONO}`,
      `700 100px ${MONO}`,
      `500 100px ${CURSIVA}`,
    ].map((f) => document.fonts?.load(f).catch(() => null)),
  );

export const cargarFoto = (src: string) =>
  new Promise<HTMLImageElement | null>((resolver) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolver(img);
    img.onerror = () => resolver(null);
    img.src = src;
  });

const lienzo = (ancho = ANCHO, alto = ALTO) => {
  const c = document.createElement('canvas');
  c.width = ancho;
  c.height = alto;
  return c;
};

const redondeado = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) => {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
};

/** Un número estable a partir de un texto, para que el código de barras y
 *  el QR no cambien entre cargas. */
const semilla = (texto: string) => {
  let h = 2166136261;
  for (const c of texto) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
};

const codigoDeBarras = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  texto: string,
) => {
  const azar = semilla(texto);
  let cx = x;
  while (cx < x + w) {
    const grosor = 2 + Math.floor(azar() * 3) * 2;
    if (cx + grosor > x + w) break;
    ctx.fillRect(cx, y, grosor, h);
    cx += grosor + 2 + Math.floor(azar() * 3) * 2;
  }
};

/** El marco: el porta tarjeta en tinta, con la ranura de la pinza arriba y
 *  la tarjeta en papel adentro. Devuelve el rectángulo útil. */
const marco = (ctx: CanvasRenderingContext2D, p: Paleta, fondo: string | CanvasGradient) => {
  ctx.fillStyle = p.tinta;
  ctx.fillRect(0, 0, ANCHO, ALTO);
  ctx.fillStyle = fondo;
  redondeado(ctx, 26, 64, ANCHO - 52, ALTO - 90, 30);
  ctx.fill();
  // La ranura por donde pasa la pinza.
  ctx.fillStyle = p.tintaSuave;
  redondeado(ctx, ANCHO / 2 - 62, 22, 124, 22, 11);
  ctx.fill();
  return { x: 26, y: 64, w: ANCHO - 52, h: ALTO - 90 };
};

const frente = (
  c: HTMLCanvasElement,
  d: DatosCredencial,
  foto: HTMLImageElement | null,
  p: Paleta,
) => {
  const ctx = c.getContext('2d')!;
  ctx.clearRect(0, 0, ANCHO, ALTO);
  const m = marco(ctx, p, p.papel);
  const izq = m.x + 34;
  const der = m.x + m.w - 34;

  // La foto, sobre un rubor por si trae fondo transparente.
  const fx = m.x + 22;
  const fy = m.y + 22;
  const fw = m.w - 44;
  const fh = 540;
  ctx.save();
  redondeado(ctx, fx, fy, fw, fh, 20);
  ctx.clip();
  const rubor = ctx.createLinearGradient(fx, fy, fx + fw, fy + fh);
  rubor.addColorStop(0, p.rubor);
  rubor.addColorStop(1, p.durazno);
  ctx.fillStyle = rubor;
  ctx.fillRect(fx, fy, fw, fh);
  if (foto) {
    // `cover` con punto focal: la foto llena el recuadro y el encuadre
    // decide qué parte queda centrada.
    const escala = Math.max(fw / foto.naturalWidth, fh / foto.naturalHeight);
    const w = foto.naturalWidth * escala;
    const h = foto.naturalHeight * escala;
    const x = fx - Math.min(w - fw, Math.max(0, w * d.encuadre.x - fw / 2));
    const y = fy - Math.min(h - fh, Math.max(0, h * d.encuadre.y - fh / 2));
    ctx.drawImage(foto, x, y, w, h);
  }
  ctx.restore();

  // El rótulo chico de arriba, sobre la foto.
  ctx.font = `700 17px ${MONO}`;
  ctx.textBaseline = 'top';
  const rotulo = `Nº ${d.numero}`;
  const anchoRotulo = ctx.measureText(rotulo).width + 28;
  ctx.fillStyle = p.papel;
  redondeado(ctx, fx + fw - anchoRotulo - 16, fy + 16, anchoRotulo, 34, 17);
  ctx.fill();
  ctx.fillStyle = p.tinta;
  ctx.fillText(rotulo, fx + fw - anchoRotulo - 2, fy + 25);

  // Nombre completo, en dos renglones y a todo el ancho.
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = p.tinta;
  ctx.font = `900 96px ${DISPLAY}`;
  ctx.fillText(d.nombre, izq - 4, 728, der - izq);
  ctx.fillText(d.apellido, izq - 4, 818, der - izq);
  ctx.font = `500 23px ${SANS}`;
  ctx.fillStyle = p.tintaSuave;
  ctx.fillText(d.rol, izq, 872, 330);
  ctx.fillText(d.rolExtra, izq, 904, 330);

  // Código de barras. (La firma cursiva que iba al lado del nombre se sacó
  // cuando el nombre pasó a ser el completo: no entraban los dos.)
  ctx.fillStyle = p.tinta;
  codigoDeBarras(ctx, der - 180, 850, 180, 58, d.numero);
  ctx.font = `500 15px ${MONO}`;
  ctx.textAlign = 'right';
  ctx.fillText(d.numero.split('').join(' '), der, 930);
  ctx.textAlign = 'left';

  // Estado.
  const py = m.y + m.h - 82;
  ctx.font = `700 17px ${MONO}`;
  const estado = d.estado.toUpperCase();
  const anchoEstado = ctx.measureText(estado).width;
  ctx.fillStyle = p.petalo;
  redondeado(ctx, izq, py, anchoEstado + 70, 46, 23);
  ctx.fill();
  ctx.fillStyle = '#2fb36d';
  ctx.beginPath();
  ctx.arc(izq + 26, py + 23, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = p.tinta;
  ctx.textBaseline = 'middle';
  ctx.fillText(estado, izq + 46, py + 24);
  ctx.textBaseline = 'alphabetic';
};

const dorso = (c: HTMLCanvasElement, d: DatosCredencial, p: Paleta) => {
  const ctx = c.getContext('2d')!;
  ctx.clearRect(0, 0, ANCHO, ALTO);
  const fondo = ctx.createLinearGradient(0, 64, ANCHO, ALTO);
  fondo.addColorStop(0, p.rubor);
  fondo.addColorStop(1, p.durazno);
  const m = marco(ctx, p, fondo);
  const izq = m.x + 44;
  const der = m.x + m.w - 44;

  ctx.fillStyle = p.tintaSuave;
  ctx.font = `700 17px ${MONO}`;
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(d.dorso.titulo.toUpperCase(), izq, m.y + 64);
  ctx.textAlign = 'right';
  ctx.fillText(`Nº ${d.numero}`, der, m.y + 64);
  ctx.textAlign = 'left';

  ctx.fillStyle = p.tinta;
  ctx.font = `500 120px ${CURSIVA}`;
  ctx.fillText(d.firma, izq - 4, m.y + 190);
  ctx.font = `500 24px ${SANS}`;
  ctx.fillStyle = p.tintaSuave;
  ctx.fillText(`${d.nombre} ${d.apellido} · ${d.rol}`, izq, m.y + 236, der - izq);

  let y = m.y + 286;
  for (const [etiqueta, valor] of d.dorso.filas) {
    ctx.strokeStyle = 'rgb(31 42 58 / 0.18)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(izq, y);
    ctx.lineTo(der, y);
    ctx.stroke();
    ctx.fillStyle = p.tintaSuave;
    ctx.font = `700 16px ${MONO}`;
    ctx.fillText(etiqueta.toUpperCase(), izq, y + 38);
    ctx.fillStyle = p.tinta;
    ctx.font = `500 30px ${SANS}`;
    ctx.fillText(valor, izq, y + 80, der - izq);
    y += 96;
  }

  // Un QR decorativo: cuadrícula estable con los tres ojos de esquina.
  const lado = 150;
  const qx = der - lado;
  const qy = m.y + m.h - lado - 40;
  ctx.fillStyle = p.papel;
  redondeado(ctx, qx - 12, qy - 12, lado + 24, lado + 24, 12);
  ctx.fill();
  ctx.fillStyle = p.tinta;
  const celdas = 21;
  const t = lado / celdas;
  const azar = semilla(d.numero + d.nombre);
  const ojo = (cx: number, cy: number) =>
    cx >= 0 && cx < 7 && cy >= 0 && cy < 7;
  for (let i = 0; i < celdas; i++) {
    for (let j = 0; j < celdas; j++) {
      if (ojo(i, j) || ojo(i - 14, j) || ojo(i, j - 14)) continue;
      if (azar() > 0.5) ctx.fillRect(qx + i * t, qy + j * t, t, t);
    }
  }
  for (const [ox, oy] of [
    [0, 0],
    [14, 0],
    [0, 14],
  ]) {
    ctx.fillRect(qx + ox * t, qy + oy * t, 7 * t, 7 * t);
    ctx.fillStyle = p.papel;
    ctx.fillRect(qx + (ox + 1) * t, qy + (oy + 1) * t, 5 * t, 5 * t);
    ctx.fillStyle = p.tinta;
    ctx.fillRect(qx + (ox + 2) * t, qy + (oy + 2) * t, 3 * t, 3 * t);
  }

  ctx.fillStyle = p.tintaSuave;
  ctx.font = `500 21px ${SANS}`;
  const palabras = d.dorso.nota.split(' ');
  let linea = '';
  let ly = qy + 30;
  for (const palabra of palabras) {
    const prueba = linea ? `${linea} ${palabra}` : palabra;
    if (ctx.measureText(prueba).width > qx - izq - 36 && linea) {
      ctx.fillText(linea, izq, ly);
      linea = palabra;
      ly += 30;
    } else {
      linea = prueba;
    }
  }
  ctx.fillText(linea, izq, ly);
};

/** La cinta: el nombre repetido a lo largo, en vertical. Se repite como
 *  textura, así que el alto es un solo módulo. */
const cinta = (c: HTMLCanvasElement, d: DatosCredencial, p: Paleta) => {
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = p.rosewood;
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.save();
  ctx.translate(c.width / 2, c.height / 2);
  ctx.rotate(Math.PI / 2);
  ctx.fillStyle = p.papel;
  ctx.font = `700 46px ${MONO}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${d.cinta}  ✦`, 0, 2, c.height - 20);
  ctx.restore();
};

export interface Caras {
  frente: HTMLCanvasElement;
  dorso: HTMLCanvasElement;
  cinta: HTMLCanvasElement;
  /** Vuelve a pintar con los colores del tema actual. */
  repintar(): void;
}

export async function dibujarCaras(d: DatosCredencial): Promise<Caras> {
  const [, foto] = await Promise.all([cargarFuentes(), cargarFoto(d.foto)]);
  const caras: Caras = {
    frente: lienzo(),
    dorso: lienzo(),
    cinta: lienzo(128, 760),
    repintar() {
      const p = paleta();
      frente(caras.frente, d, foto, p);
      dorso(caras.dorso, d, p);
      cinta(caras.cinta, d, p);
    },
  };
  caras.repintar();
  return caras;
}
