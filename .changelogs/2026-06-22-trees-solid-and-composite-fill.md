# Fully-solid trees + composite asset fills the selection

Date: 2026-06-22

Engine suite 119/119 green, tsc clean on touched files.

## Trees are fully solid (collision fix, take 2)

The earlier rendering-alignment fix didn't resolve "leaves don't block" because
the real cause was the MODEL: a tree is a column of ground cells and
`tree_leaf_top` made the topmost cell walkable — a passable cell sitting in the
middle of a tree. "Walk under canopy" can't work in a column-of-ground-cells model.

Fix: standalone trees are now capped by a SOLID `tree_crown` (glyph `♣`, blocks)
instead of the walkable `tree_leaf_top`. Verified: a generated forest has **0
walkable tree cells** (every tree cell blocks). `tree_leaf_top` stays in the
vocabulary (still walkable) reserved for a future real overhead-canopy layer, but
the generator no longer emits it. Tests updated to assert full solidity; the
floor-connectivity tests simplify (no canopy-top exclusion needed).

## Multi-cell composite fills the selection (#10 bug)

`placeCompositeAsset` stamped a composite once at the first selected cell, so
"select 40 cells → click well" gave a hardcoded 2×2 well. Now: one cell selected →
stamp once (natural size); a REGION selected → TILE the composite pattern across
the selection (repeats by its own width/height, clipped to the selected cells),
written via `placeAsset` so it persists + renders in iso/2d.

NEW `src/engine/compositeFill.ts` (`fillSelectionWithComposite`) + tests — pure
placement logic extracted out of the 5k-line editor component so it's unit-tested.

## Files
`~ engine/cellLabels.ts` · `~ engine/cellTileset.ts` · `~ engine/stageGenerator.ts`
· `+ engine/compositeFill.ts` · `~ pages/.../templates.tsx` · `+ compositeFill.test.ts`
· `~ stageGenerator.test.ts` · `~ cellLabels.test.ts`

## NOTE
Visual/gameplay changes still need a browser pass (collision solidity, lava
colors, density, composite fill, glyph alignment). The editor auto-loads the last
saved template.
