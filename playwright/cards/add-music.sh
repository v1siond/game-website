#!/usr/bin/env bash
# Mix a soft background music bed under the existing (voice) audio. Best-effort: if no
# MUSIC track is given/found, copies the input through unchanged. Env: VIDEO (in),
# OUT (out), MUSIC (path, default = auditechme's royalty-free bed if present), MUSIC_VOL.
set -euo pipefail
VIDEO="${VIDEO:?VIDEO required}"
OUT="${OUT:?OUT required}"
MUSIC="${MUSIC:-/home/visiond/projects/auditechme/recordings/previews/music-bed-only.mp3}"
MUSIC_VOL="${MUSIC_VOL:--24dB}"

if [ ! -f "$MUSIC" ]; then
  echo "add-music: no music bed at '$MUSIC' — copying through (no music)."
  cp "$VIDEO" "$OUT"
  exit 0
fi
# Has the video an audio track to mix under?
if ! ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 "$VIDEO" | grep -q .; then
  echo "add-music: input has no audio track — copying through."
  cp "$VIDEO" "$OUT"
  exit 0
fi
# Loop the bed, drop it well under the voice, mix; keep length = video.
ffmpeg -y -i "$VIDEO" -stream_loop -1 -i "$MUSIC" -filter_complex \
  "[1:a]volume=${MUSIC_VOL},aformat=sample_rates=48000:channel_layouts=stereo[m];\
   [0:a][m]amix=inputs=2:duration=first:dropout_transition=0:normalize=0,loudnorm=I=-16:TP=-1.5:LRA=11[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart "$OUT" >/dev/null 2>&1
echo "music bed → $OUT (vol ${MUSIC_VOL})"
