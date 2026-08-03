# Manual de Marca aplicado — Synapxix

Cómo se implementa la identidad visual de Synapxix en el código. Esta guía es
normativa: si una pantalla la contradice, la pantalla está mal.

> **Regla de oro:** ningún color, tipografía o radio de marca se escribe a mano.
> Todo sale de los tokens en [`libs/brand/src/tokens.css`](libs/brand/src/tokens.css).
> Si necesitás un valor que no existe, se agrega al token, no al componente.

---

## 1. Esencia

Tres ideas que toda decisión visual debe sostener:

| | Qué significa en pantalla |
|---|---|
| **Aprendizaje** | La interfaz guía, no examina. Nada debe sentirse como una prueba. |
| **Innovación** | Moderna y viva, sin caer en lo estridente. |
| **Confianza** | Legible, accesible, predecible. El foco siempre visible. |

## 2. Paleta

Cuatro colores oficiales. No se reinterpretan ni se sustituyen.

| Color | Hex | Token | Uso |
|---|---|---|---|
| Azul Synapxix | `#1E90FF` | `--sx-blue` | Color principal: acciones, enlaces, marca |
| Azul Profundo | `#0A4FBF` | `--sx-blue-deep` | Títulos, hover, texto de alto contraste |
| Azul Cielo | `#EAF3FF` | `--sx-sky` | Fondos suaves, superficies, estados sutiles |
| Blanco | `#FFFFFF` | `--sx-white` | Lienzo base |

Hay una escala derivada (`--sx-blue-50` … `--sx-blue-900`) para jerarquía. No son
colores nuevos: son el mismo azul con distinta intensidad.

### Contraste: cuándo usar cada azul

El Azul Synapxix es un azul brillante, y eso tiene una consecuencia práctica que
conviene tener presente:

| Sobre blanco | Contraste | Sirve para |
|---|---|---|
| `--sx-blue` `#1E90FF` | 3.03:1 | Rellenos, iconos, bordes, botones, **texto grande** (≥24px, o ≥19px en negrita) |
| `--sx-blue-deep` `#0A4FBF` | 7.28:1 | **Texto pequeño**, títulos, valores, cualquier dato legible |
| `--sx-text-muted` `#4C6C9A` | 4.6:1 | Texto secundario |

**No uses `--sx-blue` como color de texto pequeño sobre blanco**: no alcanza el
mínimo AA de WCAG (4.5:1). Es el error más fácil de cometer, porque el color se
ve bien pero no es legible para todo el mundo. Para eso está `--sx-blue-deep`.

Lo mismo aplica al acento teal: `--sx-chart-4` sirve para rellenos, y
`--sx-chart-4-text` es su variante legible como texto.

### Superficies: la interfaz es clara

El manual define un lienzo **blanco y azul cielo**, con el azul como acento. No
uses paneles oscuros ni glassmorphism sobre fondo negro: contradice "alto
contraste" y "tono cercano".

| Elemento | Token |
|---|---|
| Fondo de página | `--sx-blue-50` |
| Tarjetas y paneles | `--sx-white` + `1px solid var(--sx-border)` |
| Superficie destacada | `--sx-sky` |
| Sombra | `--sx-shadow-sm` / `-md` (teñidas de azul, nunca negro plano) |

### Colores de estado

`--sx-success`, `--sx-warning`, `--sx-danger` (con sus variantes `-soft`) existen
por necesidad funcional: un error tiene que leerse como error. **Se usan solo para
feedback** — validación, alertas, resultados. Nunca como color decorativo, de
marca, ni de fondo de sección.

### Gráficos

Usá la serie `--sx-chart-1` … `--sx-chart-6`. Está construida sobre el azul de
marca más neutros fríos.

**Prohibido en gráficos: violetas y rosas.** El manual los marca explícitamente
como uso incorrecto, y eran el problema más extendido en el código previo.

## 3. Tipografía

Sans serif **redondeada** — amigable, clara, moderna. La familia es **Nunito**,
vía `--sx-font`.

| Peso | Token | Uso |
|---|---|---|
| 400 | `--sx-weight-regular` | Texto corrido |
| 600 | `--sx-weight-medium` | Énfasis, etiquetas |
| 700 | `--sx-weight-bold` | Subtítulos, botones |
| 800 | `--sx-weight-black` | Títulos |

Nunca uses una sans no redondeada (Segoe UI, Roboto, Arial) como familia
principal: contradice el "tono cercano" del manual. Solo aparecen como fallback.

