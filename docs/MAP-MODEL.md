# Map Model, Views & the Cell/Block/Tile System (engine copy)

> **Canonical source of truth:** [`nebulith/docs/MAP-MODEL.md`](../../nebulith/docs/MAP-MODEL.md).
> This engine-facing copy carries the same model + **where each part lives in this repo's code**.
> Keep both in sync.
>
> Standing workflow for ALL work: **check docs → understand context / high-level → do the work.**
> New feature → check this + the feature doc, make sure it matches. Fixing a bug → confirm the fix matches.
> Touching tiles or cells/blocks → understand this first.

---

## The model (summary — full version + diagrams in the canonical copy)

There is **ONE map**: a grid of cells/blocks, each holding a **tile**. A house, a road, a mountain are all
just **tiles in cells/blocks, stacked like legos**. The three views are **projections of that one map** through
the **same tile builder**, so **they must match**.

| View | You see | Axes | Hidden |
|------|---------|------|--------|
| **TOP** | from directly above | **Width × Depth** (footprint) | height / elevation |
| **2D**  | from the front | **Width × Height** (front elevation) | depth (collapsed) |
| **ISO** | in 3D | **Width × Height × Depth** | nothing |

Matching rules: **Width** = 2D = TOP = ISO-front · **Height** = 2D = ISO · **Depth** = TOP = ISO. Same tiles
(roof red, walls gray, door/windows) in every view.

- **BLOCK** = a 3D unit `(col, row, level)` (ISO). **CELL** = a 2D square `(col, row)` (2D/TOP). **TILE** = the
  art inside, from the DB tileset (ascii + emoji are two tilesets of the same tile). A cell/block **has
  collision or not** (blocks movement or not), independent of its tile. A character/unit = a depth-0 tile.
- **No special renderer per view.** Each view projects the same stamped tiles. The roof is a **stack of roof
  tiles** (a gable) → triangle (2D), 3D gable (ISO), footprint (TOP).
- **Elevation** = stacked cells/blocks + collision (the `height` grid). Open work = expand generators + tiles
  to place PLACES with elevation; not new render logic.

## Where this maps in the code

| Concern | File(s) |
|---------|---------|
| The one grid: ground / **height (elevation)** / collision / assets; `setHeight`/`getHeight` | `src/engine/IsometricGrid.ts` |
| Tiles — ASCII tileset (ground colors) | `src/levels/village.ts` (`GROUND_COLORS`) |
| Tiles — EMOJI tileset | `src/engine/tileset/emojiTileset.ts` (`EMOJI_TILESET`) |
| Tiles — label → kind (the type→art mapping both tilesets share) | `src/game/artStyle.ts` (`groundKind`, `EMOJI_STYLE`/`ASCII_STYLE`) |
| Tileset data model + backend load | `src/engine/tileset/{tileset.ts,asciiTileset.ts,tilesetLoader.ts}`, `src/lib/nebulithApi.ts` |
| **TOP** render (projection) | `src/engine/render/birdseye.ts` (`renderTopView`) |
| **2D** render (front elevation projection) | `src/engine/render/topdown.ts` (`render2D`) |
| **ISO** render (3D projection) | `src/engine/render/iso.ts` (`render`, `drawIsoAssetAscii`, `drawIsoTileBlock`) |
| A building as stacked per-cell tiles (one system, all views) | `src/game/runtime/buildings.ts` (`stampBuildingCells`), `src/engine/buildingComposer.ts`, `src/engine/gableRoof.ts` (roof = gable tile stack) |
| Generators (stamp cells/blocks + tiles + collision) | `src/engine/stageGenerator.ts`, `src/engine/villageLayout.ts` |
| Iso block picking / selection (pick == render) | `src/engine/render/iso.ts` (`pickIsoBlocksAll`, `nextPickIndex`), editor in `src/pages/personal-projects/game-engine/templates.tsx` |

## Invariants a change must preserve
- A dimension can **never** differ between views (Width/Height/Depth match per the table above).
- Everything on the map renders through the **regular tile path** — no per-view special drawer (units/NPCs aside).
- Tiles come from the **DB tileset** (ascii + emoji), labeled correctly; the front end hardcodes no art.
- Use the exact terms **cell / block / tile**; never conflate them.
