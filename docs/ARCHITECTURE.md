# Nebulith — Architecture

> The as-built architecture of the Nebulith tile/iso RPG engine, written from the code.
> For *design rationale* of individual systems see the linked design docs; this is the
> ground truth of how the running engine is wired. Start here, then branch into the
> subsystem docs (see [docs/README.md](./README.md)).

Nebulith is an ASCII tile-based game engine that lets an author build a level once, in a
**top-down grid**, and then walk it in any of three views — top, flat **2D**, or
**isometric** — and play it as an action RPG (movement, abilities, enemies, quests, loot).

It is a Next.js feature, not a standalone runtime. Two pages:

| Page | File | Role |
|---|---|---|
| Gallery | `src/pages/personal-projects/game-engine/index.tsx` | Lists saved templates (Prisma/Postgres via `src/lib/api.ts`), create/open/delete. |
| Editor + player | `src/pages/personal-projects/game-engine/templates.tsx` | The whole engine: editor, three renderers, the game loop, combat, save/load. **~12.9k lines.** |

The pure, testable domain logic lives in `src/engine/*` and `src/game/*`; `templates.tsx`
is the orchestration shell (React state + refs + the canvas loop) that wires those modules
together.

> **Live vs legacy.** `src/engine/` also contains an *older* object-oriented engine —
> `GameEngine.ts`, `Camera.ts`, `Player.ts`, `TileGrid.ts`, `MapComposer.ts`. These are
> **not used by the live game**; they are only imported by `src/pages/top-view.tsx` and
> `src/levels/village-grid.ts` (an earlier prototype). The live engine is
> `templates.tsx` + `IsometricGrid` + the modules `templates.tsx` imports. Don't follow the
> OO classes when reasoning about the current game.

---

## 1. The core model: one map, three pure renders

The single most important idea:

> **There is ONE source of truth — a top-down grid.** The 2D and isometric views are
> *pure renders* of that grid. They add no gameplay state of their own; they are different
> projections of the same cells.

```
                         ┌─────────────────────────────┐
                         │      IsometricGrid           │   ← the ONE source of truth
                         │  ground[row][col]  (tiles)   │
                         │  height[row][col]  (elev.)   │
                         │  collision[row][col] (0/1)   │   ← the collision blueprint
                         │  assets[]          (glyphs)  │
                         │  buildings[]       (iso only)│
                         └──────────────┬──────────────┘
                                        │  (read-only each frame)
              ┌─────────────────────────┼─────────────────────────┐
              ▼                         ▼                          ▼
        renderTopView()            render2D()                   render()
        (top-down debug)        (flat side view)            (isometric view)
              └─────────────── one shared <canvas> ───────────────┘
```

Movement, collision, combat and triggers all operate on **grid cells**, never on screen
pixels. A grid "down" step is the same logical move in every view; the projection just
draws it differently (in iso it reads as *down-right* on screen). The aim/jump code is
explicit about this — see `aimDelta` / `aimFromKeys` in `templates.tsx`: *"The delta is in
GRID space, so all 8 directions resolve identically in 2D and iso."*

### Collision == building footprint (door stays walkable)

Collision is **not** derived from elevation and **not** a separate hand-painted layer of
its own at generation time. The rule is:

> **A blocking asset marks its own cell blocked — that is the only thing that sets
> collision.** A building's footprint is stamped cell-by-cell: every wall/roof cell is
> placed `blocking: true`; the single road-facing **door cell** is placed `blocking:
> false`, so it stays walkable — the building's one way in.

This is enforced in two mirrored places:

- **Generation** — `stampFootprintCell` (`src/engine/stageGenerator.ts`):
  ```ts
  const label: CellLabel = isDoor ? 'door' : 'roof'
  props.push({ ...cell, blocking: !isDoor, buildingType: type, edge: footprintEdgeClass(col, row, rect) })
  collision[row][col] = !isDoor
  ```
  `doorCell(facing, rect)` picks the centre of the footprint's road-facing edge.
