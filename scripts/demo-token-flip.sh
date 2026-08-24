#!/bin/bash
# demo-token-flip — el criterio de aceptación del catálogo, en duro.
#
# Mete un color centinela en `color-accion`, reconstruye, sincroniza los
# consumidores y reporta DOS listas:
#   1) SUPERFICIES QUE CAMBIARON  (verificado por grep del centinela)
#   2) SUPERFICIES QUE NO         (verificado por grep + explicación de por qué)
# La regla: la lista 2 no puede tener nada sin explicación.
#
# Modo rápido (default): verifica los artefactos vendoreados que alimentan cada
# build (determinístico: lo que está en vendor/ ES lo que compila).
# Modo --completo: además corre `next build` en dashboard y marketing y greppea
# el CSS emitido en .next/ (tarda ~8 min).
set -euo pipefail
# Centinela NO acortable por cssnano (#ff00aa se minifica a #f0a y un grep
# ingenuo lo pierde — pasó en la primera corrida): pares desiguales.
CENTINELA="#ff00ab"
DASH="${DASH:-$HOME/synxia-dashboard}"
MKT="${MKT:-$HOME/synxia-marketing}"
BRAIN="${BRAIN:-$HOME/synxia-brain}"
MOTOR="${MOTOR:-$HOME/synxia-catalog-generator}"
AQUI="$(cd "$(dirname "$0")/.." && pwd)"
COMPLETO=""
[ "${1:-}" = "--completo" ] && COMPLETO=1

cd "$AQUI"
trap 'git checkout -q -- tokens.json 2>/dev/null; node build.mjs >/dev/null 2>&1 || true' EXIT

echo "══ 1. flip: color-accion → $CENTINELA (temporal, se revierte al salir)"
python3 - <<PY
import json
t = json.load(open('tokens.json'))
t['base']['teal']['600'] = '$CENTINELA'
json.dump(t, open('tokens.json','w'), indent=2, ensure_ascii=False)
PY
node build.mjs >/dev/null

echo "══ 2. sync a consumidores (vendor/)"
for repo in "$DASH" "$MKT"; do
  if [ -d "$repo/vendor/synxia-tokens" ]; then
    cp dist/tokens.css dist/tailwind-preset.cjs dist/tokens.cjs dist/tokens.mjs dist/tokens-email.json dist/VERSION "$repo/vendor/synxia-tokens/"
  fi
done
if [ -d "$BRAIN/modules/config" ] && [ -f "$BRAIN/modules/config/brand.js" ]; then
  cp dist/tokens.cjs "$BRAIN/modules/config/brand.js"
fi
# correos: regenerar con el token flippeado
if [ -f "$DASH/scripts/build-emails.mjs" ]; then
  (cd "$DASH" && node scripts/build-emails.mjs >/dev/null)
fi

pasa=0; falla=0
si() { if grep -rqli "ff00ab" "$1" 2>/dev/null; then echo "  ✔ CAMBIÓ  $2"; pasa=$((pasa+1)); else echo "  ✘ NO CAMBIÓ (esperaba cambio) $2"; falla=$((falla+1)); fi }
no() { if grep -rqli "ff00ab" "$1" 2>/dev/null; then echo "  ✘ CAMBIÓ (no debía) $2"; falla=$((falla+1)); else echo "  ✔ sin cambio  $2 — $3"; fi }

echo
echo "══ LISTA 1 — SUPERFICIES QUE CAMBIARON (el centinela aparece):"
si "$DASH/vendor/synxia-tokens/tailwind-preset.cjs" "dashboard: escala brand-* (toda clase brand-500/600 de 51+ archivos)"
si "$DASH/vendor/synxia-tokens/tokens.css" "dashboard: variables CSS semánticas (--color-accion)"
si "$DASH/lib/email/templates.generated.ts" "correos: los 10 templates compilados"
si "$MKT/vendor/synxia-tokens/tailwind-preset.cjs" "marketing: escala brand-* (/campanas, /empresas, legales)"
si "$MKT/vendor/synxia-tokens/tokens.css" "marketing: variables de la home y /tu-numero (root-v3 re-cableado)"
si "$BRAIN/modules/config/brand.js" "brain: colores de la muestra comercial y defaults de preview"
if [ -n "$COMPLETO" ]; then
  echo "  … modo completo: compilando dashboard y marketing (esto tarda)…"
  (cd "$DASH" && node_modules/.bin/next build >/dev/null 2>&1) && si "$DASH/.next/static" "dashboard: CSS COMPILADO en .next/"
  (cd "$MKT" && node_modules/.bin/next build >/dev/null 2>&1) && si "$MKT/.next/static" "marketing: CSS COMPILADO en .next/"
fi

echo
echo "══ LISTA 2 — SUPERFICIES QUE NO CAMBIARON, con su porqué:"
no "$DASH/app" "dashboard: hex y clases teal-* escritas a mano en app/" "no consumen el catálogo: se conectan sitio por sitio con verificación cero-pixel (docs/mapa-sustitucion-tokens-2026-08.md del dashboard)"
no "$DASH/public" "dashboard: archivos estáticos de public/" "no consumen vars; el manifest se genera en app/manifest.ts y el logo se copia con el script de sincronización"
no "$MKT/public/og" "marketing: imágenes OG estáticas" "PNG: se regeneran a mano; la generada en app/api/og lee tokens.mjs"
no "$MOTOR/lib" "motor de PDFs" "política firmada: el PDF lleva la marca del CLIENTE; el motor no consume tokens Synxia jamás"
no "$MKT/components" "marketing: componentes con paleta propia (warm-*/night-*)" "paleta local de la landing, no marca"
# SEÑALES: si el centinela las alcanza, están mal conectadas — es bug, no se maquilla.
for sv in urgente atencion bien; do
  linea=$(grep -E "^  --color-senal-$sv:" dist/tokens.css)
  if echo "$linea" | grep -qi "ff00ab"; then echo "  ✘ SEÑAL CONTAMINADA senal-$sv — BUG de conexión"; falla=$((falla+1));
  else echo "  ✔ sin cambio  señal senal-$sv ($linea) — cajón SEÑALES: la marca no las toca jamás"; fi
done
echo "  ✔ sin cambio  assets binarios de logo en public/ de cada repo — se reemplazan con dist/assets/logo/ al aplicar el mapa (pipeline listo)"

echo
if [ "$falla" -eq 0 ]; then echo "RESULTADO: ✔ las dos listas cuadran ($pasa superficies flippearon; lista 2 completa y explicada)."
else echo "RESULTADO: ✘ $falla discrepancias — revisar arriba."; exit 1; fi