## 4. Principios visuales

| Principio | Cómo se aplica |
|---|---|
| **Formas redondeadas** | Siempre `--sx-radius-*`. Nada con esquina viva. Los botones usan `--sx-radius-pill`. |
| **Trazos simples** | Bordes de 1–2px, iconografía de línea. Sin ornamento. |
| **Alto contraste** | Texto en `--sx-text` (azul profundo) sobre blanco o cielo. Nunca gris claro sobre blanco. |
| **Tono cercano** | Lenguaje directo y cálido. Sin jerga ni tono examinador. |
| **Tecnología humana** | Sombras teñidas de azul (`--sx-shadow-*`), nunca negro plano. Transiciones suaves (`--sx-transition`). |

## 5. Logo

Reglas del manual, aplicables a cualquier uso en la interfaz:

**Sí**
- Usar el logo original y sus proporciones.
- Usar las versiones aprobadas del isotipo (principal y clara).
- Mantener los colores de la paleta.

**No**
- Distorsionar o estirar el logo. La clase `.sx-logo` fuerza `object-fit: contain`.
- Cambiar los colores corporativos.
- Agregar efectos, sombras propias o contornos.

## 6. Cómo usar los tokens

Los tokens se cargan globalmente en las dos apps; no hace falta importarlos por
componente.

```css
.tarjeta {
  background: var(--sx-surface);
  border: 1px solid var(--sx-border);
  border-radius: var(--sx-radius-lg);
  box-shadow: var(--sx-shadow-sm);
  color: var(--sx-text);
}

.boton-primario {
  background: var(--sx-blue);
  color: var(--sx-text-on-blue);
  border-radius: var(--sx-radius-pill);
  font-weight: var(--sx-weight-bold);
  transition: background var(--sx-transition);
}

.boton-primario:hover {
  background: var(--sx-blue-deep);
}
```

### Con Tailwind (`web-game` y `libs`)

La paleta está en `web-game/tailwind.config.js`:

```html
<div class="bg-sky text-blue-deep rounded-sx-lg">
  <button class="bg-synapxix hover:bg-blue-deep text-white rounded-sx-pill">
    Jugar
  </button>
</div>
```

Clases disponibles: `synapxix`, `blue-deep`, `sky`, la escala `blue-50…900`,
`success` / `warning` / `danger`, y los radios `rounded-sx-{sm,md,lg,xl,pill}`.

### En TypeScript (gráficos, canvas)

No hardcodees el hex. Leelo del token:

```ts
const brand = (token: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(token).trim();

const palette = [brand('--sx-chart-1'), brand('--sx-chart-2')];
```

## 7. Errores frecuentes

| Mal | Bien | Por qué |
|---|---|---|
| `color: #1b95fb` | `var(--sx-blue)` | `#1b95fb` era un azul heredado, no es el de marca (`#1E90FF`) |
| `background: #a78bfa` | `var(--sx-chart-3)` | El violeta está fuera de marca |
| `font-family: 'Segoe UI'` | `var(--sx-font)` | No es redondeada |
| `border-radius: 4px` | `var(--sx-radius-sm)` | Los radios son parte del sistema |
| `box-shadow: 0 2px 4px #0003` | `var(--sx-shadow-sm)` | Las sombras van teñidas de azul |
| `outline: none` en foco | Dejar el foco de `base.css` | La accesibilidad es parte de "confianza" |

## 8. Dónde vive cada cosa

| Archivo | Contenido |
|---|---|
| [`libs/brand/src/tokens.css`](libs/brand/src/tokens.css) | Todos los tokens. Fuente única de verdad. |
| [`libs/brand/src/base.css`](libs/brand/src/base.css) | Fundamentos sobre elementos base: tipografía, foco, formas. |
| [`web-game/tailwind.config.js`](web-game/tailwind.config.js) | Paleta y radios expuestos como utilidades de Tailwind. |
| `web-game/src/styles.scss` · `admin-frontend/src/styles.scss` | Cargan los dos archivos anteriores. |

## 9. Si tenés que agregar un color

1. Fijate si algún token existente sirve. Casi siempre sirve.
2. Si es una variación de intensidad del azul, usá la escala.
3. Si de verdad es nuevo, agregalo a `tokens.css` con un comentario que explique
   por qué la paleta oficial no alcanzaba, y actualizá esta guía.

Nunca lo agregues suelto en un componente: así fue como el proyecto terminó con
364 colores hardcodeados y cinco violetas distintos.
