# Animation System (Nebulith engine) — design

> Status: **design + v1**. Documents the frame-based authoring vision; v1 builds a small extensible
> slice (like `docs/ability-system.md`). The current preset picker (flower-sway / lamp-flicker /
> bush-rustle) is opaque — this replaces it with author-defined frames.

## Goal

Let an author **define the animation of a set of tiles directly, as frames** — not pick from baked
presets. Pick some cells, define their default state, then add **frames** (each a state), set the
**duration** to run frame 1 → frame N, a **delay**, then it **loops**.

**Worked example (leaf wind):** select 4 leaf cells → frame 1 = static (default), frame 2 = slightly
right, frame 3 = slightly left, frame 4 = slightly right; duration = the time to move frame 1 → 4;
then delay; then re-loop. That simulates wind.

## Model

```ts
// One state of the animated cells. v1: a transform offset (+ optional variant/glyph swap).
interface AnimFrame {
  dx: number       // cell-relative X offset (fraction of a tile), e.g. +0.15 = "slightly right"
  dy: number       // Y offset
  rot?: number     // optional small rotation (radians) — sway/rustle
  scale?: number   // optional scale (pulse)
  // (later: tileImageId / variant for real-tile frame swaps)
}

interface CellAnimation {
  id: string
  cells: Cell[]            // the tile-set this animates (selected by the author)
  frames: AnimFrame[]      // frame 0 = default/rest; played 0 → N-1
  durationMs: number       // time to traverse frame 0 → last
  delayMs: number          // pause after a full run, before re-looping
  loop: boolean            // re-loop after delay (default true)
  trigger: 'always' | 'on-interact' | 'on-proximity'  // when it runs (default 'always' = ambient wind)
  ease?: 'linear' | 'sine' // interpolation between frames (sine reads as natural sway)
}
```

The renderer holds an animation clock; for each animated cell it finds the current frame pair from
`(now % (durationMs + delayMs))`, interpolates `dx/dy/rot/scale` between them (eased), and applies the
transform when drawing that cell's asset — in all three views. `delayMs` is dead time at the end
before the loop restarts.

## Authoring UI (replaces the opaque preset picker)

1. **Select the tiles** to animate (the existing cell-select).
2. **Frames:** "frame 0 = current (rest)"; **Add frame** captures/defines the next state. v1: each
   added frame is an **offset nudge** (dx/dy/rot via small steppers or a drag) — so "static → right →
   left → right" is 4 frames. A frame strip shows them; reorder/delete.
3. **Timing:** `durationMs` (frame 0 → last), `delayMs`, loop on/off, ease (linear/sine), trigger.
4. **Apply** → attaches the `CellAnimation` to those cells; **Preview** plays it live.

This is clearer than "pick flower-sway + mode + delay + trigger, Apply" because the AUTHOR defines the
motion (frames), not a hidden preset. The seeded presets become **starting templates** (flower-sway =
a 3-frame sine sway you can then tweak), not the only option.

## Real tiles (later)

When real tiles arrive, a frame can reference a **tile image** instead of (or with) a transform:
upload images or pick from a **tile database**, and a frame swaps the cell's image (classic
sprite-sheet animation) in addition to the transform. Documented; not in v1.

## v1 (this session)

- The `CellAnimation` model + a pure clock/interpolation helper (frame pair + eased lerp from `now`),
  unit-tested (frame selection across the loop incl. the delay tail; interpolation endpoints).
- Render: apply the interpolated transform (dx/dy/rot/scale) to an animated cell's asset in iso + 2D
  + top.
- UI: the frame-based authoring above — select cells, add/reorder/delete offset frames, set
  duration/delay/loop/ease, Apply + Preview. Keep the existing presets as one-click starting frames.
- A worked **leaf/flower wind** preset (the 4-frame sway) so wind works out of the box + demonstrates
  the model.

Deliberately **NOT** v1 (documented): real-tile image frames + the tile-image database/upload, a full
timeline scrubber, per-cell phase offsets across a tile-set (so a field of grass doesn't sway in
lockstep — a nice follow-up), and trigger logic beyond the three basic modes.