- **Grid** — `IsometricGrid.placeAsset` / `placeTile` call `setCollision(col, row, true)`
  only when the asset is `blocking`, with the load-bearing comment: *"Blocks are collision,
  independent of elevation: a blocking asset marks its cell blocked regardless of visual
  height level."*

The same "footprint blocks, one cell is walkable" pattern is used for **trees** (the canopy
*top* `tree_leaf_top` / `tree_crown` apex vs the blocking trunk+leaves) and the **plaza
fountain** (the basin blocks; you walk the paved ring). Which label is walkable is decided
by a tiny membership set — `isWalkable(label)` in `src/engine/cellLabels.ts` — so collision
is a property of the *label*, not the renderer. See
[rendering-and-sprites.md](./rendering-and-sprites.md) for the label standard.

> **Heads-up:** `height[][]` exists and the 2D/iso renderers raise cells by it, but the
> generators set terrain height to `0` everywhere (`stageToTemplate`:
> `heightData = stage.collision.map(r => r.map(() => 0))`). Elevation is an authoring/render
> feature; **blocks are collision, not elevation.**

---

## 2. The grid — `IsometricGrid`

`src/engine/IsometricGrid.ts` is the data model. Five parallel `[row][col]` layers plus two
object lists:

| Layer | Type | Meaning |
|---|---|---|
| `ground` | `string[][]` | Tile type per cell (`'grass'`, `'path_stone'`, water, …). |
| `height` | `number[][]` | Elevation in blocks (0 = ground; negative = water/pit). Render-only today. |
| `collision` | `number[][]` | `0 = walkable, 1 = blocked`. The blueprint every view reads. |
| `assets` | `GridAsset[]` | Placed glyph records (trees, props, building tiles, markers). |
| `buildings` | `GridBuilding[]` | Grouped buildings — the iso/2D upright render only. |

Key methods: `setGround` / `fillGround`, `setHeight` / `getHeight`, `setCollision` /
`fillCollision`, `placeAsset` / `placeTile` / `placeComposite`, `getAssetsAtCell` /
`clearAssetsAtCell` (which also resets that cell's collision and height — the layers move in
lockstep). Collision queries:

- `isBlocked(col, row)` — out-of-bounds returns `true`; else `collision[row][col] === 1`.
- `isWorldBlocked(x, z)` — converts world pixels → grid cell, then `isBlocked`. The game
  loop's player movement and the patrol stepper both gate on these.

`GridAsset` carries far more than a glyph: `footprint` (multi-cell span, e.g. the fountain
basin), `cellAnim` / `cycles` (authored animations), `edge` / `cellPart` (debug labels),
`baseShadow`, `buildingType`, `color` / `bgColor`, `tileKey`. Preserving all of these
through save/load is what §5 is about.

---

## 3. The render pipeline

All three views draw into **one** full-window 2D canvas (`canvasRef`); the game loop calls
**exactly one renderer per frame** based on the active view. There is **no shared projection
helper** — each renderer defines its own local `toScreen`. (Note: a separate `render`
`useCallback` draws the *flow graph* node map with a starfield; that is the level-graph
editor, not one of the three game views.)

### The three renderers

| View | Function (`templates.tsx`) | Tile metric | What it draws |
|---|---|---|---|
| Isometric | `render(...)` (≈ L9510) | `tileW = cellSize·isoScale·0.71`, `tileH = ·0.36` | Diamond cube faces + top + glyph; depth-sorted assets/buildings/entities/player; water/effects live. |
| Flat 2D | `render2D(...)` (≈ L11449) | `tileW = tileH = 24·zoom` | Flat cell rects; raised cells get a darker **front face** of height `cellHeight·heightScale` → platform look. |
| Top-down | `renderTopView(...)` (≈ L12508) | `tileSize = 16·zoom` | One cell = asset glyph (else ground glyph), height badge, selection outline; entities as a single role-coloured `>` (`drawTopArrow`). |

