# game-website — Nebulith editor & renderer

The **Next.js / TypeScript** frontend for the Nebulith game engine: a map **editor** and an
**isometric renderer** with three synchronized views (ISO, 2D, TOP). It also hosts the personal CV
site the demo lives on.

This repo is a **pure renderer + editor**. All tile data — tiles, compositions, animations, lighting,
colours — is owned by the [`nebulith`](../nebulith) Elixir backend and fetched over its JSON API.
The frontend holds **no tile art and no tile data of its own**; it builds maps *with* the backend's
tiles and persists the result back to the backend.

> **The model docs are the source of truth.** Read [`nebulith/docs/MAP-MODEL.md`](../nebulith/docs/MAP-MODEL.md)
> and this repo's mirror in [`docs/`](docs/) before touching the engine.

---

## The render model

Every tile is a **baked image resolved by its label**. `resolveDraw(kind, style)` picks the art for
the active tileset — `ascii` (glyph) or `emoji` (Noto image + tint) — two arts of the same label. So
**switching art style only reskins the map; it never restructures it.**

Tiles are **uniform**: no renderer branches on a tile's type, category, or art style. A tile differs
only by the **data** it carries — `height`, `color_role`, `blocking`, `shape`, `settings`, default
`animations`. Collision **derives from height** (a block above ground blocks; a ground/flat tile is
walkable), overridable per cell. A building, a tree, a fountain is just a **composition** — a stack
of labeled cells — stamped into the grid and drawn through the same one tile builder in every view.
There is no per-view special drawer (units aside).

The three views are **projections of one grid** that must match by construction:

| View | Shows | File / entry |
|------|-------|--------------|
| **ISO** | full 3D — Width × Height × Depth | `src/engine/render/iso.ts` → `render()` |
| **2D** | front elevation — Width × Height (depth collapsed) | `src/engine/render/topdown.ts` → `render2D()` |
| **TOP** | footprint — Width × Depth (no height) | `src/engine/render/birdseye.ts` → `renderTopView()` |

---

## Run it

Use **Node 22** (via nvm):

```bash
export PATH=/home/visiond/.nvm/versions/node/v22.21.1/bin:$PATH
npm install
npm run dev            # next dev --turbopack → http://localhost:3000
```

The editor lives at **`/personal-projects/game-engine/templates`**. It fetches tiles from the nebulith
backend at `NEXT_PUBLIC_NEBULITH_API` (default `http://localhost:4001/api`) — **start the backend
first** (see [`nebulith/README.md`](../nebulith/README.md)) or the tileset load falls back and the map
renders blank/placeholder.

### Checks

```bash
npx tsc --noEmit       # typecheck (strict, no `any`)
npm test               # jest (jsdom) unit + behaviour tests
```

- **Real-pixel tests** run canvas rendering headlessly via `@napi-rs/canvas` — assert actual painted
  pixels per art style, not jsdom "coloring in general".
- **Playwright** (`playwright/`, `playwright.config.js`) records/drives the demo against an
  **already-running** dev server on `:3000` (`BASE_URL`), used to validate the real game visually.
- The test baseline is known-broken in places — gate on the **specific file you touched**, not the
  whole suite (see [`docs/CODING-STANDARDS.md`](docs/CODING-STANDARDS.md) §6).

---

## Architecture

Everything hangs off **one data model, `IsometricGrid`** (`src/engine/IsometricGrid.ts`) — `ground`,
`height`, `collision`, and `assets[]` (placed tiles / building blocks / markers). Generators and the
editor **write** the grid; the three renderers **read** it as pure projections and add no state.

```
  nebulith backend ──GET /api/tilesets──►  tilesetLoader.ts ──► ASCII_TILESET / EMOJI_TILESET
                                                                        │ resolveDraw(kind, style)
  generators ─┐                                                        ▼
  editor ─────┴─stamp cells/blocks/tiles─► IsometricGrid ─► render() / render2D() / renderTopView()
                                                │
                                                └─serialize─► POST/PUT /api/templates (persist)
```

| Area | Path | What it holds |
|------|------|---------------|
| Grid model | `src/engine/IsometricGrid.ts` | the one grid (ground · height · collision · assets) |
| Renderers | `src/engine/render/` | `iso.ts`, `topdown.ts`, `birdseye.ts` (+ `shared.ts`, picking, tile handles) |
| Tilesets | `src/engine/tileset/` | `tilesetLoader.ts` (fetches `/api/tilesets`), `ascii`/`emoji` holders — filled from the backend |
| Animation | `src/engine/animation/`, `assetAnimations.ts`, `render/assetAnimation.ts` | pure, clock-derived playback of the `Animation` envelope |
| Generators | `src/engine/stageGenerator.ts`, `villageLayout.ts` | layer-pass stage/town generation |
| Compositions | `src/engine/compositionCatalog.ts`, `buildingCatalog.ts`, `src/game/runtime/composition.ts` | `stampComposition` / `stampBuildingComposition` |
| Editor tools | `src/game/editor/` | `tileBrush.ts`, `tilePlacement.ts`, `selection.ts`, `selectionEdit.ts`, `editorHistory.ts` (undo/redo) |
| Editor UI | `src/components/game/` | inspector, modals, panels, HUD, controls, chrome |
| Editor + runtime page | `src/pages/personal-projects/game-engine/templates.tsx` | the editor, the game loop, and view switching in one page |
| Backend API client | `src/lib/api.ts`, `src/lib/nebulithApi.ts`, `src/lib/editorSettings.ts` | templates/games/tilesets + editor chrome, all via `NEBULITH_API` |

