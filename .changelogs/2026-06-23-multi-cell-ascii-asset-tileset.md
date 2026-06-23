# Multi-cell ASCII asset system (the "real tileset" model)

An asset is now a grid of characters that spans many cells when placed — a house is
~10×7 cells, a watchtower ~5×8, a wall a strip. This is the defined-character-set →
multi-cell-structure model the editor was missing.

## What changed

- **`src/engine/multiCellAssets.ts`** (new) — the model + library + helpers:
  - `MultiCellAsset { id, name, category, rows, color?, walkable? }`. `rows` is the
    ASCII art; each char maps to ONE cell.
  - Char rules: non-space = drawn + blocks collision; space = transparent (cell left
    untouched); a char in `walkable` (e.g. door `D`) draws but stays passable.
  - `assetFootprint(a)` → `{ w: longest row, h: row count }` (cells).
  - `stampAsset(grid, asset, anchorCol, anchorRow)` — writes each non-space char to
    `(anchor+offset)` via `grid.placeAsset([char], …, { blocking, color, label })`;
    skips spaces + out-of-bounds.
  - Library (id — W×H): house_small 6×5, house_large 10×7, hut 5×4, watchtower 5×8,
    wall_segment 6×2, gate 6×3, well 4×4, fountain 5×4, statue 3×5, big_tree 7×6,
    big_rock 6×3. Original compositions (no copied/attributed art).

- **`src/pages/personal-projects/game-engine/templates.tsx`** — placement wiring:
  - New "Structures" palette section in the Assets card listing every asset with its
    name + W×H footprint.
  - `selectedMultiAsset` state + `placeMultiAsset(id)`: click to arm; next Top-view
    click stamps the whole asset with its top-left at the clicked cell (or stamp at the
    first selected cell). Clears single-cell assets under the footprint first so a
    re-stamp is clean. Mutually exclusive with the tile/composite palettes.

- **`src/__tests__/engine/multiCellAssets.test.ts`** (new, 8 tests) — proves the
  spatial contract: chars map to the right `(anchor+offset)` cells, spaces stay clear,
  non-space blocks while `walkable` chars don't, out-of-bounds is skipped, footprint
  math, and a library asset (well) stamps its full footprint of cells.

## Integration note

`stampAsset` targets a structural `StampTarget` interface (cols/rows/placeAsset);
`IsometricGrid` already satisfies it, so no changes to `Tileset.ts` / `IsometricGrid`.
Stamped cells are ordinary single-char `GridAsset`s, so the existing iso/2D/top
renderers draw the multi-cell sprite with no renderer changes.
