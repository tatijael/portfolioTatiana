/**
 * La credencial colgante en 3D: cae al cargar, se balancea, se arrastra y
 * al pasar el mouse se da vuelta.
 *
 * ── Cómo está armada ─────────────────────────────────────────────────────
 *
 * La física es una cuerda de Verlet hecha a mano, sin motor: una fila de
 * puntos que solo saben dos cosas —la gravedad los tira y no se pueden
 * alejar de su vecino más que un tramo—. La tarjeta son los dos últimos
 * puntos, unidos por una barra rígida: su ángulo es el balanceo. Para un
 * péndulo con cuerda no hace falta más, y un motor de física completo
 * (Rapier, Cannon) pesaría más que todo el resto del sitio junto.
 *
 * Todo se calcula en píxeles de pantalla, con y para abajo, y la cámara se
 * para a la distancia en la que una unidad de la escena mide un píxel. Así
 * la tarjeta se encuadra con el rectángulo del hueco que le deja el CSS
 * (`.wordmark__photo`) sin conversiones.
 *
 * El lienzo ocupa la pantalla entera para que la cinta llegue hasta arriba
 * y la tarjeta pueda balancearse sin cortarse, y por eso es transparente a
 * los clicks: el mouse se escucha en `window` y se decide a mano si cayó
 * sobre la tarjeta. Si no, el click sigue de largo a los botones.
 */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import type { Caras } from './credencial-caras';

export interface Credencial3D {
  /** La opacidad que le toca por el scroll. Por debajo de casi nada se
   *  duerme y deja de escuchar el mouse. */
  opacidad(v: number): void;
  /** El scroll sube el punto de donde cuelga: la tarjeta lo sigue con
   *  retraso y se balancea al irse. */
  desplazar(scrollY: number): void;
  medir(): void;
  /** Las caras se repintaron (cambio de tema): hay que subirlas de nuevo. */
  refrescar(): void;
}

interface Punto {
  x: number;
  y: number;
  px: number;
  py: number;
  /** Masa inversa: 0 es un punto clavado. */
  inv: number;
}

const TRAMOS = 7;
const GRAVEDAD = 2600; // px/s²
const PASO = 1 / 120;
const ITERACIONES = 14;
const ROCE = 0.988;
const FOV = 30;
const PROPORCION = 1.5; // alto / ancho de la tarjeta

