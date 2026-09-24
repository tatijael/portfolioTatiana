#!/usr/bin/env bash
# Genera public/cv.pdf a partir de src/pages/cv.astro.
# Corre el build, levanta el preview y lo imprime con Chrome headless.
# Después hay que volver a hacer build/deploy para que el PDF nuevo se publique.
set -euo pipefail
cd "$(dirname "$0")/.."

CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
PORT=4399

npx astro build >/dev/null
npx astro preview --port "$PORT" >/dev/null 2>&1 &
PREVIEW=$!
trap 'kill "$PREVIEW" 2>/dev/null || true' EXIT

for _ in $(seq 1 50); do
  curl -sf "http://localhost:$PORT/cv/" >/dev/null && break
  sleep 0.2
done

"$CHROME" --headless=new --disable-gpu --no-pdf-header-footer \
  --virtual-time-budget=3000 \
  --print-to-pdf="public/cv.pdf" "http://localhost:$PORT/cv/" 2>/dev/null

echo "public/cv.pdf listo"
