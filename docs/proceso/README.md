# Proceso de diseño · SteamBlock

Evidencia visual de cómo evolucionó la landing. **Cada captura se tomó
ejecutando el sitio en el commit indicado**, no es una reconstrucción: se creó
un *worktree* de git por etapa y se fotografió con Chromium a 1440 × 900
(escritorio) y 390 × 844 (móvil, iPhone 14).

## Etapas

| # | Captura | Commit | Fecha | Qué cambió |
|---|---|---|---|---|
| 0 | `00-boceto-estructura-*` | `7ab2f85` | 17 sep | Boceto estructural: la página sin color ni imágenes, solo bloques y etiquetas de sección |
| 1 | `01-base-naranja-*` | `126988e` | 14 sep | Landing original. Marca **SteamLock**, superficies de lámina de acero y acento **naranja de fragua** (`#C93C12`). Cuatro secciones: qué construimos, proyectos, proceso, tecnologías |
| 2 | `02-resenas-naranja-*`, `02b-*` | `5936c99` | 16 sep | Se agrega la sección de reseñas de clientes, en banda oscura |
| 3 | `03-nosotros-whatsapp-naranja-*`, `03b-*`, `03c-*` | `20e3c0a` | 17 sep | Sección *Quiénes somos*, cuarto proyecto (sistema de métricas) y el formulario que arma el mensaje y abre WhatsApp |
| 4 | `04-marca-steamblock-naranja-*` | `0d2f067` | 17 sep | Cambio de marca: **SteamLock → SteamBlock**. Última etapa con la paleta naranja |
| 5 | `05-paleta-azul-*`, `05b-*` | `15a42d5` | 17 sep | **Cambio de paleta a azul pastel.** Acero → azul, naranja → `#2F6BB0`, casi negro → navy `#17293D` |
| 6 | `06-movil-y-web-*` | `eb0a451` | 17 sep | Rediseño de la versión móvil y sexto servicio (páginas web) |
| 7 | `07-carruseles-final-*`, `07b-*` | `7ab2f85` | 17 sep | Carrusel de capturas en tres proyectos y sexto caso (clínica) |

## Material de apoyo

- **`08-sistema-de-diseno.png`** — las dos paletas con sus tokens y valores
  hexadecimales, más la escala tipográfica. Los colores se extrajeron leyendo
  el bloque `:root` de `css/base.css` en cada commit.
- **`09-comparativa-paleta.png`** — el mismo encabezado en naranja y en azul,
  lado a lado.
- **`10-comparativa-movil.png`** — antes y después del rediseño móvil: el cubo
  ocupaba la primera pantalla y dejaba el titular abajo del pliegue.

## Decisiones de diseño documentadas

1. **De naranja a azul.** La paleta original imitaba lámina de acero con un
   acento incandescente, apropiado para un discurso industrial. El azul pastel
   se eligió por ser más neutro y sobrio. Al cambiarla se renombraron las
   variables `--forge*` a `--accent*`, porque el nombre ya no describía el color.
2. **Contraste verificado.** Las 16 combinaciones de texto y fondo se midieron
   contra el mínimo de 4.5:1 de WCAG AA. Tres quedaron cortas en el primer
   intento (texto secundario 4.25; acento claro sobre banda oscura 3.73 y 3.30)
   y se ajustaron los tonos hasta que todas pasaron.
3. **El móvil no es la versión de escritorio encogida.** En un teléfono el orden
   del encabezado se invierte: primero el mensaje, después la ilustración.
4. **Alternancia de fondos.** Las secciones alternan claro / gris / oscuro. Cada
   sección nueva se colocó en la posición que conserva ese ritmo, no al final.

## Cómo se reproducen

```sh
git worktree add --detach /tmp/etapa-01 126988e   # cualquier commit de la tabla
# abrir /tmp/etapa-01/index.html en el navegador
```
