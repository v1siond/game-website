#!/usr/bin/env bash
# Turn a SILENT recording + its timeline into the final branded 4K demo:
#   intro card (prepend, shift marks) → outro card (append) → voice (if VOICEOVER set,
#   reads the shifted timeline) → music (if MUSIC set). Mirrors the playbook order
#   (cards → voice → music).
#
# Env:
#   IN          silent recording mp4              (default recordings/demo-nebulith-build.mp4)
#   TIMELINE    its timeline json                 (default recordings/nebulith-build-timeline.json)
#   OUT         final mp4                          (default recordings/demo-nebulith-build-final.mp4)
#   VOICEOVER   path to a voiceover script         (default playwright/make-build-voiceover.sh if present)
#   MUSIC       music bed path                     (optional; "" disables)
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$HERE/../.." && pwd)"
IN="${IN:-$REPO/recordings/demo-nebulith-build.mp4}"
TIMELINE="${TIMELINE:-$REPO/recordings/nebulith-build-timeline.json}"
OUT="${OUT:-$REPO/recordings/demo-nebulith-build-final.mp4}"
VOICEOVER="${VOICEOVER:-$REPO/playwright/make-build-voiceover.sh}"
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT

echo "1/4 intro card…"
VIDEO="$IN" OUT="$TMP/intro.mp4" TIMELINE="$TIMELINE" OUT_TIMELINE="$TMP/shifted.json" bash "$HERE/build-intro-card.sh"

echo "2/4 outro card…"
VIDEO="$TMP/intro.mp4" OUT="$TMP/branded.mp4" bash "$HERE/build-outro-card.sh"

CUR="$TMP/branded.mp4"
if [ -n "${VOICEOVER:-}" ] && [ -f "$VOICEOVER" ]; then
  echo "3/4 voice-over (shifted timeline)…"
  VIDEO="$CUR" TIMELINE="$TMP/shifted.json" OUT="$TMP/voiced.mp4" bash "$VOICEOVER" || { echo "voiceover failed — keeping silent branded cut"; cp "$CUR" "$TMP/voiced.mp4"; }
  CUR="$TMP/voiced.mp4"
else
  echo "3/4 voice-over skipped (no VOICEOVER script)"
fi

if [ -n "${MUSIC:-}" ]; then
  echo "4/4 music bed…"
  VIDEO="$CUR" OUT="$OUT" MUSIC="$MUSIC" bash "$HERE/add-music.sh"
else
  echo "4/4 music skipped"
  cp "$CUR" "$OUT"
fi
echo "FINAL → $OUT"
ffprobe -v error -show_entries stream=width,height,r_frame_rate:format=duration -of default=nk=1:nw=1 "$OUT" 2>/dev/null | tr '\n' ' '; echo
