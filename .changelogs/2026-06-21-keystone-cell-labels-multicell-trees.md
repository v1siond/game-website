# Keystone — cell labels + multi-cell labeled assets + per-label collision

Date: 2026-06-21

## Original task

Build the KEYSTONE — cell labels + multi-cell labeled assets + per-label
collision — the foundation for ASCII→tileset. Owned files ONLY:
`src/engine/cellLabels.ts` (new), `src/engine/stageGenerator.ts`,
`src/__tests__/engine/stageGenerator.test.ts`. (Plus a new test for cellLabels.)

THE PROBLEM: a tree occupied only its base cell, so its tall canopy visually
covered "free" cells above → misleading + wrongly walkable. FIX = multi-cell
labeled assets, each occupied cell labeled, collision decided PER LABEL.

## What changed

### NEW `src/engine/cellLabels.ts` (pure logic, ~160 lines)

- **Label vocabulary** (`CELL_LABELS` `as const` union → `CellLabel` type):
  - Tree column (single trunk+canopy, bottom→top): `tree_stem_bottom`,
    `tree_stem`, `tree_leaf`, `tree_leaf_top`.
  - Tree mass 9-piece autotile: `tree_top_left`, `tree_top`, `tree_top_right`,
    `tree_edge_left`, `tree_interior`, `tree_edge_right`, `tree_bottom_left`,
    `tree_bottom`, `tree_bottom_right`.
  - Building: `roof_top`, `roof`, `wall`, `door`, `window`.
- **`isWalkable(label)`** — per-label collision via a `ReadonlySet` membership
  lookup (no if/else chain). Walkable set = `tree_leaf_top`, `roof_top`, `door`.
  Everything else — and any unknown label — BLOCKS (fail-safe). Matches the
  contract: every tree cell blocks except the canopy top; every building cell
  blocks except the top roof tile + doors.
- **`labelChar(label)`** — render glyph map (`Record<CellLabel,string>`), unknown
  → `'?'`. Canopy top (`♣`) reads differently from solid leaves (`@`).
- **Autotile labeler** `autotileLabel(family, filled, col, row)` — labels a filled
  mass cell from its orthogonal-neighbour openness via an EXHAUSTIVE 16-entry
  signature→slot dispatch table (pure lookup, zero branching). `MassFamily`
  interface + `TREE_MASS_FAMILY` make it Open/Closed (add a family, not a branch).
  Out-of-bounds counts as not-filled (an edge). 3-4-open-sides (thin/lone) collapse
  onto the nearest outer corner so they never read as interior.

### `src/engine/stageGenerator.ts`

- `StageProp` gained `label?: string` (drives per-label collision + ASCII→tileset).
- Removed single-cell `makeTree`; added `makeTreeCell(col,row,label)` that derives
  `char`, `color` (brown trunk vs green canopy), and `blocking = !isWalkable(label)`
  from the label.
- `scatterGladeTrees` now stamps **multi-cell** trees: `stampTree` writes the full
  vertical column (`tree_stem_bottom → tree_stem → tree_leaf → tree_leaf_top`),
  setting per-cell collision from `isWalkable` (only the canopy top is walkable).
  `treeFits` guards: whole column in-bounds + on open ground (so it never punches a
  walkable hole through the mass or stacks two props on a cell) AND the canopy top
  keeps an open lateral neighbour (so the walkable top is never an isolated pocket →
  connectivity preserved). `row` range gets headroom for the canopy.
- `commitTrees` (forest mass) now AUTOTILES each filled cell via
  `autotileLabel(TREE_MASS_FAMILY, …)` (OOB = not-tree) and sets collision from the
  label — every mass label blocks (solid canopy).

### `src/__tests__/engine/stageGenerator.test.ts` + NEW `cellLabels.test.ts`

- `cellLabels.test.ts`: `tree_leaf_top`/`roof_top`/`door` walkable, all other tree
  + building labels block, unknown label blocks; every label has a glyph; canopy
  top glyph ≠ leaf glyph; autotile labels correct for a 3×3 mass (all 9 pieces),
  a lone cell, and a 5×5 mass (only true interior is interior).
- `stageGenerator.test.ts` (appended, existing untouched): every tree prop is
  labeled; `blocking` + live collision agree with `isWalkable(label)`; glade trees
  are multi-cell columns with exactly one walkable `tree_leaf_top` and the cells
  under it block; forest stays connected (every walkable cell reachable from spawn).

## Standards

Guard clauses + early returns, dispatch maps (signature→slot, walkable Set,
char/family records) instead of if/else chains, small SRP helpers, strict TS no
`any`, immutable module constants, autotiling per docs/ALGORITHMS.md. Did NOT touch
templates.tsx, zones.ts, buildingComposer.ts (other agents own them).

## Verification

Per [[feedback-use-nvm]] (latest Node via nvm). Commands:
`npx jest src/__tests__/engine/` and
`npx tsc --noEmit 2>&1 | grep -E "engine/cellLabels.ts|engine/stageGenerator.ts"`.
(Run result recorded in the session report.)
