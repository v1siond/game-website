# Robust cell tileset + lava-lake forest balance

Date: 2026-06-21

## Task

Continue the keystone work: build a robust ASCII tileset aligned with the
descriptive cell labels (corners included), style forests to the selected zone
(lava/frozen/default) so lava reads as lava, and give the lava-forest floor a
good balance of walkable land vs lava — the equivalent of water in a verdant
forest or ice in a frozen one.

## What changed

### NEW `src/engine/cellTileset.ts` — the single source of truth for appearance

The label→appearance mapping was scattered: glyphs lived in `cellLabels.ts`
(`LABEL_CHARS`), colors lived in `stageGenerator.ts` (`TREE_PALETTES` /
`BUILDING_PALETTES`). Consolidated into one tileset module:

- `cellTile(zone, label) → { char, color }` — the ONE place that decides what a
  labeled cell looks like, covering every label **including the 9-piece autotile
  corners** (`tree_top_left`…`tree_bottom_right`) and building parts.
- `cellGlyph(label)` — the zone-independent structural glyph.
- Corners stay structural (box-drawing, zone-independent) so a forest mass reads
  connected; only the COLOR carries the zone (charred lava, frosty frozen, green
  verdant). Unknown label → safe `'?'` fallback tile (never blank, never throws).
- Open/Closed: add a zone = add a row to `ZONE_VISUALS`; add a label = add a glyph.
  This is the ASCII→art swap point — when real tiles arrive, only this file changes.

### Refactor: `cellLabels.ts` = semantics, `cellTileset.ts` = presentation

- Removed `LABEL_CHARS` / `labelChar` from `cellLabels.ts` (moved to the tileset).
  `cellLabels.ts` now owns ONLY semantics: the label vocabulary, per-label
  collision (`isWalkable`), and autotile topology (`autotileLabel`).
- `stageGenerator.ts`: collapsed the near-duplicate `makeTreeCell`/`makeBuildingCell`
  (each computed its own glyph + color) into one `makeLabeledCell(zone,col,row,
  label,type)` that delegates appearance to `cellTile`. Deleted `TreePalette`,
  `TREE_PALETTES`, `BuildingPalette`, `BUILDING_PALETTES`, `treeColor`,
  `buildingColor`, the local `TRUNK_LABELS`/`BUILDING_PART_BY_LABEL`.

### Fix: lava-lake forest balance (`layoutLake`)

THE BUG: the `lake` layout started from a SOLID forest and only subtracted a
hazard disc + two thin gates → **~4% walkable** for blocking-hazard zones (lava,
water); a wall of trees with a pond in it, not a balanced level.

THE FIX: make the lake layout *additive* like `layoutPassages` — carve a
navigable distributed room + corridor network FIRST (the corridor MST connects
both shores on land), then open the lake body + a 2-cell lakeside clearing
(`openLakeside`) + wide edge↔lake gates, unify into one region, and only THEN
stamp the hazard. New helper `openLakeside`; everything else is reused passages
machinery (`layoutForestRooms`/`connectRooms`/`keepLargestClearing`).

Result (40×30): walkable land **lava 3.9%→46.6%, verdant 3.8%→52.1%**, hazard
held at a balanced ~18.5%, floor still one connected region.

### `src/levels/village.ts` (uncommitted from prior session, retained)

`rock`/`basalt`/`ash` re-tinted molten (warm stone + ember cracks) so the
lava-forest floor reads volcanic, not neutral gray. `GROUND_COLORS.lava` already
glows orange-red.

### NEW `scripts/preview-stage.ts` — dev tool

Prints an ASCII map + balance stats (walkable/hazard %, connectivity, autotile
label histogram) for any `ZONE`/`VARIANT`/`LAYOUT` — no DB, no server. Used to
measure the balance fix; reusable for future generator tuning.

## Tests (TDD)

- NEW `cellTileset.test.ts` (9): completeness for every (zone, label); corner
  glyphs map to box-drawing; corners zone-independent; zone tinting disjoint;
  trunk vs canopy; building parts; unknown-label fallback.
- `cellLabels.test.ts`: dropped the relocated glyph assertions.
- `stageGenerator.test.ts`: NEW lake-balance invariant — worst-of-8-runs walkable
  land > 30% for lava + verdant (RED at 3.7% before the fix), and hazard size
  stays 6–30%.

## Verification

Latest Node via nvm. `npx jest src/__tests__/engine/` → **94/94 green**.
`npx tsc --noEmit` → clean on every touched file (cellTileset, cellLabels,
stageGenerator, preview-stage).

## Standards

SOLID (SRP split semantics/presentation; OCP zone+label tables; DRY
`makeLabeledCell`), guard clauses, dispatch maps over if/else, small focused
helpers, immutable module constants, strict TS no `any`, TDD throughout.
