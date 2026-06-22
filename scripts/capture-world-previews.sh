#!/usr/bin/env bash
# Regenerate the World grid preview thumbnails.
#
# Renders each world's hero via headless Chrome (using the `?capture=<id>` override in
# ThemeProvider) and writes a small webp to public/world-previews/<id>.webp. The Worlds
# grid (WorldCard) shows these <img>s instead of mounting 16 live themed components.
#
# Re-run after changing a theme's hero. Requires the dev server running (npm run dev).
# Usage: bash scripts/capture-world-previews.sh [base_url]
set -euo pipefail

BASE="${1:-http://localhost:3000}"
OUT="public/world-previews"
TMP="$(mktemp -d)"
mkdir -p "$OUT"

IDS=(
  dark-fantasy survival-horror neon-portals soul-map adventure-paths
  rubber-hose retro-rpg bold-noir fighter-select art-deco retro-atomic
  neon-cyber cell-shaded silhouette mythic tropical-platformer medieval-fantasy
)

for id in "${IDS[@]}"; do
  echo "capturing $id ..."
  google-chrome --headless=new --hide-scrollbars --disable-gpu --no-sandbox \
    --window-size=1280,800 --virtual-time-budget=4500 \
    --screenshot="$TMP/$id.png" "$BASE/?capture=$id" >/dev/null 2>&1 || true
  if [ -f "$TMP/$id.png" ]; then
    cwebp -quiet -q 78 -resize 720 0 "$TMP/$id.png" -o "$OUT/$id.webp"
  else
    echo "  !! no screenshot for $id"
  fi
done

rm -rf "$TMP"
echo "done -> $OUT"
