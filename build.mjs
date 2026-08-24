// build.mjs — genera dist/ desde tokens.json + logo/originales/.
// Todo lo de dist/ se COMMITEA: los consumidores lo vendorean con
// su script de sincronización (sin instalar paquetes: compilan con lo que hay en el árbol).
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = dirname(fileURLToPath(import.meta.url))
const T = JSON.parse(readFileSync(join(ROOT, 'tokens.json'), 'utf8'))
const DIST = join(ROOT, 'dist')
mkdirSync(join(DIST, 'assets', 'logo'), { recursive: true })

// ── resolución de referencias {base.x.y} ────────────────────────────────────
function resolve(v) {
  if (typeof v !== 'string') return v
  const m = /^\{(.+)\}$/.exec(v)
  if (!m) return v
  let cur = T
  for (const k of m[1].split('.')) cur = cur[k]
  if (typeof cur !== 'string') throw new Error('referencia rota: ' + v)
  return cur
}

const claro = {}
for (const [k, v] of Object.entries(T.temas.claro)) {
  if (k.startsWith('$')) continue
  claro[k] = resolve(v)
}
const oscuro = T.temas.oscuro
  ? Object.fromEntries(Object.entries(T.temas.oscuro).filter(([k]) => !k.startsWith('$')).map(([k, v]) => [k, resolve(v)]))
  : null

// ── dist/tokens.css ─────────────────────────────────────────────────────────
// Patrón de 3 estados listo para el día que exista `temas.oscuro`:
// :root = claro completo; @media(dark) con guard :not([data-theme=light]);
// [data-theme=dark] gana en la otra dirección. Hoy solo se emite claro.
let css = '/* AUTO-GENERADO por synxia-tokens ' + T.version + ' — NO editar a mano */\n:root {\n'
for (const [k, v] of Object.entries(claro)) css += `  --${k}: ${v};\n`
const f = T.tipografia.familias
css += `  --tipografia-titulos: ${f.titulos.nombre ? `'${f.titulos.nombre}', ` : ''}${f.titulos.fallback};\n`
css += `  --tipografia-texto: ${f.texto.nombre ? `'${f.texto.nombre}', ` : ''}${f.texto.fallback};\n`
css += `  --tipografia-datos: ${f.datos.fallback};\n`
for (const [nombre, e] of Object.entries(T.tipografia.escala)) {
  css += `  --tipo-${nombre}-tamano: ${e.tamano};\n  --tipo-${nombre}-peso: ${e.peso};\n  --tipo-${nombre}-interlineado: ${e.interlineado};\n`
  if (e.espaciado) css += `  --tipo-${nombre}-espaciado: ${e.espaciado};\n`
}
css += '}\n'
if (oscuro) {
  css += '@media (prefers-color-scheme: dark) {\n  :root:not([data-theme="light"]) {\n'
  for (const [k, v] of Object.entries(oscuro)) css += `    --${k}: ${v};\n`
  css += '  }\n}\n:root[data-theme="dark"] {\n'
  for (const [k, v] of Object.entries(oscuro)) css += `  --${k}: ${v};\n`
  css += '}\n'
}
writeFileSync(join(DIST, 'tokens.css'), css)

// ── dist/tailwind-preset.cjs ────────────────────────────────────────────────
// Reproduce EXACTAS las escalas brand.*/ink.* que hoy declaran los dos
// tailwind.config (brand.500 se emite igual a brand.600 a propósito, para
// reproducir exactamente la escala que ya usaban) + agrega los semánticos como
// clases accion/fondo/tinta vía CSS vars.
const b = T.base
const preset = `// AUTO-GENERADO por synxia-tokens ${T.version} — NO editar a mano
module.exports = {
  theme: {
    extend: {
      colors: {
        // 200/300/400/800: escalones con los valores exactos de tailwindcss/colors.
        // brand.500 se emite igual a brand.600 a propósito (compatibilidad con la
        // escala que los consumidores ya usaban); el 500 real de la escala vive
        // en la variable --color-accion-500.
        brand: { 50: '${b.teal['50']}', 100: '${b.teal['100']}', 200: '${b.teal['200']}', 300: '${b.teal['300']}', 400: '${b.teal['400']}', 500: '${b.teal['600']}', 600: '${b.teal['600']}', 700: '${b.teal['700']}', 800: '${b.teal['800']}', 900: '${b.teal['900']}' },
        ink: { 100: '${b.escalaInk['100']}', 300: '${b.escalaInk['300']}', 500: '${b.escalaInk['500']}', 700: '${b.escalaInk['700']}', 900: '${b.escalaInk['900']}' },
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
`
writeFileSync(join(DIST, 'tailwind-preset.cjs'), preset)

