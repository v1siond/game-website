#!/usr/bin/env bash
# Append a branded 4K OUTRO / CTA card to a video. Env: VIDEO (in), OUT (out),
# OUTRO_DUR (default 3.5).
set -euo pipefail
VIDEO="${VIDEO:?VIDEO required}"
OUT="${OUT:?OUT required}"
DUR="${OUTRO_DUR:-3.5}"
W=3840; H=2160
FB="$(fc-match -f '%{file}' 'DejaVu Sans:bold' 2>/dev/null || echo /usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf)"
FR="$(fc-match -f '%{file}' 'DejaVu Sans' 2>/dev/null || echo /usr/share/fonts/truetype/dejavu/DejaVuSans.ttf)"
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
OUTEND="$(awk "BEGIN{print $DUR-0.6}")"

convert -size ${W}x${H} xc:'#0a0a12' \
  -font "$FB" -pointsize 240 -fill '#facc15' -gravity center -annotate +0-200 'NEBULITH' \
  -font "$FR" -pointsize 110 -fill '#e5e7eb' -gravity center -annotate +0+30 'generate.  connect.  play.' \
  -font "$FR" -pointsize 60  -fill '#9ca3af' -gravity center -annotate +0+210 'github.com/v1siond/game-website' \
  "$TMP/card.png"

ffmpeg -y -i "$VIDEO" -loop 1 -t "$DUR" -i "$TMP/card.png" -filter_complex \
  "[0:v]scale=${W}:${H}:flags=lanczos,fps=60,format=yuv420p,setsar=1[a];\
   [1:v]scale=${W}:${H},fps=60,format=yuv420p,fade=t=in:st=0:d=0.5,fade=t=out:st=${OUTEND}:d=0.5,setsar=1[b];\
   [a][b]concat=n=2:v=1:a=0[v]" \
  -map "[v]" -c:v libx264 -crf 18 -preset medium -pix_fmt yuv420p -movflags +faststart "$OUT" >/dev/null 2>&1
echo "outro card → $OUT (+${DUR}s)"
