/**
 * El nombre de la apertura en 3D: letras infladas y brillantes, dibujadas
 * con WebGL dentro de la misma caja que ocupa el nombre plano.
 *
 * El reparto con Wordmark.astro es este: el viaje (trasladar y achicar) lo
 * sigue haciendo el CSS sobre la caja, que es lo que ya aterriza clavado en
 * la nav. Lo único que pasa acá es el giro, porque girar la malla —y no el
 * lienzo— es lo que hace que la luz corra por la letra y se vea el canto.
 *
 * Se carga aparte y solo en escritorio: Three.js pesa, y en un teléfono el
 * nombre plano hace el mismo recorrido sin costo.
 */
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export interface Nombre3D {
  /** `p` es el progreso del viaje, de 0 a 1: una vuelta entera. */
  girar(p: number): void;
  /** Vuelve a calcular lienzo y cámara a partir de la caja del nombre. */
  medir(): void;
}

// Caveat: la tinta ocupa 4.181 em de los 4.423 que avanza el texto (medido,
// ver Wordmark.astro). La malla se encuadra por su tinta, así que para que
// coincida con el nombre plano hay que apuntarle a esa fracción de la caja.
const TINTA = 4.181 / 4.423;

// Cuánto más grande que la caja es el lienzo. Al girar, la mitad que se
// acerca a la cámara crece y el canto sobresale: sin margen se cortaría.
const MARGEN_X = 1.3;
const MARGEN_Y = 2;

const FOV = 20;

export async function montarNombre3D(
  caja: HTMLElement,
  texto: string,
): Promise<Nombre3D | null> {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch {
    return null;
  }

  const respuesta = await fetch('/fonts/caveat-nombre.typeface.json');
  if (!respuesta.ok) {
    renderer.dispose();
    return null;
  }
  const fuente = new FontLoader().parse(await respuesta.json());

  // El inflado sale del bisel: `bevelThickness` lo levanta hacia la cámara
  // y `bevelSize` lo redondea hacia los costados. El bisel engorda el trazo
  // hacia afuera, así que `bevelOffset` lo mete un poco para adentro: si no,
  // las letras se empastan y el nombre ocupa más que el plano con el que
  // hace el relevo en la nav. Ese "para adentro" no puede pasar de 1: con
  // más, el contorno metido se cruza consigo mismo donde el palo de la T
  // encuentra el travesaño y la tapa se triangula con un tajo en V. El
  // tamaño baja lo mismo para que el canto exterior quede donde estaba.
  const geometria = new TextGeometry(texto, {
    font: fuente,
    size: 100,
    depth: 8,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 11,
    bevelSize: 3.1,
    bevelOffset: -1,
    bevelSegments: 10,
  });
  geometria.center();
  geometria.computeBoundingBox();
  const anchoMalla = geometria.boundingBox!.max.x - geometria.boundingBox!.min.x;

  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;

  const escena = new THREE.Scene();
  // Un cuarto de estudio como reflejo: es lo que le da a la laca las
  // ventanas de luz que corren por la letra al girar.
  const pmrem = new THREE.PMREMGenerator(renderer);
  escena.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();

  const luz = new THREE.DirectionalLight(0xffffff, 1.4);
  luz.position.set(-0.6, 1, 1.2);
  escena.add(luz);

  const material = new THREE.MeshPhysicalMaterial({
    roughness: 0.2,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
    iridescence: 0.35,
    iridescenceIOR: 1.3,
  });

  // El color sale del tema, no de acá: el tono del medio del degradado del
  // nombre plano, entre tinta y Rosewood, así el relevo con la nav no cambia
  // de color. Se carga hacia la tinta porque el reflejo del entorno aclara.
  const teñir = () => {
    const cs = getComputedStyle(document.documentElement);
    const tinta = cs.getPropertyValue('--color-ink').trim();
    const rosewood = cs.getPropertyValue('--color-rosewood').trim();
    if (!tinta || !rosewood) return;
    material.color.set(rosewood).lerp(new THREE.Color(tinta), 0.45);
  };
  teñir();

  const malla = new THREE.Mesh(geometria, material);
  escena.add(malla);

  const camara = new THREE.PerspectiveCamera(FOV, 1, 1, 10000);

  const lienzo = renderer.domElement;
  lienzo.setAttribute('aria-hidden', 'true');
  Object.assign(lienzo.style, {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
  });
  caja.appendChild(lienzo);

  let giro = -1;
  const pintar = () => renderer.render(escena, camara);

  const medir = () => {
    // offsetWidth/Height ignoran el transform del viaje: es la caja natural,
    // la misma que mide Wordmark para calcular el aterrizaje.
    const cs = getComputedStyle(caja);
    const relleno = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
    const anchoTinta = (caja.offsetWidth - relleno) * TINTA;
    if (!anchoTinta) return;

    const ancho = Math.round(caja.offsetWidth * MARGEN_X);
    const alto = Math.round(caja.offsetHeight * MARGEN_Y);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(ancho, alto);

    // La distancia de cámara que hace que la malla mida en pantalla lo mismo
    // que la tinta del nombre plano: alto visible = ancho de malla llevado a
    // la proporción del lienzo.
    const altoVisible = (anchoMalla * alto) / anchoTinta;
    camara.aspect = ancho / alto;
    camara.position.set(0, 0, altoVisible / (2 * Math.tan((FOV * Math.PI) / 360)));
    camara.updateProjectionMatrix();
    pintar();
  };

  new MutationObserver(() => {
    teñir();
    pintar();
  }).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-tema'],
  });

  medir();

  return {
    medir,
    girar(p) {
      const nuevo = p * Math.PI * 2;
      if (nuevo === giro) return;
      giro = nuevo;
      malla.rotation.y = nuevo;
      pintar();
    },
  };
}