export function montarCredencial3D(
  capa: HTMLElement,
  hueco: HTMLElement,
  caras: Caras,
  /** La barra de navegación: la cinta se desvanece antes de llegar a ella,
   *  para no pasar por debajo de sus botones (es transparente). */
  techo: HTMLElement | null = null,
): Credencial3D | null {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch {
    return null;
  }
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const escena = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  escena.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  // Las tres luces suman más o menos 1 de frente: así la tarjeta muestra
  // los colores de las caras tal cual, y la luz solo se nota al girar.
  escena.environmentIntensity = 0.3;
  pmrem.dispose();
  escena.add(new THREE.AmbientLight(0xffffff, 0.45));
  const luz = new THREE.DirectionalLight(0xffffff, 0.6);
  luz.position.set(-0.4, 0.6, 1);
  escena.add(luz);

  const camara = new THREE.PerspectiveCamera(FOV, 1, 1, 10000);

  // ── Texturas ───────────────────────────────────────────────────────────
  const textura = (lienzo: HTMLCanvasElement) => {
    const t = new THREE.CanvasTexture(lienzo);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return t;
  };
  const texFrente = textura(caras.frente);
  const texDorso = textura(caras.dorso);
  const texCinta = textura(caras.cinta);
  texCinta.wrapT = THREE.RepeatWrapping;

  // ── La tarjeta ─────────────────────────────────────────────────────────
  // Se arma de ancho 1 y se escala al tamaño del hueco: así un resize no
  // obliga a rehacer geometrías.
  const forma = new THREE.Shape();
  {
    const w = 1;
    const h = PROPORCION;
    const r = 0.05;
    forma.moveTo(-w / 2 + r, -h / 2);
    forma.lineTo(w / 2 - r, -h / 2);
    forma.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
    forma.lineTo(w / 2, h / 2 - r);
    forma.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
    forma.lineTo(-w / 2 + r, h / 2);
    forma.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
    forma.lineTo(-w / 2, -h / 2 + r);
    forma.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
  }
  const GROSOR = 0.022;

  const cara = new THREE.ShapeGeometry(forma, 6);
  // ShapeGeometry pone como UV la posición; se lleva a 0–1.
  {
    const pos = cara.attributes.position;
    const uv = cara.attributes.uv;
    for (let i = 0; i < pos.count; i++) {
      uv.setXY(i, pos.getX(i) + 0.5, pos.getY(i) / PROPORCION + 0.5);
    }
  }
  const materialCara = (map: THREE.Texture) =>
    new THREE.MeshPhysicalMaterial({
      map,
      roughness: 0.55,
      // El brillo especular es aditivo: con el barniz y el reflejo del
      // entorno de antes, toda la cara llevaba un velo gris que lavaba la
      // foto y aclaraba la tinta. Se deja un resto, para que al girar se
      // note la luz.
      specularIntensity: 0.15,
      clearcoat: 0.1,
      clearcoatRoughness: 0.3,
      envMapIntensity: 0.15,
    });
  const matFrente = materialCara(texFrente);
  const matDorso = materialCara(texDorso);
  const mallaFrente = new THREE.Mesh(cara, matFrente);
  mallaFrente.position.z = GROSOR / 2 + 0.0005;
  const mallaDorso = new THREE.Mesh(cara, matDorso);
  mallaDorso.rotation.y = Math.PI;
  mallaDorso.position.z = -GROSOR / 2 - 0.0005;

  const matCanto = new THREE.MeshStandardMaterial({ roughness: 0.4 });
  // El extruido trae tapas propias, casi en el mismo plano que las caras:
  // se pelearían por el píxel. Se dibujan solo los costados (grupo 1).
  const canto = new THREE.Mesh(
    new THREE.ExtrudeGeometry(forma, { depth: GROSOR, bevelEnabled: false, curveSegments: 6 }),
    [new THREE.MeshBasicMaterial({ visible: false }), matCanto],
  );
  canto.position.z = -GROSOR / 2;

  // El enganche que une la cinta con la tarjeta, como el de las
  // credenciales de verdad: una argolla rectangular de alambre que baja de
  // la cinta y una pinza redondeada que muerde la ranura. La pinza baja
  // hasta la ranura y su pie queda dentro del grosor de la tarjeta.
  const PINZA = 0.13; // largo, en anchos de tarjeta
  const metal = new THREE.MeshStandardMaterial({
    color: 0xdfe3ea,
    metalness: 0.6,
    roughness: 0.32,
  });
  // La argolla: un rectángulo de esquinas redondeadas, de alambre.
  const argolla = new THREE.CurvePath<THREE.Vector3>();
  {
    // Del ancho de la cinta, que pasa por adentro y se dobla sobre el
    // lado de arriba.
    const a = 0.082; // medio ancho
    const b = 0.026; // medio alto
    const r = 0.016; // radio de las esquinas
    const v = (x: number, y: number) => new THREE.Vector3(x, y, 0);
    const esquinas: [number, number, number, number][] = [
      [a, b, 1, 1],
      [-a, b, -1, 1],
      [-a, -b, -1, -1],
      [a, -b, 1, -1],
    ];
    esquinas.forEach(([x, y, sx, sy], i) => {
      // Cada tramo: la curva de una esquina y el lado recto hasta la próxima.
      const [nx, ny, nsx, nsy] = esquinas[(i + 1) % 4];
      const entra = i % 2 === 0 ? v(x, y - sy * r) : v(x - sx * r, y);
      const sale = i % 2 === 0 ? v(x - sx * r, y) : v(x, y - sy * r);
      argolla.add(new THREE.QuadraticBezierCurve3(entra, v(x, y), sale));
      const proxima = i % 2 === 0 ? v(nx, ny - nsy * r) : v(nx - nsx * r, ny);
      argolla.add(new THREE.LineCurve3(sale, proxima));
    });
  }
  const pinza = new THREE.Group();
  const aro = new THREE.Mesh(new THREE.TubeGeometry(argolla, 80, 0.008, 10, true), metal);
  aro.position.y = PROPORCION / 2 + 0.106;
  // La pinza: una cápsula gruesa que va del lado de abajo de la argolla
  // hasta el medio de la ranura. Sobresale del grosor de la tarjeta por las
  // dos caras, así se ve igual cuando se da vuelta.
  const pieza = new THREE.Mesh(new THREE.CapsuleGeometry(0.026, 0.07, 8, 20), metal);
  pieza.position.y = PROPORCION / 2 + 0.019;
  pinza.add(aro, pieza);

  const tarjeta = new THREE.Group();
  // Primero el giro propio (Y, darse vuelta) y después el balanceo (Z).
  tarjeta.rotation.order = 'ZYX';
  tarjeta.add(mallaFrente, mallaDorso, canto, pinza);
  escena.add(tarjeta);

  // ── La cinta ───────────────────────────────────────────────────────────
  const MUESTRAS = 48;
  const geoCinta = new THREE.BufferGeometry();
  const posCinta = new Float32Array((MUESTRAS + 1) * 2 * 3);
  const uvCinta = new Float32Array((MUESTRAS + 1) * 2 * 2);
  const colorCinta = new Float32Array((MUESTRAS + 1) * 2 * 4).fill(1);
  const indices: number[] = [];
  for (let i = 0; i < MUESTRAS; i++) {
    const a = i * 2;
    indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  geoCinta.setIndex(indices);
  geoCinta.setAttribute('position', new THREE.BufferAttribute(posCinta, 3));
  geoCinta.setAttribute('uv', new THREE.BufferAttribute(uvCinta, 2));
  geoCinta.setAttribute('color', new THREE.BufferAttribute(colorCinta, 4));
  const matCinta = new THREE.MeshStandardMaterial({
    map: texCinta,
    roughness: 0.75,
    side: THREE.DoubleSide,
    vertexColors: true,
    transparent: true,
  });
  const mallaCinta = new THREE.Mesh(geoCinta, matCinta);
  mallaCinta.frustumCulled = false;
  escena.add(mallaCinta);
  const curva = new THREE.CatmullRomCurve3(
    Array.from({ length: TRAMOS + 1 }, () => new THREE.Vector3()),
  );

  // El canto es de la tinta del tema, como el marco dibujado en las caras.
  const teñirCanto = () => {
    const cs = getComputedStyle(document.documentElement);
    matCanto.color.set(cs.getPropertyValue('--color-ink').trim() || '#1f2a3a');
  };
  teñirCanto();

  // ── El lienzo ──────────────────────────────────────────────────────────
  const lienzo = renderer.domElement;
  lienzo.setAttribute('aria-hidden', 'true');
  lienzo.className = 'credencial-3d';
  Object.assign(lienzo.style, {
    position: 'absolute',
    inset: '0',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  });
  capa.appendChild(lienzo);

  // ── Medidas ────────────────────────────────────────────────────────────
  let W = 1;
  let H = 1;
  let ancho = 200; // de la tarjeta, en px
  let alto = ancho * PROPORCION;
  let pinzaPx = ancho * PINZA;
  let tramo = 40;
  const ancla = { x: 0, y: 0 };
  let anclaBaseY = 0;
  let corte = 0; // y de pantalla donde termina la nav
  let subida = 0;
  // La entrada: cuánto más arriba está el ancla de su lugar, y a qué
  // velocidad baja. Ver `soltar`.
  let caida = 0;
  let velCaida = 0;

  const puntos: Punto[] = [];
  const nuevo = (x: number, y: number, inv: number): Punto => ({ x, y, px: x, py: y, inv });

  const medir = () => {
    W = capa.clientWidth || window.innerWidth;
    H = capa.clientHeight || window.innerHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setSize(W, H, false);
    camara.aspect = W / H;
    camara.position.set(0, 0, H / 2 / Math.tan((FOV * Math.PI) / 360));
    camara.far = camara.position.z * 4;
    camara.updateProjectionMatrix();

    // Sin barra, la cinta llega entera hasta el borde de la pantalla.
    corte = techo ? techo.getBoundingClientRect().bottom : -Infinity;
    const r = hueco.getBoundingClientRect();
    if (!r.width) return;
    ancho = r.width;
    alto = ancho * PROPORCION;
    pinzaPx = ancho * PINZA;
    // Cuelga de un punto apenas por encima del borde de la pantalla, en la
    // vertical del hueco. La tarjeta en reposo queda centrada en el hueco.
    const centroY = r.top + r.height / 2;
    ancla.x = r.left + r.width / 2;
    anclaBaseY = -ancho * 0.3;
    ancla.y = anclaBaseY - subida - caida;
    const largo = Math.max(ancho * 0.5, centroY - alto / 2 - pinzaPx - anclaBaseY);
    tramo = largo / TRAMOS;
    tarjeta.scale.setScalar(ancho);
  };

  /**
   * La entrada. No cae la tarjeta sola: baja el ancla con todo colgando,
   * desde una pantalla más arriba, y la frena un resorte con poco freno.
   * Pasa de largo, rebota y se asienta, y la tarjeta —que cuelga apenas
   * corrida— hereda ese tirón como un balanceo chico.
   *
   * Soltar la tarjeta desde arriba del ancla no sirve: la cuerda es más
   * corta que la tarjeta, así que arrancaría con la cuerda estirada y el
   * primer tirón la haría dar vueltas.
   */
  const soltar = () => {
    caida = H + alto;
    velCaida = 0;
    ancla.y = anclaBaseY - subida - caida;
    puntos.length = 0;
    const desvio = ancho * 0.04;
    for (let i = 0; i <= TRAMOS; i++) {
      const t = i / TRAMOS;
      puntos.push(nuevo(ancla.x + desvio * t, ancla.y + tramo * TRAMOS * 0.98 * t, i === 0 ? 0 : 1));
    }
    // El último punto de la cuerda es la pinza; el que sigue, el pie de la
    // tarjeta. Pesan más que la cuerda, que es lo que la mantiene tensa.
    const T = puntos[TRAMOS];
    T.inv = 0.3;
    puntos.push(nuevo(T.x, T.y + pinzaPx + alto, 0.3));
  };

  // ── Interacción ────────────────────────────────────────────────────────
  let activa = true;
  let encima = false;
  let agarre: { lx: number; ly: number } | null = null;
  const mouse = { x: -1e4, y: -1e4 };
  let giro = 0;
  let velGiro = 0;

  /** Ejes de la tarjeta en pantalla: `d` hacia abajo, `r` hacia la derecha. */
  const ejes = () => {
    const T = puntos[TRAMOS];
    const B = puntos[TRAMOS + 1];
    const dx = B.x - T.x;
    const dy = B.y - T.y;
    const l = Math.hypot(dx, dy) || 1;
    return { T, d: { x: dx / l, y: dy / l }, r: { x: dy / l, y: -dx / l } };
  };

  /** Coordenadas del punto en el marco de la tarjeta, desde la pinza. */
  const local = (x: number, y: number) => {
    const { T, d, r } = ejes();
    const vx = x - T.x;
    const vy = y - T.y;
    return { lx: vx * r.x + vy * r.y, ly: vx * d.x + vy * d.y };
  };

  const toca = (x: number, y: number) => {
    const { lx, ly } = local(x, y);
    return Math.abs(lx) < ancho / 2 && ly > pinzaPx * 0.3 && ly < pinzaPx + alto;
  };

  const cursor = (valor: string) => {
    document.documentElement.style.cursor = valor;
  };

  const alMover = (e: PointerEvent) => {
    if (e.pointerType === 'touch' || !activa) return;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    if (!agarre) {
      const antes = encima;
      encima = toca(mouse.x, mouse.y);
      if (encima !== antes) cursor(encima ? 'grab' : '');
    }
    despertar();
  };

  const alApretar = (e: PointerEvent) => {
    if (e.pointerType === 'touch' || !activa || e.button !== 0) return;
    if ((e.target as Element | null)?.closest?.('a, button, input, label')) return;
    if (!toca(e.clientX, e.clientY)) return;
    e.preventDefault();
    agarre = local(e.clientX, e.clientY);
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    cursor('grabbing');
    despertar();
  };

  const alSoltar = () => {
    if (!agarre) return;
    agarre = null;
    encima = toca(mouse.x, mouse.y);
    cursor(encima ? 'grab' : '');
    despertar();
  };

  addEventListener('pointermove', alMover, { passive: true });
  addEventListener('pointerdown', alApretar);
  addEventListener('pointerup', alSoltar);
  addEventListener('pointercancel', alSoltar);
  addEventListener('blur', alSoltar);

  // ── Simulación ─────────────────────────────────────────────────────────
  const restringir = (a: Punto, b: Punto, largo: number, rigida: boolean) => {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dist = Math.hypot(dx, dy) || 0.0001;
    // La cuerda se puede aflojar pero no estirar; la tarjeta es rígida.
    if (!rigida && dist <= largo) return;
    const suma = a.inv + b.inv;
    if (!suma) return;
    const k = (dist - largo) / dist / suma;
    a.x += dx * k * a.inv;
    a.y += dy * k * a.inv;
    b.x -= dx * k * b.inv;
    b.y -= dy * k * b.inv;
  };

  const paso = () => {
    for (const p of puntos) {
      if (!p.inv) continue;
      const vx = (p.x - p.px) * ROCE;
      const vy = (p.y - p.py) * ROCE;
      p.px = p.x;
      p.py = p.y;
      p.x += vx;
      p.y += vy + GRAVEDAD * PASO * PASO;
    }
    if (caida || velCaida) {
      velCaida += (-70 * caida - 12 * velCaida) * PASO;
      caida += velCaida * PASO;
      if (Math.abs(caida) < 0.3 && Math.abs(velCaida) < 3) caida = velCaida = 0;
      ancla.y = anclaBaseY - subida - caida;
    }
    puntos[0].x = puntos[0].px = ancla.x;
    puntos[0].y = puntos[0].py = ancla.y;

    for (let it = 0; it < ITERACIONES; it++) {
      if (agarre) {
        // El punto agarrado va adonde está el mouse; la tarjeta entera se
        // traslada con él y la cuerda se encarga del ángulo.
        const { T, d, r } = ejes();
        const gx = T.x + r.x * agarre.lx + d.x * agarre.ly;
        const gy = T.y + r.y * agarre.lx + d.y * agarre.ly;
        const mx = (mouse.x - gx) * 0.5;
        const my = (mouse.y - gy) * 0.5;
        for (const p of [puntos[TRAMOS], puntos[TRAMOS + 1]]) {
          p.x += mx;
          p.y += my;
        }
      }
      for (let i = 0; i < TRAMOS; i++) restringir(puntos[i], puntos[i + 1], tramo, false);
      restringir(puntos[TRAMOS], puntos[TRAMOS + 1], pinzaPx + alto, true);
    }
  };

  // ── Dibujo ─────────────────────────────────────────────────────────────
  const aMundo = (x: number, y: number, z = 0, v = new THREE.Vector3()) =>
    v.set(x - W / 2, H / 2 - y, z);

  const dibujar = (dt: number) => {
    const { T, d } = ejes();
    const cx = T.x + d.x * (pinzaPx + alto / 2);
    const cy = T.y + d.y * (pinzaPx + alto / 2);
    aMundo(cx, cy, 0, tarjeta.position);

    // Darse vuelta: un resorte con poco freno, así pasa de largo y vuelve.
    const objetivo = encima || agarre ? Math.PI : 0;
    velGiro += ((objetivo - giro) * 170 - velGiro * 14) * dt;
    giro += velGiro * dt;
    // Y un poco de giro extra con la velocidad lateral: al balancearse la
    // tarjeta no queda plana contra la pantalla.
    const vx = (T.x - T.px) / PASO;
    const ladeo = Math.max(-0.45, Math.min(0.45, vx * 0.0006));
    tarjeta.rotation.set(0, giro + ladeo, Math.atan2(d.x, d.y));

    // La cinta: una curva suave por los puntos de la cuerda, convertida en
    // una tira plana del ancho de la cinta.
    for (let i = 0; i <= TRAMOS; i++) aMundo(puntos[i].x, puntos[i].y, -2, curva.points[i]);
    const muestras = curva.getSpacedPoints(MUESTRAS);
    const anchoCinta = ancho * 0.16;
    let recorrido = 0;
    for (let i = 0; i <= MUESTRAS; i++) {
      const a = muestras[Math.max(0, i - 1)];
      const b = muestras[Math.min(MUESTRAS, i + 1)];
      let tx = b.x - a.x;
      let ty = b.y - a.y;
      const l = Math.hypot(tx, ty) || 1;
      tx /= l;
      ty /= l;
      if (i) recorrido += muestras[i].distanceTo(muestras[i - 1]);
      const p = muestras[i];
      const o = i * 6;
      posCinta[o] = p.x - ty * (anchoCinta / 2);
      posCinta[o + 1] = p.y + tx * (anchoCinta / 2);
      posCinta[o + 2] = p.z;
      posCinta[o + 3] = p.x + ty * (anchoCinta / 2);
      posCinta[o + 4] = p.y - tx * (anchoCinta / 2);
      posCinta[o + 5] = p.z;
      // El estampado repite cada `módulo` píxeles de cinta, con la
      // proporción del lienzo en el que se dibujó.
      const v = recorrido / (anchoCinta * (caras.cinta.height / caras.cinta.width));
      uvCinta.set([0, v, 1, v], i * 4);
      // Invisible bajo la nav y aparece en los 48px siguientes.
      const yPantalla = H / 2 - p.y;
      const t = Math.min(1, Math.max(0, (yPantalla - corte) / 48));
      const alfa = t * t * (3 - 2 * t);
      colorCinta[i * 8 + 3] = alfa;
      colorCinta[i * 8 + 7] = alfa;
    }
    geoCinta.attributes.position.needsUpdate = true;
    geoCinta.attributes.uv.needsUpdate = true;
    geoCinta.attributes.color.needsUpdate = true;

    renderer.render(escena, camara);
  };

  // ── El bucle, que se duerme cuando no hay nada que mover ───────────────
  let cuadro = 0;
  let ultimo = 0;
  let acumulado = 0;
  let quietos = 0;

  const bucle = (ahora: number) => {
    cuadro = 0;
    const dt = Math.min(0.05, ultimo ? (ahora - ultimo) / 1000 : PASO);
    ultimo = ahora;
    acumulado += dt;
    while (acumulado >= PASO) {
      paso();
      acumulado -= PASO;
    }
    dibujar(dt);

    let movimiento = Math.abs(velGiro) * 0.1;
    for (const p of puntos) movimiento += Math.abs(p.x - p.px) + Math.abs(p.y - p.py);
    movimiento += Math.abs(caida);
    quietos = movimiento < 0.02 && !agarre ? quietos + 1 : 0;
    if (quietos < 90 && activa) cuadro = requestAnimationFrame(bucle);
    else ultimo = 0;
  };

  function despertar() {
    quietos = 0;
    if (!cuadro && activa) cuadro = requestAnimationFrame(bucle);
  }

  medir();
  soltar();
  despertar();

  return {
    medir() {
      medir();
      despertar();
    },
    opacidad(v) {
      lienzo.style.opacity = String(v);
      const antes = activa;
      activa = v > 0.02;
      if (activa === antes) return;
      if (activa) {
        despertar();
      } else {
        agarre = null;
        if (encima) cursor('');
        encima = false;
      }
    },
    desplazar(scrollY) {
      subida = scrollY * 0.9;
      ancla.y = anclaBaseY - subida - caida;
      despertar();
    },
    refrescar() {
      texFrente.needsUpdate = true;
      texDorso.needsUpdate = true;
      texCinta.needsUpdate = true;
      teñirCanto();
      despertar();
      if (!cuadro) renderer.render(escena, camara);
    },
  };
}