The iso renderer's per-frame order: ground (cached, §3.3) → live water → connectors → one
**depth-sorted** pass over `allObjects` sorted back-to-front by `(a.col + a.row) − (b.col +
b.row)` (assets, buildings, entities, player, each via `drawIso*`) → attack animations →
projectiles → hit markers → night lighting → debug overlay → UI. It ends by writing a
rolling render-time EMA to `window.__isoRenderMs` for profiling.

### 3.1 Projection math (iso)

Inside `render` (≈ L9562):

```ts
const tileW = cellSize * isoScale * 0.71   // half-width of the diamond
const tileH = cellSize * isoScale * 0.36   // half-height of the diamond
const heightStep = cellSize * isoScale * 0.4
// toScreen(col, row): the (col-row, col+row) diamond projection
const wx = col * cellSize - camX
const wz = row * cellSize - camZ
x = w/2 + (wx - wz) * isoScale * 0.71
y = h/2 + (wx + wz) * isoScale * 0.36
```

`isoScale = grid.isoScale * zoom`. The same formula is inlined (no per-cell allocation) in
`drawIsoGroundLayer` and `drawIsoWaterCells`. 2D is the orthographic case (`x = w/2 + (col −
camCol)·tileW`); top view derives an `offsetX/offsetY` from a clamped focus cell. The
click→cell inverse (`screenToCell`, ≈ L5008) mirrors each view's projection + camera clamp
so clicks track the camera near map edges.

### 3.2 The camera (follow + edge clamp on both axes)

The camera follows the player (minus a mouse-drag pan offset `camOffset`) and clamps so the
viewport never reveals void past a map edge. The shared clamp:

```ts
function clampCameraAxis(focus, halfSpan, total) {
  if (total <= halfSpan * 2) return total / 2          // grid smaller than viewport → centre it
  return Math.min(Math.max(focus, halfSpan), total - halfSpan)
}
```

- **2D / Top** clamp `col` and `row` independently with the per-axis half-span
  (`w/tileW/2`, `h/tileH/2`).
- **Iso** is special: because screen space is the rotated `(col−row, col+row)` basis, a
  rectangular viewport projects to a diamond. It computes a **combined** half-span
  `isoHalfSpan = (pPad + qPad) / 2` and clamps *both* `col` and `row` focus with it, so the
  rectangular viewport always stays inside the projected diamond — panning/zooming at the
  edges never shows void (comment tag `#70`).

### 3.3 The iso static-ground offscreen cache (GPU perf)

The iso ground layer is thousands of fills + glyphs per frame. It is **baked once into an
offscreen canvas and blitted**; only dynamic layers redraw live. This is iso-only — 2D and
top redraw fully every frame.

```
camera moving / first frame / map edited / viewport > 8192px / __ISO_NOCACHE
        │
        ▼  drawIsoGroundLayer(ctx, params, bakeStatic=false)  ── direct full draw
        │
camera settled (same camKey two frames running) ──────────────┐
        │                                                      ▼
   content unchanged?  ── yes ──►  ctx.drawImage(cache.canvas, 0, 0)   (ONE blit)
        │                                                      ▲
        └── no (edit) ──► rebuild: drawIsoGroundLayer(cc.ctx, params, bakeStatic=true)
                                   into the offscreen canvas, then blit it.
   then always: drawIsoWaterCells(ctx, params, liveWater)  ── live water on top
```

Mechanics (in `render`, ≈ L9601):

- **`camKey`** = `` `${w}x${h}|${camX},${camZ}|${isoScale}|${cellSize}` `` — exact camera +
  zoom + size. Because the camera is exact, the cache blits at `(0,0)` pixel-identical, no
  resampling.
