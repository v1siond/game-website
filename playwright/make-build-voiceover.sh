#!/usr/bin/env bash
# Voice-over for the REAL multi-room build demo (recordings/demo-nebulith-build.mp4),
# placed on the build spec's marks. Same pipeline as make-voiceover.sh.
set -euo pipefail
REPO="${REPO:-$(cd "$(dirname "$0")/.." && pwd)}"
VIDEO="${VIDEO:-$REPO/recordings/demo-nebulith-build.mp4}"
TIMELINE="${TIMELINE:-$REPO/recordings/nebulith-build-timeline.json}"
OUT="${OUT:-$REPO/recordings/demo-nebulith-build-voiced.mp4}"
VOICE="${VOICE:-en-US-GuyNeural}"; RATE="${RATE:-+6%}"; PITCH="${PITCH:-+0Hz}"; LEAD="${LEAD:-0.25}"
WORK="$(mktemp -d)"; trap 'rm -rf "$WORK"' EXIT
dur(){ ffprobe -v error -show_entries format=duration -of default=nk=1:nw=1 "$1"; }
[ -f "$TIMELINE" ] || { echo "no timeline — record first"; exit 1; }

declare -A NARR
NARR[welcome]="Let's actually build a connected game in Nebulith — several rooms, wired together."
NARR[forest]="Generate the first room — a spring forest."
NARR[entities]="Drop in enemies and a quest-giver, then scatter a patrol pack — each with stats and movement."
NARR[temple]="Start a fresh template and generate an autumn temple."
NARR[connect]="Add a connector and link it back to a room we already saved."
NARR[cave]="A lava cave — the next room, connected to the last."
NARR[boss]="And the boss arena, wired to the cave."
NARR[flow]="Open the flow view: every level we built, connected into one game."

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
for s in 3 12 24 38; do ffmpeg -y -ss $s -i "$OUT" -t 5 -ac 1 "$WORK/c.wav" >/dev/null 2>&1 || continue; ffmpeg -i "$WORK/c.wav" -af astats=metadata=1 -f null - 2>&1 | grep -Ei "RMS level dB|Flat factor" | head -2 | tr '\n' ' '; echo " @${s}s"; done
