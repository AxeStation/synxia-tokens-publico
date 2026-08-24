// AUTO-GENERADO por synxia-tokens 0.1.0 — NO editar a mano
module.exports = {
  theme: {
    extend: {
      colors: {
        // 200/300/400/800: escalones con los valores exactos de tailwindcss/colors.
        // brand.500 se emite igual a brand.600 a propósito (compatibilidad con la
        // escala que los consumidores ya usaban); el 500 real de la escala vive
        // en la variable --color-accion-500.
        brand: { 50: '#f0fdfa', 100: '#ccfbf1', 200: '#99f6e4', 300: '#5eead4', 400: '#2dd4bf', 500: '#0d9488', 600: '#0d9488', 700: '#0f766e', 800: '#115e59', 900: '#134e4a' },
        ink: { 100: '#f4f4f2', 300: '#c8c8c8', 500: '#6b6b6b', 700: '#3f3f3f', 900: '#0a0a0a' },
        accion: { DEFAULT: 'var(--color-accion)', 50: 'var(--color-accion-50)', 100: 'var(--color-accion-100)', 500: 'var(--color-accion-500)', 700: 'var(--color-accion-700)', 900: 'var(--color-accion-900)' },
        fondo: { DEFAULT: 'var(--color-fondo)', elevado: 'var(--color-fondo-elevado)' },
        tinta: { DEFAULT: 'var(--color-tinta)', 400: 'var(--color-tinta-400)', 600: 'var(--color-tinta-600)', 900: 'var(--color-tinta-900)' },
        bordetoken: { DEFAULT: 'var(--color-borde)', activo: 'var(--color-borde-activo)' },
        'senal-urgente': { DEFAULT: 'var(--color-senal-urgente)', viva: 'var(--color-senal-urgente-viva)', fuerte: 'var(--color-senal-urgente-fuerte)', suave: 'var(--color-senal-urgente-suave)' },
        'senal-atencion': { DEFAULT: 'var(--color-senal-atencion)', viva: 'var(--color-senal-atencion-viva)', fuerte: 'var(--color-senal-atencion-fuerte)', suave: 'var(--color-senal-atencion-suave)' },
        'senal-bien': { DEFAULT: 'var(--color-senal-bien)', viva: 'var(--color-senal-bien-viva)', fuerte: 'var(--color-senal-bien-fuerte)', suave: 'var(--color-senal-bien-suave)' },
      },
      fontFamily: {
        titulos: 'var(--tipografia-titulos)'.split(','),
        texto: 'var(--tipografia-texto)'.split(','),
      },
    },
  },
}
