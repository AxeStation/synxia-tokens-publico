# synxia-tokens

Catálogo de marca de Synxia: **color**, **tipografía** y **logo** en un solo
lugar. Las aplicaciones de Synxia no definen colores de marca por su cuenta:
los toman de aquí.

## Qué hay

- `tokens.json` — la fuente. `base` es la paleta cruda; `temas.claro` es la
  capa semántica (`color-accion`, `color-tinta`, `color-fondo`, señales…),
  que es lo único que consumen las aplicaciones. También declara la
  tipografía (familias, pesos, escala) y la receta de los derivados del logo.
- `logo/originales/` — un SVG original por pieza (símbolo, símbolo en trazo
  grueso, lockup, y sus variantes en blanco).
- `dist/` — lo generado, **commiteado a propósito**:
  - `tokens.css` — variables CSS (`--color-*`, `--tipografia-*`, `--tipo-*`).
  - `tailwind-preset.cjs` — preset de Tailwind (`brand.*`, `accion.*`,
    `tinta.*`, `senal-*`…).
  - `tokens.cjs` / `tokens.mjs` — los mismos valores para JavaScript.
  - `tokens-email.json` — el subconjunto que usan las plantillas de correo.
  - `assets/logo/` — SVG para web, favicons 16/32/64, íconos de app 512/1024,
    lockup para correo y la imagen circular para perfil de WhatsApp.
  - `VERSION` — versión + hash de los valores.

## Cómo se compila

```bash
npm install
npm run build      # regenera dist/ desde tokens.json y logo/originales/
```

`build.mjs` resuelve las referencias `{base.x.y}` de `tokens.json`, emite los
archivos de `dist/` y rasteriza los derivados del logo con `sharp`. Nada de
`dist/` se edita a mano.

## Cómo lo consumen las aplicaciones

Cada aplicación lleva una **copia commiteada** de `dist/` en su árbol
(`vendor/synxia-tokens/`) y compila con ella, sin red y sin instalar paquetes:
el preset entra en `tailwind.config`, `tokens.css` en los estilos globales, y
`tokens.mjs` donde hace falta el valor en JavaScript. El logo se copia de
`dist/assets/logo/` a la carpeta pública de cada aplicación con su script de
sincronización, que mantiene un mapa explícito de nombres.

Este repositorio es la **referencia** contra la que cada aplicación compara su
copia en integración continua; no es una dependencia del build.

## Convenciones

- Las escalas semánticas van por número: más alto = más oscuro
  (`color-accion-50…900`), y el nombre a secas (`color-accion`) es el alias
  del valor principal de la escala.
- Las **señales** (`color-senal-urgente`, `-atencion`, `-bien`) significan
  algo, no pertenecen a una marca: un cambio de paleta no las toca.
- Modo oscuro: no está definido hoy. Declarar `temas.oscuro` en `tokens.json`
  hace que el build emita los bloques `prefers-color-scheme` y `data-theme`.

## Licencia y uso

El logo y el nombre Synxia son marcas de su titular. Este repositorio se
publica para que las aplicaciones de Synxia lo lean como referencia; no
concede licencia sobre la marca.