Stack: Next.js 15 (Pages Router) · React 19 · TypeScript (strict) · Tailwind + ITCSS · next-intl.
Persistence (templates, games) is the **nebulith Elixir backend** (`/api/templates`, `/api/games`) —
not a local database.

## The editor

Selection-driven: click a tile or unit and its config opens in the right-side **inspector**
(`PropertiesPanel`). Capabilities:

- **Paint** — the palette (`tilesForStyle`) reads live from the DB tilesets (regular tiles only; units
  are placed via the top-nav **◈ Unit** flow). The brush (`stackAssetTile`) stamps a real block; height
  comes straight from the tile data (`height ?? 0`, no per-type branch), and collision derives from it,
  overridable per cell (Blocked/Walkable). Apply modes: click a cell, **shift-drag a rectangle then
  click to fill**, **Alt-click to remove the top tile**, multi-select to edit many at once.
- **Tile-composition tool** — stamps a whole backend composition (`stampComposition`). Palette grouped
  **Buildings / Nature / Props**, each showing its footprint **w×h**; the click cell is the footprint
  centre, and a building rotates to face the nearest road. A **placement ghost** previews the footprint
  live — **green = fits, red = blocked** (drawn in ISO + TOP, omitted in 2D).
- **Settings** — colour, width/height/zoom, x/y/z, rotate, flip, plus asset-only Z-Width, Z-Index,
  Display, Shape, and **Light** (a night ground-glow the renderer draws from the tile's `light` data).
- **Animate** — one shared modal (`TileAnimationEditor`) adds **settings** animations (tween render
  settings) or **sprite** animations (swap baked frames). Playback is pure and clock-derived.
- **Triggers** — a modal (`TriggerEditor`) attaches cell `enter`/`interact` or unit `defeat` triggers.
- **Randomizer** — *macro* `⚡ Generate ▾` re-rolls one scoped layer (Layout / Buildings / Nature /
  Decor / Units) via seeded layer passes; *micro* `🎲 Randomize selected` (hotkey **R**) re-rolls just
  the selected element's random attributes (a tile's colour/shape, a unit's variant).
- **Undo / redo** — `Ctrl+Z` / `Ctrl+Y`, a bounded editor history (`editorHistory.ts`).

The settings / animation / triggers modals are movable, resizable `FloatingPanel`s whose geometry is
**persisted in the backend** (`/api/editor_settings`), so the editor hardcodes no chrome layout.

---

## Documentation

`docs/` mirrors the engine model docs — the canonical copies live in
[`nebulith/docs/`](../nebulith/docs/) and win on any conflict.

| Doc | Read it for |
|-----|-------------|
| [`docs/MAP-MODEL.md`](docs/MAP-MODEL.md) | the cell/block/tile model and the three views |
| [`docs/ENGINE-ARCHITECTURE.md`](docs/ENGINE-ARCHITECTURE.md) | one grid → three renders, data flow, invariants |
| [`docs/FEATURES.md`](docs/FEATURES.md) | per-feature flows and where they live |
| [`docs/EDITOR-INTERACTION-SPEC.md`](docs/EDITOR-INTERACTION-SPEC.md) | the full editor interaction model |
| [`docs/ANIMATION-SYSTEM.md`](docs/ANIMATION-SYSTEM.md) · [`docs/LIGHTING.md`](docs/LIGHTING.md) · [`docs/GENERATION-SPEC.md`](docs/GENERATION-SPEC.md) | animations, lighting, the layer-pass generator |
| [`docs/TILESET-AUTHORING.md`](docs/TILESET-AUTHORING.md) · [`docs/TILE-BACKEND-MIGRATION.md`](docs/TILE-BACKEND-MIGRATION.md) | how tiles are authored + owned by the backend |
| [`docs/CODING-STANDARDS.md`](docs/CODING-STANDARDS.md) | **the senior bar for this repo** — TypeScript, React, ITCSS, canvas/game-loop rules |

## Contributing

- **Never hardcode tile art or tile data.** Tiles come from the backend; add or change them in
  `nebulith` (author in `TileSource`, reseed) — the frontend only renders and edits.
- **Keep tiles uniform.** No renderer branch on tile type/category/style; a tile differs only by data.
  Add a new shape/behaviour as one map entry, not an `if` (SOLID/OCP).
- **Validate in the running game.** For visual work, render the real page (`:3000`) and check it —
  don't self-certify a headless render.
- Follow [`docs/CODING-STANDARDS.md`](docs/CODING-STANDARDS.md): strict types, guard clauses, pure
  logic out of components, behaviour tests on real methods.
