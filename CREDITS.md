# Créditos de imágenes

Las tres fotografías de cielo son **CC0 (dominio público)** de Wikimedia Commons.
CC0 **no exige atribución** — este archivo existe por buena práctica y para que
sepas de dónde salió cada una si algún día querés reemplazarlas o buscar más del
mismo autor.

| Archivo | Origen | Autor | Licencia |
|---|---|---|---|
| `public/images/sky-hero.jpg` | [Sea sky and clouds, Ibiza, Spain](https://commons.wikimedia.org/wiki/File:Sea_sky_and_clouds,_Ibiza,_Spain.jpg) | Joselodos | CC0 |
| `public/images/sky-warm.jpg` | [Sun Sunset Sky](https://commons.wikimedia.org/wiki/File:Sun_Sunset_Sky.jpg) | Autor no identificado | CC0 |
| `public/images/sky-poster.jpg` | [Sky Clouds Sun](https://commons.wikimedia.org/wiki/File:Sky_Clouds_Sun.jpg) | Autor no identificado | CC0 |

Las tres se recortaron y se recomprimieron a JPEG calidad 80. Ninguna se
reencuadró de forma que altere lo que muestra.

## Cómo se eligió cada recorte

No fue estético nomás: cada foto se midió antes de entrar.

- **`sky-hero.jpg`** — mitad superior de la original (el resto era mar). Con
  texto Ink encima mide entre 10.9:1 y 12.4:1 en todas las zonas de texto del
  hero, sin necesidad de ningún velo. Se usa también en la sección del poster,
  reencuadrada abajo con `.air-sky--low`.
- **`sky-warm.jpg`** — franja donde el celeste baja a dorado, por encima del mar
  oscuro. Su punto más oscuro daba 4.16:1 con Ink, apenas por debajo de AA; el
  velo blanco del 12% (`.air-veil`) lo lleva a 4.82:1.
- **`sky-poster.jpg`** — **no lleva texto encima.** Es una foto de rango
  dinámico muy alto: en cualquier recorte hay píxeles casi blancos y casi
  negros a la vez, así que ni Ink ni Whiteout llegan a AA sobre ella. Se usa
  solo como imagen pura en las tarjetas de proyecto.

## Fuentes

Inter, Anton y Caveat, todas SIL Open Font License 1.1, instaladas como
paquetes npm (`@fontsource*`) y servidas desde el propio dominio.

## Si reemplazás una foto

Medí antes de publicar. El método está en el README, sección *Imágenes*: se
renderiza la foto a un canvas, se muestrea la zona donde va el texto y se
calcula el contraste real contra el color de texto que vas a usar.