// ── dist/tokens.cjs + .mjs + tokens-email.json ─────────────────────────────
const flat = { ...claro, version: T.version }
const hash = createHash('sha256').update(JSON.stringify(flat)).digest('hex').slice(0, 12)
flat.hash = hash
writeFileSync(join(DIST, 'tokens.cjs'),
  '// AUTO-GENERADO por synxia-tokens ' + T.version + ' (hash ' + hash + ') — NO editar a mano\n'
  + 'module.exports = ' + JSON.stringify(flat, null, 2) + '\n')
writeFileSync(join(DIST, 'tokens.mjs'),
  '// AUTO-GENERADO por synxia-tokens ' + T.version + ' (hash ' + hash + ') — NO editar a mano\n'
  + 'export default ' + JSON.stringify(flat, null, 2) + '\n')
writeFileSync(join(DIST, 'tokens-email.json'), JSON.stringify({
  version: T.version, hash,
  'color.accion': claro['color-accion'],
  'color.accion-100': claro['color-accion-100'],
  'color.fondo': claro['color-fondo'],
  'color.correo-fondo-exterior': claro['color-correo-fondo-exterior'],
  'color.correo-aviso': claro['color-correo-aviso'],
}, null, 2) + '\n')

// ── logos derivados ─────────────────────────────────────────────────────────
const orig = (k) => join(ROOT, T.logo.originales[k])
copyFileSync(orig('simbolo'), join(DIST, 'assets', 'logo', 'web-simbolo.svg'))
copyFileSync(orig('lockup'), join(DIST, 'assets', 'logo', 'web-lockup.svg'))
// Las variantes que los consumidores YA sirven desde public/logo/ (medido
// 23-ago-2026: dashboard = simbolo-bold; marketing = lockup-blanco y
// simbolo-blanco, byte-idénticos a estos originales). Sin esto, el sync no
// tenía de dónde copiarlas y quedaban tatuadas con el color viejo.
copyFileSync(orig('simbolo-trazo-grueso'), join(DIST, 'assets', 'logo', 'web-simbolo-bold.svg'))
copyFileSync(orig('lockup-blanco'), join(DIST, 'assets', 'logo', 'web-lockup-blanco.svg'))
copyFileSync(orig('simbolo-blanco'), join(DIST, 'assets', 'logo', 'web-simbolo-blanco.svg'))

async function png(deKey, out, opts = {}) {
  const buf = readFileSync(orig(deKey))
  let img = sharp(buf, { density: 300 })
  if (opts.lado) {
    const margen = Math.round((opts.margen || 0) * opts.lado)
    const interior = opts.lado - margen * 2
    img = img.resize(interior, interior, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    let composed = sharp({ create: { width: opts.lado, height: opts.lado, channels: 4, background: opts.fondo ? hexRgb(opts.fondo) : { r: 0, g: 0, b: 0, alpha: 0 } } })
      .composite([{ input: await img.png().toBuffer(), left: margen, top: margen }])
    if (opts.circular) {
      const r = opts.lado / 2
      const mask = Buffer.from(`<svg width="${opts.lado}" height="${opts.lado}"><circle cx="${r}" cy="${r}" r="${r}" fill="#fff"/></svg>`)
      composed = sharp(await composed.png().toBuffer()).composite([{ input: mask, blend: 'dest-in' }])
    }
    await composed.png().toFile(join(DIST, 'assets', 'logo', out))
  } else if (opts.ancho) {
    await img.resize({ width: opts.ancho }).png().toFile(join(DIST, 'assets', 'logo', out))
  }
}
function hexRgb(ref) {
  const h = resolve(ref).replace('#', '')
  return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16), alpha: 1 }
}

await png('lockup', 'correo-lockup.png', { ancho: 1200 })
await png('simbolo-trazo-grueso', 'favicon-16.png', { lado: 16 })
await png('simbolo-trazo-grueso', 'favicon-32.png', { lado: 32 })
await png('simbolo-trazo-grueso', 'favicon-64.png', { lado: 64 })
await png('simbolo', 'app-icon-512.png', { lado: 512, fondo: '{base.fondo.pagina}', margen: 0.16 })
await png('simbolo', 'app-icon-1024.png', { lado: 1024, fondo: '{base.fondo.pagina}', margen: 0.16 })
await png('simbolo-blanco', 'whatsapp-circular-640.png', { lado: 640, fondo: '{base.teal.600}', margen: 0.2, circular: true })
// el preview de 40px se deriva del circular ya compuesto
await sharp(join(DIST, 'assets', 'logo', 'whatsapp-circular-640.png')).resize(40, 40).png().toFile(join(DIST, 'assets', 'logo', 'whatsapp-preview-40.png'))

writeFileSync(join(DIST, 'VERSION'), T.version + ' ' + hash + '\n')
console.log('build OK — versión ' + T.version + ' hash ' + hash)
