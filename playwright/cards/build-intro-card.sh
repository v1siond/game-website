#!/usr/bin/env bash
# Prepend a branded 4K INTRO card to a (silent) recording and shift its timeline marks
# by the card duration, pinning `welcome` to t=0 so the opening line plays over the card.
# Env: VIDEO (in), OUT (out mp4), TIMELINE (in json, optional), OUT_TIMELINE (out json,
#      optional), INTRO_DUR (default 3).
set -euo pipefail
VIDEO="${VIDEO:?VIDEO required}"
OUT="${OUT:?OUT required}"
TIMELINE="${TIMELINE:-}"
OUT_TIMELINE="${OUT_TIMELINE:-}"
DUR="${INTRO_DUR:-3}"
W=3840; H=2160
FB="$(fc-match -f '%{file}' 'DejaVu Sans:bold' 2>/dev/null || echo /usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf)"
FR="$(fc-match -f '%{file}' 'DejaVu Sans' 2>/dev/null || echo /usr/share/fonts/truetype/dejavu/DejaVuSans.ttf)"
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
OUTEND="$(awk "BEGIN{print $DUR-0.5}")"

# Branded card (near-black bg, Nebulith yellow #facc15 title).
convert -size ${W}x${H} xc:'#0a0a12' \
  -font "$FB" -pointsize 300 -fill '#facc15' -gravity center -annotate +0-230 'NEBULITH' \
  -font "$FR" -pointsize 104 -fill '#e5e7eb' -gravity center -annotate +0+70 'AI-powered level-templating game engine' \
  -font "$FR" -pointsize 66  -fill '#9ca3af' -gravity center -annotate +0+240 'build a connected game from zero' \
  "$TMP/card.png"

# One pass: card (faded) + lanczos-upscaled main, concatenated at 4K/60.
ffmpeg -y -loop 1 -t "$DUR" -i "$TMP/card.png" -i "$VIDEO" -filter_complex \
  "[0:v]scale=${W}:${H},fps=60,format=yuv420p,fade=t=in:st=0:d=0.5,fade=t=out:st=${OUTEND}:d=0.5,setsar=1[a];\
   [1:v]scale=${W}:${H}:flags=lanczos,fps=60,format=yuv420p,setsar=1[b];\
   [a][b]concat=n=2:v=1:a=0[v]" \
  -map "[v]" -c:v libx264 -crf 18 -preset medium -pix_fmt yuv420p -movflags +faststart "$OUT" >/dev/null 2>&1

if [ -n "$TIMELINE" ] && [ -n "$OUT_TIMELINE" ] && [ -f "$TIMELINE" ]; then
  node -e 'const fs=require("fs");const d=+process.argv[2];const t=JSON.parse(fs.readFileSync(process.argv[1],"utf8")).map(m=>({name:m.name,t:m.name==="welcome"?0:m.t+d}));fs.writeFileSync(process.argv[3],JSON.stringify(t,null,2))' "$TIMELINE" "$DUR" "$OUT_TIMELINE"
fi
echo "intro card → $OUT (+${DUR}s)"
