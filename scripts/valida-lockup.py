#!/usr/bin/env python3
"""Valida los lockups de la marca antes de darlos por buenos.

    python3 scripts/valida-lockup.py     (desde la raiz del repo)

POR QUE EXISTE (5-sep-2026): el logotipo es el punto ciego de las herramientas
que miden el producto. El auditor de contraste mide color sobre texto; el
detector de maquetacion mide cajas. Para los dos, un logotipo ROTO o EQUIVOCADO
es una imagen que esta donde debe. Ninguno sabe como debe verse la marca.

Las dos formas de fallar, las dos medidas el mismo dia:
  · ROTO: un nombre de token con doble guion dentro del comentario XML invalida
    el archivo y el logotipo desaparece de todas las pantallas que lo usan.
  · EQUIVOCADO: este repo -- la FUENTE -- guardaba una ese enroscada con
    "Synxia" en Fraunces mientras el producto ya usaba la marca aprobada.
    Peor que en un consumidor: desde aqui, cada sync la reponia.

En Python porque el parser XML viene en la libreria estandar: corre sin
`npm install`, igual en CI que en una terminal.
"""
import xml.etree.ElementTree as ET, pathlib, re, sys

NS = '{http://www.w3.org/2000/svg}'
CAT = pathlib.Path('dist/tokens.css').read_text()

def token(nombre):
    m = re.search(r'--' + re.escape(nombre) + r'\s*:\s*([^;]+);', CAT)
    assert m, f'✘ el catalogo no define {nombre}'
    return m.group(1).strip().upper()

# (archivo, color de la palabra, token de ese color)
PIEZAS = [
    ('logo/originales/lockup.svg',        '#0E1524', 'color-sobre-accion'),
    ('logo/originales/lockup-blanco.svg', '#FFFFFF', 'color-fondo-elevado'),
]
NARANJA, TOK_NARANJA = '#FF7D00', 'color-accion'
mal = 0

for arch, palabra, tok in PIEZAS:
    s = pathlib.Path(arch).read_text()
    try:
        raiz = ET.fromstring(s)
    except ET.ParseError as e:
        print(f'✘ {arch} NO PARSEA: {e}'); mal += 1; continue
    fills = [e.get('fill') for e in raiz.iter(NS + 'path')]
    if len(fills) != 7:
        print(f'✘ {arch}: esperaba 7 paths (1 estrella + 6 letras), hay {len(fills)}'); mal += 1; continue
    if fills.count(NARANJA) != 1 or fills.count(palabra) != 6:
        print(f'✘ {arch}: reparto de color {fills}'); mal += 1; continue
    if token(TOK_NARANJA) != NARANJA:
        print(f'✘ {TOK_NARANJA} vale {token(TOK_NARANJA)}, no {NARANJA}'); mal += 1; continue
    if token(tok) != palabra:
        print(f'✘ {tok} vale {token(tok)}, no {palabra}'); mal += 1; continue
    # La marca vieja no sobrevivio EN EL DIBUJO (el comentario la nombra a proposito).
    dibujo = re.sub(r'<!--.*?-->', '', s, flags=re.S)
    for r, q in [('A 22 22 0 1 1', 'los arcos de la ese'), ('0D9488', 'el teal'), ('Fraunces', 'la letra vieja')]:
        if r in dibujo:
            print(f'✘ {arch}: quedo {q}'); mal += 1
    for c in re.findall(r'<!--(.*?)-->', s, re.S):
        if '--' in c:
            print(f'✘ {arch}: doble guion dentro de un comentario XML'); mal += 1
    print(f'✔ {arch}  ·  7 paths  ·  estrella {NARANJA} ({TOK_NARANJA})  ·  palabra {palabra} ({tok})')

# CONTROLES: cada comprobacion se prueba rompiendola a proposito. Sin esto,
# un validador que no mira nada da el mismo verde que uno que si.
s = pathlib.Path(PIEZAS[0][0]).read_text()
# La mutacion se INYECTA en el primer comentario, en vez de buscar un texto que
# quiza no este. La primera version reemplazaba una frase concreta y, al
# reescribir el comentario, dejo de encontrarla: no mutaba nada y reportaba
# fallo del control. Un control que no muerde no prueba que la comprobacion
# sirva -- prueba que la mutacion no llego.
i = s.index('<!--') + 4
assert '<!--' in s, 'la pieza no tiene comentario: el control no puede morder'
roto = s[:i] + ' --inyectado-- ' + s[i:]
assert '--' in roto[i:i+20], 'la inyeccion no quedo: el control no mordio'
try:
    ET.fromstring(roto)
    print('✘ CONTROL 1: el parser acepto un comentario invalido'); mal += 1
except ET.ParseError:
    print('✔ control 1: con un doble guion inyectado, el parser SI falla')
if 'Fraunces' in re.sub(r'<!--.*?-->', '', s.replace('preserveAspectRatio', 'Fraunces'), flags=re.S):
    print('✔ control 2: la marca vieja en el dibujo SI se detecta')
else:
    print('✘ CONTROL 2: no la detecta'); mal += 1

sys.exit(1 if mal else 0)