- The cache path only runs when the camera key matches the **previous frame**
  (`isoLastFrameKey`) — i.e. the camera is *not moving*. The content signature
  (`isoGroundSignature`, an FNV-1a hash over visible cells' ground type + height) is computed
  only then, never while panning.
- **Hit** (same camKey + same contentSig): one `drawImage`, reuse `cache.waterCells`.
- **Rebuild** (camera just settled or the map was edited): `ensureIsoCacheCanvas`,
  `clearRect`, bake with `bakeStatic = true` (skips animated water, draws grass at full
  alpha), store, blit.
- **Invalidation** therefore happens on: camera move / zoom / resize / cellSize change (key
  mismatch → direct draw until it repeats); any paint/height edit (contentSig mismatch →
  rebuild); viewport > `ISO_CACHE_MAX_DIM` (8192) on either axis (always direct); or the
  `window.__ISO_NOCACHE` escape hatch.
- Everything dynamic — water, entities, buildings, attack anims, projectiles, hit markers,
  night lighting — is always drawn **live on top of the blit**. Only the static
  ground/cube/glyph layer is cached.

### 3.4 The game loop

`gameLoop(time)` (≈ L7626) is a single `requestAnimationFrame` loop mounted once in a
`useEffect([])`; it reads the latest state through **refs** (`gridRef`, `playerRef`,
`keysRef`, …) so the once-mounted closure never goes stale. `time` is the rAF timestamp and
serves as the shared animation clock (`dt`, shimmer/flicker, motion interpolation `now`).

Per frame, in order: read refs → facing (`facingFromKeys`) + 8-way aim (`aimFromKeys`) →
jump trigger (`beginJump`) → compute per-frame entity occupancy (`entityOccupiedCells`) →
jump-arc lerp OR WASD movement (grid in 2D/top, diagonal in iso) → collision +
world-bounds clamp → walk-frame animation → connector enter/interact + quest events →
special-item slots → combat tick (`stepCombat`, `tickProjectiles`, `tickCannons`) →
throttled enemy patrol (`advanceEnemyMovement`) → **dispatch to one renderer** → prune
finished attack anims. Mouse-wheel zoom is handled separately (`handleWheel`); top + 2D
share `topViewZoom`, iso uses `isoZoomRef`, both clamped to `[0.5, 4.0]`.

See [combat-and-entities.md](./combat-and-entities.md) for the combat tick, aim, and jump in
detail.

---

## 4. Data flow

### 4.1 Stage generation → grid → render

The editor's "generate" path (`generateStageInEditor`, ≈ L6841):

```
generateStageInEditor(zone, variant)
  ├─ resizeGrid(cols, rows)                     // city ~1.7× linear; else modest default
  ├─ generateStage({ zone, variant, cols, rows })   → StageData (pure, no grid mutation)
  │     └─ ARCHETYPES[variant](ctx)  → roads, buildings, props, ground, collision, spawn
  ├─ applyStageToGrid(stage, grid)
  │     ├─ grid.buildings = stage.buildings.map(...)        // grouped, oriented for iso
  │     ├─ stagePaint(stage) → { ground, assets }
  │     │     ├─ for g of ground: grid.ground[r][c] = g.type
  │     │     └─ for a of assets: grid.placeAsset([a.char], a.col, a.row,
  │     │            { type, blocking, color, label, baseShadow, buildingType, edge, footprint, cellPart })
  │     └─ for each cell: grid.setCollision(c, r, stage.collision[r][c])   // authoritative collision
  ├─ movePlayerToValidSpawn(stage.spawn.col, stage.spawn.row)
  └─ syncPlayerEntity(...)                       // the player entity follows the spawn
```

`generateStage` (`src/engine/stageGenerator.ts`) is **pure** — it never touches the grid; it
returns a `StageData` (`ground`, `collision`, `buildings`, `props`, `spawn`). The editor is
what writes it into the `IsometricGrid`, mirroring the generator's authoritative collision so
trees/water/buildings truly block. Note `generateStage` does **not place enemies** — that is
a separate spawner step (§4.3). Variants are `town | city | forest | cave | temple |
boss-stage`; "zones" are actually **seasons** (`spring | summer | autumn | winter | desert |
beach | lava`). Full detail in [world-generation.md](./world-generation.md).

### 4.2 The editor

Tools are mutually-exclusive armed states; the canvas click router `handleCanvasMouseDown`
(≈ L5065) dispatches to whichever is armed, in priority order: waypoint → connector →
entity → building → multi-asset → entity-select → cell selection.

| Tool | State | Apply | Notes |
|---|---|---|---|
| Tile / asset paint | `selectedTile` / `selectedComposite` / `selectedMultiAsset` | `placeTile` / `placeCompositeAsset` / `placeMultiAsset` | Select a region first, then a swatch writes to every selected cell. **No dedicated eraser** — assets are removed before re-placing; paint grass to clear ground. |
| Entities | `entityTool: EntityKind \| 'erase' \| 'collision'` | `applyEntityTool` | `'collision'` toggles `setCollision` by hand; placing `'player'` defines the spawn. |
| Buildings | `buildingTool: 'select' \| 'place-house' \| 'place-store' \| 'place-hospital' \| 'delete'` | `applyBuildingTool` | A selected building is edited by keyboard: arrows move, **R** rotates, Delete removes — all via `tryReplaceBuilding` (validate footprint, unstamp→stamp, door stays walkable). |
| Connectors | `connectorMode` | `saveConnector` | A connector owns a **set** of cells linking to a target template. |
| Waypoints | `waypointMode` | `appendWaypoint` | With an entity selected, each click adds a patrol waypoint. |

`generateRandomMap` (≈ L6860) is a separate, older preset-based noise generator (distinct
from the `generateStage` archetype pipeline).

### 4.3 Play mode

`playMode` is **React state, and it is essentially a UI shell** — it does *not* start or
gate the simulation. The game loop runs movement and combat every frame regardless; it reads
`topViewMode` / `viewTypeRef` / `connectorModeRef`, never `playMode`. Entering play mode
(`enterPlayMode`) just switches to a playable view, hides the editor chrome, and shows the
play HUDs (`CombatHud`, `AbilityBar`, `QuestHud`). `playGameLevel` loads a template then
enters play mode.

There is **no "spawn entities on play" step**: enemies/NPCs exist from editing or from
`loadTemplate`. The separate editor button `randomizeEntities` (≈ L5595) scatters ~16
entities via `scatterEntities`. Enemy combat state is created **lazily inside the loop** —
`syncEnemyRuntime` gives each enemy a `startingCombatState` the first frame it is seen, and
prunes runtime for removed enemies.

---

## 5. Save / load — the persistence codec

Templates persist to a backend (Prisma/Postgres) through `src/lib/api.ts`:
`listTemplates` / `getTemplate` / `createTemplate` (POST) / `updateTemplate` (PUT) /
`deleteTemplate`, base `'/api/templates'`. **Templates are not in localStorage** (only view
prefs and the Games list are — see [games-flows.md](./games-flows.md)).

`serializeGrid(grid)` returns `{ groundData: grid.ground, heightData: grid.height,
assetsData: grid.assets }`. The interesting part is how the *other* state rides along.

### Marker records: entities / quests / buildings ride `assetsData`

The `TemplateData` schema in `api.ts` has no `buildings` field (and is treated as
read-only), so **entities, quests, and buildings are encoded as marker `GridAsset` records
appended to `assetsData`**, each tagged with a `type` string and carrying its real payload as
`JSON.stringify(...)` in the asset's `label`:

```ts
const ENTITY_ASSET_TYPE   = 'nebulith:entity'    // on-grid (uses entity col/row + glyph)
const QUEST_ASSET_TYPE    = 'nebulith:quest'     // off-grid: col=-1, row=-1
const BUILDING_ASSET_TYPE = 'nebulith:building'  // off-grid: col=-1, row=-1
```

- **Encode** — `entitiesToAssets` / `questsToAssets` / `buildingsToAssets`. Quests and
  buildings are placed off-grid (`col:-1,row:-1`) so the tile/asset renderers never draw
  them.
- **Decode** — each has a type guard (`isEntityAsset`…), a `try/catch` JSON decoder with
  structural validation (`parsed?.kind && typeof parsed.col === 'number'`, etc.), and a
  collector that silently drops malformed records.

On **save** (`saveCurrentTemplate`, ≈ L7945):

```ts
const assetsWithEntities = [
  ...assetsData,
  ...entitiesToAssets(entities),
  ...questsToAssets(quests),
  ...buildingsToAssets(grid.buildings),  // grouped buildings ride along so load rebuilds the render
]
```

On **load** (`loadTemplate`, ≈ L8018): `deserializeToGrid` populates `grid.assets`, then the
markers are split back out (`entitiesFromAssets` / `questsFromAssets` /
`buildingsFromAssets`) and the marker kinds are **filtered out** of `grid.assets` so they
don't double-render. `grid.buildings = loadedBuildings` restores the upright iso/2D model
(without it, every view falls back to the old per-cell building look).

### The clone that preserves every asset field

`deserializeToGrid` (`api.ts`) restores assets with a **shallow clone of every saved
field**, not a cherry-picked subset:

```ts
// Load assets — preserve EVERY saved field (clone). Cherry-picking columns used to DROP generator
// metadata that the renderers key on: footprint (fountain reverted to one cell — #72),
// cellAnim/cycles, edge/cellPart, baseShadow, buildingType ...
grid.assets = data.assetsData.map(a => ({ ...a }) as unknown as GridAsset)
```

Collision is then **rebuilt** from `asset.blocking` (a blocking asset always re-blocks its
cell), and ground/height are copied cell-by-cell. The `as unknown as GridAsset` is the
deliberate bridge between the narrow `api.ts` asset shape and the richer runtime `GridAsset`.

### Quirk worth knowing

Entities and quests are persisted on **both** channels: as `nebulith:entity` /
`nebulith:quest` markers in `assetsData` **and** in the dedicated top-level
`entities` / `quests` API fields. On load, the marker copies are read first
(`setEntities(loadedEntities)`), then **overridden** by the top-level fields
(`setEntities(template.entities ?? [])`). So for entities/quests the top-level fields win and
the markers are effectively redundant; **buildings have no top-level field and exist *only*
as markers.** Several in-code comments still say "api.ts has no quest field / is read-only
here" — that is now **stale** (the API does carry `entities` and `quests`). See
[the gotchas list](#design-quirks--gotchas).

---

## 6. Subsystem map — where to read more

| Subsystem | Doc | Key files |
|---|---|---|
| World / stage / village generation | [world-generation.md](./world-generation.md) | `engine/stageGenerator.ts`, `villageLayout.ts`, `buildingComposer.ts`, `buildingEditor.ts`, `zones.ts`, `connectors.ts` |
| Combat, abilities, enemies, gear, aim/jump | [combat-and-entities.md](./combat-and-entities.md) | `game/combat.ts`, `abilities.ts`, `loadout.ts`, `patterns.ts`, `archetypes.ts`, `entities.ts`, `spawner.ts`, `gear.ts`, `engine/attacks.ts`, `attackAnimations.ts`, `movement.ts` |
| Label standard, ASCII sprites, animation runtime | [rendering-and-sprites.md](./rendering-and-sprites.md) | `engine/cellLabels.ts`, `cellAnimation.ts`, `animationCycles.ts`, `entityArt.ts`, `assets/ascii/characters.ts` |
| Ability/enemy-attack **design** | [ability-system.md](./ability-system.md) | (design + v1) |
| Cell-animation **design** | [animation-system.md](./animation-system.md) | (design + v1) |
| Games / level flows | [games-flows.md](./games-flows.md) | `game/games.ts`, `gamesStore.ts` |
| Coding standards | [CODING-STANDARDS.md](./CODING-STANDARDS.md) | (enforced) |

---

## File map (live engine)

```
src/pages/personal-projects/game-engine/
  index.tsx            template gallery (list/open/delete)
  templates.tsx        THE engine — editor, 3 renderers, game loop, combat wiring, codec

src/lib/api.ts         template REST client + serializeGrid/deserializeToGrid

src/engine/            pure engine logic (the LIVE path)
  IsometricGrid.ts     the source-of-truth grid (5 layers)
  stageGenerator.ts    pure stage generation (archetype dispatch)   ← ~1.8k lines
  villageLayout.ts     settlement planner (roads/plots/plaza)
  buildingComposer.ts  compose a legal facade  | buildingEditor.ts  live-edit geometry
  cellLabels.ts        label vocabulary + per-label collision + autotiler
  cellAnimation.ts     frame-based transform animation (pure clock)
  animationCycles.ts   glyph-swap animation cycles (pure)
  attacks.ts           engine attack eligibility/timing/combo
  attackAnimations.ts  ASCII attack visuals (slash/shot/lightning/block)
  entityArt.ts         entity ASCII sprites + palettes + weapon glyphs
  movement.ts          patrol steppers + render-side motion interpolation
  connectors.ts        template-link trigger rule (pure)
  zones.ts             season palettes  | colors.ts  cellTileset.ts  multiCellAssets.ts ...

src/game/              pure game-domain logic (React-free)
  combat.ts            resolveAttack + damage pipeline
  abilities.ts         ability registry + cooldown/requirement helpers
  loadout.ts           gear loadout (equip/bag/special) + bonuses
  patterns.ts          enemy attack + movement pattern models/selectors
  archetypes.ts        enemy archetype dispatch table
  entities.ts          Entity model + factories + placement/queries
  spawner.ts           scatterEntities (zoned, spaced, deterministic)
  gear.ts              gear catalog (stat-only items)
  games.ts / gamesStore.ts   level-flow model + localStorage persistence
  types.ts             the cross-module domain contract

src/assets/ascii/      hand-authored ASCII art (characters/buildings/props/vegetation)

# legacy (NOT used by the live game; only src/pages/top-view.tsx + src/levels/):
src/engine/GameEngine.ts  Camera.ts  Player.ts  TileGrid.ts  MapComposer.ts
```

---

## Design quirks / gotchas

These are the places the code is likely to surprise a new engineer:

1. **Two persistence channels for entities/quests.** Marker records (`nebulith:entity` /
   `:quest`) *and* the top-level API `entities` / `quests` fields both get written; on load
   the top-level fields win, so the markers are redundant for those two. Buildings exist
   **only** as `nebulith:building` markers. Comments claiming "api.ts has no quest field" are
   stale.
2. **No shared projection helper.** Each renderer hand-rolls its own `toScreen`; the iso
   projection math is also re-inlined inside `drawIsoGroundLayer` / `drawIsoWaterCells` to
   avoid per-cell allocation. Change the constants in all the places.
3. **The offscreen cache is iso-only and "two identical frames = stopped".** It only kicks in
   when the camera key repeats; while panning the iso view does a full direct draw every
   frame. 2D and top never cache.
4. **`height[][]` is render-only.** Generators set terrain height to 0; blocks come from
   `collision`, not elevation.
5. **`playMode` is a UI shell, not a simulation switch.** The loop simulates regardless of
   `playMode`; it gates on view + connector/teleport refs instead.
6. **Generation places no enemies.** `generateStage` returns terrain/buildings/props/spawn
   only; enemies come from `scatterEntities` (the "randomize entities" button) or manual
   placement.
7. **"Zone" means season**, not a spatial region (`zones.ts` header: *"A 'zone' is now a
   SEASON"*). Spatial archetypes are the `VariantId` set.
8. **Module-level view-mode globals.** `topViewMode` / `flowViewMode` are module-level
   mutable booleans that shadow React state — a known anti-pattern flagged in
   [CODING-STANDARDS.md](./CODING-STANDARDS.md) (collapse to one `viewMode` state machine).
9. **`templates.tsx` is ~12.9k lines** = editor + runtime + renderers + codec in one
   component. The standards doc calls for decomposing it by concern as you touch it.
</content>
</invoke>
