# Tree-collision alignment, lava readability, forest density

Date: 2026-06-22

Engine suite 116/116 green (5× stable), tsc clean on every touched file.

## Tree "leaves don't block" — NOT a data bug

Added `collisionRoundTrip.test.ts`: `generateStage → stageToTemplate →
deserializeToGrid` (the exact path the loaded game uses) blocks every tree cell
EXCEPT `tree_leaf_top`. So collision data + movement (`grid.isBlocked`) are
correct. The symptom was the **renderer**: `drawIsoLabeledCell` lifted every glyph
by `tileH*0.45` (~half a cell north of the cell it blocks), so leaves *looked*
passable. Per the user's choice (keep walk-under canopy top), aligned the glyph to
its own cell (`cy = y`, the same anchor as the ground glyph). Now the leaf you see
is the cell that blocks; only the canopy TOP stays walkable.

## Lava readability — separate the layers

The lava floor, tree canopy, and lava all sat in one warm orange palette.
- **Trees** (`cellTileset.TREE_CANOPY_SHADES.lava`) → dark, slightly-cool charred
  greys (`#3e3942…`) so they read as burnt silhouettes, not orange like the lava.
- **Floor** (`village.ts` `ash`) → desaturated dark "burnt ground" with an ashy
  glyph (`░`/`·`), no longer molten ripples (`≈`) — so the bright lava HAZARD is
  the thing that pops. Value bands now separate: floor (mid) · trees (dark) · lava
  (bright) · player (bright yellow).
- (Color contrast must be confirmed in the browser; ASCII preview is monochrome.)

## Forest density — passages was ~60% trees

`layoutPassages` now thins twice and `layoutForestRooms` carves larger clearings
(min room 6, empty-slot chance 0.15→0.06). Passages dropped ~59% → ~40% tree cells
(~33% reduction), tighter variance; `open` (~24%) and `lake` (~34%) unchanged-ish.
Updated the two open-vs-passages relative-density test thresholds to the new
(intended) smaller margin.

## Files
`~ engine/cellTileset.ts` · `~ levels/village.ts` · `~ engine/stageGenerator.ts` ·
`~ pages/.../templates.tsx` · `~ scripts/preview-stage.ts` ·
`+ __tests__/engine/collisionRoundTrip.test.ts` · `~ stageGenerator.test.ts`

## NOTE
Visual changes (collision alignment, lava colors, density) verified via tests +
ASCII preview only — need a browser pass. The editor now auto-loads the last saved
template, so just open it.
