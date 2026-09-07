// AUTO-GENERADO por synxia-tokens 0.1.0 — NO editar a mano
//
// EXCEPCIÓN vendoreada a mano (PR-0 señales, 21-ago-2026): las familias
// senal-* pasan por el helper `senal()` para DARLES SOPORTE DE ALFA. Antes se
// definían como `var(--color-…)` pelado; un `bg-senal-urgente-suave/40` no
// emitía NINGUNA regla (Tailwind no puede inyectar opacidad en un var opaco) y
// el elemento quedaba invisible — la misma falla que dejó ciegos los semáforos
// clínicos de Aura (ver scripts/check-css-vars.mjs).
//
// Mecanismo: canales + <alpha-value>, EXACTAMENTE como Tailwind pinta sus
// propios colores (bg-red-50). Emite rgb(var(--x-rgb) / <alpha-value>): sin
// modificador Tailwind pone opacidad 1 -> color puro (cero pixeles), con /NN
// aplica la opacidad. Se prefirió a color-mix porque color-mix es inválido en
// navegadores anteriores a ~2023 (se descarta -> invisible: la misma falla que
// se cura); rgb(r g b / a) funciona desde 2017-2019. Cada var --x-rgb es el
// hermano en canales del hex --x en tokens.css: son la misma verdad dos veces.
// Redes que lo protegen: check-senal-alpha.mjs (el /NN emite y respeta la
// opacidad) y check-token-rgb-pares.mjs (canal == hex).
function senal(varRef) {
  return 'rgb(var(' + varRef + '-rgb) / <alpha-value>)'
}
module.exports = {
  theme: {
    extend: {
      colors: {
        // 200/300/400/800: escalones que el mapa de sustitución encontró EN USO
        // como teal-* a mano (tanda 1: login usa 300 y 800) y el preset no
        // tenía. Valores exactos de tailwindcss/colors — cero pixeles.
        // OJO: 500 sigue igual a 600 (bug preservado a propósito, fase 1);
        // el teal-500 real vive en la var --color-accion-500. Des-buguear el
        // 500 es decisión pendiente de Julu (24 usos vivos entre dashboard y
        // marketing dependen del bug).
        brand: { 50: '#FFF9F2', 100: '#FFF4E8', 200: '#FFE4C7', 300: '#FFCB94', 400: '#FFB05C', 500: '#FF7200', 600: '#FF7200', 700: '#DB6900', 800: '#A85000', 900: '#7A3B00' },
        ink: { 50: '#F4F6F9', 100: '#E5E9F0', 200: '#C8D0DC', 300: '#A3AFC2', 400: '#7484A0', 500: '#4D5F7D', 600: '#25344A', 700: '#1C2839', 800: '#141D2B', 900: '#14110E' },
        accion: { DEFAULT: 'var(--color-accion)', 50: 'var(--color-accion-50)', 100: 'var(--color-accion-100)', 500: 'var(--color-accion-500)', 700: 'var(--color-accion-700)', 900: 'var(--color-accion-900)' },
        // AÑADIDOS por synxia-tokens#10 (7-sep-2026): vivían sólo en el vendor
        // del dashboard (126 y 24 usos) y la referencia no los definía, así que
        // el guardián no los vigilaba.
        'accion-texto': 'var(--color-accion-texto)',
        gris: { '000': 'var(--color-gris-000)', '050': 'var(--color-gris-050)', 100: 'var(--color-gris-100)', 200: 'var(--color-gris-200)', 300: 'var(--color-gris-300)', 400: 'var(--color-gris-400)', 500: 'var(--color-gris-500)', 600: 'var(--color-gris-600)', 900: 'var(--color-gris-900)' },
        // El color del TEXTO sobre el fondo de acción. Existe como clase para
        // que ningún botón vuelva a escribir el blanco a mano: blanco sobre el
        // naranja da 2.57 y reprueba; este token da 7.11.
        'sobre-accion': 'var(--color-sobre-accion)',
        fondo: { DEFAULT: 'var(--color-fondo)', elevado: 'var(--color-fondo-elevado)' },
        tinta: { DEFAULT: 'var(--color-tinta)', 400: 'var(--color-tinta-400)', 600: 'var(--color-tinta-600)', 900: 'var(--color-tinta-900)' },
        bordetoken: { DEFAULT: 'var(--color-borde)', activo: 'var(--color-borde-activo)' },
        // Los alias semánticos (suave/DEFAULT/viva/fuerte) siguen para los
        // consumidores ya tokenizados (StudiesSection, tanda 5-BIS). La rampa
        // numérica 50-950 es para la migración mecánica de red/amber/green-N →
        // senal-*-N (50/500/600/700 reusan los vars semánticos; el resto usa
        // los vars nuevos de tokens.css). TODO pasa por senal() → alfa-capaz.
        'senal-urgente': { DEFAULT: senal('--color-senal-urgente'), viva: senal('--color-senal-urgente-viva'), fuerte: senal('--color-senal-urgente-fuerte'), suave: senal('--color-senal-urgente-suave'), 50: senal('--color-senal-urgente-suave'), 100: senal('--color-senal-urgente-100'), 200: senal('--color-senal-urgente-200'), 300: senal('--color-senal-urgente-300'), 400: senal('--color-senal-urgente-400'), 500: senal('--color-senal-urgente-viva'), 600: senal('--color-senal-urgente'), 700: senal('--color-senal-urgente-fuerte'), 800: senal('--color-senal-urgente-800'), 900: senal('--color-senal-urgente-900'), 950: senal('--color-senal-urgente-950') },
        'senal-atencion': { DEFAULT: senal('--color-senal-atencion'), viva: senal('--color-senal-atencion-viva'), fuerte: senal('--color-senal-atencion-fuerte'), suave: senal('--color-senal-atencion-suave'), 50: senal('--color-senal-atencion-suave'), 100: senal('--color-senal-atencion-100'), 200: senal('--color-senal-atencion-200'), 300: senal('--color-senal-atencion-300'), 400: senal('--color-senal-atencion-400'), 500: senal('--color-senal-atencion-viva'), 600: senal('--color-senal-atencion'), 700: senal('--color-senal-atencion-fuerte'), 800: senal('--color-senal-atencion-800'), 900: senal('--color-senal-atencion-900'), 950: senal('--color-senal-atencion-950') },
        'senal-bien': { DEFAULT: senal('--color-senal-bien'), viva: senal('--color-senal-bien-viva'), fuerte: senal('--color-senal-bien-fuerte'), suave: senal('--color-senal-bien-suave'), 50: senal('--color-senal-bien-suave'), 100: senal('--color-senal-bien-100'), 200: senal('--color-senal-bien-200'), 300: senal('--color-senal-bien-300'), 400: senal('--color-senal-bien-400'), 500: senal('--color-senal-bien-viva'), 600: senal('--color-senal-bien'), 700: senal('--color-senal-bien-fuerte'), 800: senal('--color-senal-bien-800'), 900: senal('--color-senal-bien-900'), 950: senal('--color-senal-bien-950') },
        // acento2: el azul secundario, capturado tal cual (blue-N exactos). Mismo
        // helper de alfa que las señales (senal() -> rgb(var(--x-rgb)/<alpha>)).
        // Sólo los niveles en uso hoy. NO decide si colapsa a brand — eso es de Karla.
        // TENDENCIA (regla 2): conviene / no-conviene. Mismo helper de alfa.
        'tendencia-conviene': { DEFAULT: senal('--color-tendencia-conviene'), fuerte: senal('--color-tendencia-conviene-fuerte'), suave: senal('--color-tendencia-conviene-suave') },
        'tendencia-no-conviene': { DEFAULT: senal('--color-tendencia-no-conviene'), fuerte: senal('--color-tendencia-no-conviene-fuerte'), suave: senal('--color-tendencia-no-conviene-suave') },
        'acento2': { 50: senal('--color-acento2-50'), 100: senal('--color-acento2-100'), 200: senal('--color-acento2-200'), 500: senal('--color-acento2-500'), 600: senal('--color-acento2-600'), 700: senal('--color-acento2-700'), 800: senal('--color-acento2-800'), 900: senal('--color-acento2-900') },
      },
      // Escala tipográfica (24-ago-2026): 8 escalones anclados a lo que ya
      // dominaba. Solo font-size (la altura de línea no cambia al enchufar).
      fontSize: {
        'tipo-micro': 'var(--tipo-micro-tamano)',
        'tipo-etiqueta': 'var(--tipo-etiqueta-tamano)',
        'tipo-nota': 'var(--tipo-nota-tamano)',
        'tipo-texto-denso': 'var(--tipo-texto-denso-tamano)',
        'tipo-cuerpo': 'var(--tipo-cuerpo-tamano)',
        'tipo-subtitulo': 'var(--tipo-subtitulo-tamano)',
        'tipo-titulo': 'var(--tipo-titulo-tamano)',
        'tipo-titulo-grande': 'var(--tipo-titulo-grande-tamano)',
      },
      // Elevaciones (24-ago-2026): shadow-elevacion-1/2/3 + shadow-foco.
      boxShadow: {
        'elevacion-1': 'var(--sombra-elevacion-1)',
        'elevacion-2': 'var(--sombra-elevacion-2)',
        'elevacion-3': 'var(--sombra-elevacion-3)',
        'foco': 'var(--sombra-foco)',
      },
      fontFamily: {
        titulos: 'var(--tipografia-titulos)'.split(','),
        texto: 'var(--tipografia-texto)'.split(','),
      },
    },
  },
}
