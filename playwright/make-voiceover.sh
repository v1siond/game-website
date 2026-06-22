#!/usr/bin/env bash
# Generate + sync an AI voice-over onto recordings/demo-nebulith.mp4, placed on the
# spec's marks (recordings/nebulith-timeline.json). Adapted from demo-video-playbook.md
# Appendix D. Knobs: VOICE / RATE / PITCH / LEAD.
set -euo pipefail
REPO="${REPO:-$(cd "$(dirname "$0")/.." && pwd)}"
VIDEO="${VIDEO:-$REPO/recordings/demo-nebulith.mp4}"
TIMELINE="${TIMELINE:-$REPO/recordings/nebulith-timeline.json}"
OUT="${OUT:-$REPO/recordings/demo-nebulith-voiced.mp4}"
VOICE="${VOICE:-en-US-GuyNeural}"; RATE="${RATE:-+6%}"; PITCH="${PITCH:-+0Hz}"; LEAD="${LEAD:-0.25}"
WORK="$(mktemp -d)"; trap 'rm -rf "$WORK"' EXIT
dur(){ ffprobe -v error -show_entries format=duration -of default=nk=1:nw=1 "$1"; }
[ -f "$TIMELINE" ] || { echo "no timeline — record first"; exit 1; }

# One line per mark from the spec (SAME names), each written to its beat's length.
declare -A NARR
NARR[welcome]="This is Nebulith — an editor that builds whole game levels. Let's make a playable one from scratch."
NARR[forest]="Pick a zone and a layout, and it generates a navigable forest — varied trees, even charred dead trunks. Don't like it? Re-roll for a new one."
NARR[temple]="Switch to the lava zone and drop in a temple — a columned hall on a paved approach, themed automatically."
NARR[cave]="A cave carves itself with cellular automata — one connected, walkable cavern."
NARR[boss]="And a boss arena: a wide open room with the boss anchored at the far end."
NARR[play]="Then just play it — the same engine that built the level runs it, so you walk and jump right through."
NARR[twoD]="Prefer a classic look? Flip to the top-down 2D view — same level, instantly."

mapfile -t MARKS < <(node -e 'const t=JSON.parse(require("fs").readFileSync(process.argv[1],"utf8"));t.filter(x=>x.name!=="end").sort((a,b)=>a.t-b.t).forEach(x=>console.log(x.name+"\t"+x.t));' "$TIMELINE")
declare -A WAV_OF DUR_OF
for name in "${!NARR[@]}"; do
  mp3="$WORK/$name.mp3"; wav="$WORK/$name.wav"
  for a in 1 2 3; do edge-tts --voice "$VOICE" --rate="$RATE" --pitch="$PITCH" --text "${NARR[$name]}" --write-media "$mp3" >/dev/null 2>&1 && break; sleep 2; done
  ffmpeg -y -i "$mp3" -ar 48000 -ac 2 "$wav" >/dev/null 2>&1
  WAV_OF[$name]="$wav"; DUR_OF[$name]="$(dur "$wav")"
done

inputs=(); filter=""; ninput=0; cursor=0
for line in "${MARKS[@]}"; do
  name="${line%%$'\t'*}"; t="${line##*$'\t'}"; [ -z "${WAV_OF[$name]:-}" ] && continue
  start="$(awk "BEGIN{print $t + $LEAD}")"; d="${DUR_OF[$name]}"; gap=$(awk "BEGIN{g=$start-$cursor;print (g<0)?0:g}")
  ffmpeg -y -f lavfi -i "anullsrc=r=48000:cl=stereo" -t "$gap" "$WORK/g$ninput.wav" >/dev/null 2>&1
  inputs+=( -i "$WORK/g$ninput.wav" -i "${WAV_OF[$name]}" ); filter+="[$ninput:a][$((ninput+1)):a]"; ninput=$((ninput+2))
  cursor=$(awk "BEGIN{print $cursor + $gap + $d}")
done
filter+="concat=n=$ninput:v=0:a=1[a]"
ffmpeg -y "${inputs[@]}" -filter_complex "$filter" -map "[a]" "$WORK/vo.wav" >/dev/null 2>&1
ffmpeg -y -i "$VIDEO" -i "$WORK/vo.wav" -filter_complex "[1:a]apad,loudnorm=I=-16:TP=-1.5:LRA=11[a]" -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -ar 48000 -ac 2 -movflags +faststart -shortest "$OUT" >/dev/null 2>&1
echo "voiced → $OUT ($(dur "$OUT")s)"
# verify real speech is present (Flat factor ~0, RMS varying)
for s in 2 8 16 22; do ffmpeg -y -ss $s -i "$OUT" -t 6 -ac 1 "$WORK/c.wav" >/dev/null 2>&1 || continue; ffmpeg -i "$WORK/c.wav" -af astats=metadata=1 -f null - 2>&1 | grep -Ei "RMS level dB|Flat factor" | head -2 | tr '\n' ' '; echo " @${s}s"; done
