#!/usr/bin/env bash
# Voice-over for the TUTORIAL demo (recordings/demo-nebulith-tutorial.mp4), placed on
# the tutorial spec's marks. Pass 1 also writes recordings/narration-durations.json,
# which the recorder's holdAct() reads so each beat holds ≥ its line (video matches script).
# Voice: Andrew (natural), per NEBULITH-DEMO-SCRIPT.md.
set -euo pipefail
REPO="${REPO:-$(cd "$(dirname "$0")/.." && pwd)}"
VIDEO="${VIDEO:-$REPO/recordings/demo-nebulith-tutorial.mp4}"
TIMELINE="${TIMELINE:-$REPO/recordings/nebulith-tutorial-timeline.json}"
OUT="${OUT:-$REPO/recordings/demo-nebulith-tutorial-voiced.mp4}"
DURATIONS="${DURATIONS:-$REPO/recordings/narration-durations.json}"
VOICE="${VOICE:-en-US-AndrewMultilingualNeural}"; RATE="${RATE:-+4%}"; PITCH="${PITCH:-+0Hz}"; LEAD="${LEAD:-0.25}"
WORK="$(mktemp -d)"; trap 'rm -rf "$WORK"' EXIT
dur(){ ffprobe -v error -show_entries format=duration -of default=nk=1:nw=1 "$1"; }

declare -A NARR
NARR[welcome]="Let's build a small game in Nebulith — a connected dungeon you can actually play, with no engine code."
NARR[generate]="Start from an empty grid. Pick a season and a layout, and one click lays out a navigable forest — paths, varied trees, a lake."
NARR[populate]="Now bring it to life. Drop in a few enemies and a quest-giver — each enemy already comes with stats and a patrol of its own."
NARR[quest]="Select the villager and give them a quest: slay three goblins — right here, no scripting."
NARR[play]="Press play and you're in. The same engine that built the room runs it — walk up and fight, with real combat."
NARR[save]="Happy with it? Save the room as a template."
NARR[connect]="Generate a second room — a temple — then drop a doorway that links it back to the forest."
NARR[expand]="Do the same for a cave and a boss room, each linked to the one before."
NARR[map]="Open the map: every room you built, wired together into one connected game."
NARR[closing]="From an empty grid to a playable, connected game in minutes. Open the editor and build your own."

# Pass 1: synthesize every line, measure duration.
declare -A WAV_OF DUR_OF
for name in "${!NARR[@]}"; do
  mp3="$WORK/$name.mp3"; wav="$WORK/$name.wav"
  for a in 1 2 3; do edge-tts --voice "$VOICE" --rate="$RATE" --pitch="$PITCH" --text "${NARR[$name]}" --write-media "$mp3" >/dev/null 2>&1 && break; sleep 2; done
  ffmpeg -y -i "$mp3" -ar 48000 -ac 2 "$wav" >/dev/null 2>&1
  WAV_OF[$name]="$wav"; DUR_OF[$name]="$(dur "$wav")"
done

# Write narration-durations.json (holdAct reads this in the recorder).
mkdir -p "$REPO/recordings"
DJ="{"; for n in "${!DUR_OF[@]}"; do DJ+="\"$n\":${DUR_OF[$n]},"; done; DJ="${DJ%,}}"
echo "$DJ" > "$DURATIONS"
echo "durations → $DURATIONS"

# If there's no timeline yet (seed pass), stop here — we only needed the durations.
[ -f "$TIMELINE" ] || { echo "no timeline yet — durations seeded, skipping mux"; exit 0; }

# Pass 2: place each line at its mark (cursor model; never overlap), mux onto the video.
mapfile -t MARKS < <(node -e 'const t=JSON.parse(require("fs").readFileSync(process.argv[1],"utf8"));t.filter(x=>x.name!=="end").sort((a,b)=>a.t-b.t).forEach(x=>console.log(x.name+"\t"+x.t));' "$TIMELINE")
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
for s in 4 14 28 44; do ffmpeg -y -ss $s -i "$OUT" -t 5 -ac 1 "$WORK/c.wav" >/dev/null 2>&1 || continue; ffmpeg -i "$WORK/c.wav" -af astats=metadata=1 -f null - 2>&1 | grep -Ei "RMS level dB|Flat factor" | head -2 | tr '\n' ' '; echo " @${s}s"; done
