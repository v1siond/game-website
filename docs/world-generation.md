# World / Stage Generation

> How Nebulith generates a level. All generation is **pure** — it produces data
> (`StageData`), never mutating the grid; the editor writes that data into the
> `IsometricGrid` (see [ARCHITECTURE.md §4.1](./ARCHITECTURE.md#41-stage-generation--grid--render)).
> Files: `src/engine/stageGenerator.ts` (~1.8k lines), `villageLayout.ts`,
> `buildingComposer.ts`, `buildingEditor.ts`, `zones.ts`, `connectors.ts`.

```
generateStage(opts)                                  StageData
  ├─ palette = ZONE_PALETTES[zone]   (season)        { zone, variant,
  ├─ blank layers: ground / collision                  ground[][], collision[][],
  ├─ ARCHETYPES[variant](ctx)   ◄── dispatch map       buildings[], props[],
  │     town/city → placeSettlement                    connectors: [],     ← always empty
  │     forest    → placeForest (passages/open/lake)   spawn }
  │     temple/cave/boss-stage → place*
  ├─ addTerrainTransitions(ctx)  (shorelines/banks)
  └─ spawn = chooseSpawn(...)    (PLAYER spawn only — no enemies)
```

---

## 1. `generateStage` — the pipeline

`generateStage(opts: GenerateOptions)` (≈ L396). `GenerateOptions = { zone, variant, cols?,
rows?, layout? }`; defaults: **40×40**, layout `'passages'`.

1. Resolve dims + `palette = ZONE_PALETTES[zone]`.
2. Build blank layers — `ground` filled with `palette.groundTypes[0]`, `collision` all
   `false`, empty `buildings` / `props`.
3. Pack into an `ArchetypeContext` (`{ zone, ground, collision, buildings, props, cols,
   rows, layout }`).
4. **Dispatch:** `ARCHETYPES[variant]?.(ctx)` — the variant function mutates `ctx` in place.
5. `addTerrainTransitions(ctx)` — blended shorelines / lava banks.
6. Return `StageData` with `connectors: []` (connectors are authored, never generated) and
   `spawn: chooseSpawn(...)`.

### The archetype dispatch map (Open/Closed)

```ts
const ARCHETYPES: Partial<Record<VariantId, (ctx: ArchetypeContext) => void>> = {
  town: placeTown,
  city: placeCity,
  forest: placeForest,
  temple: placeTemple,
  cave: placeCave,
  'boss-stage': placeBossStage,
}
```

`VariantId = 'town' | 'city' | 'forest' | 'cave' | 'temple' | 'boss-stage'`. Register a
variant by adding a function here — no dispatcher edits (the pattern the coding standards
cite).

### Output mappers

- `stagePaint(stage)` (≈ L1745) → `{ ground, assets }` for the renderer/grid. `assets`
  carry the full per-cell metadata (`label`, `edge`, `footprint`, `buildingType`, …).
  `paintBuildingGround` paints only a one-cell `path_stone` **driveway** from each door
  toward its road.
- `stageToTemplate(stage, name)` (≈ L1791) → a persisted payload. Note
  `heightData = stage.collision.map(r => r.map(() => 0))` — **terrain height is always 0;
  blocks are collision, not elevation.**

---

## 2. The stage archetypes

### Settlements — `placeTown` / `placeCity` → `placeSettlement`

Both delegate to `placeSettlement(ctx, settlement)` (≈ L432); only **scale + nature density**
differ (`NATURE_MULT = { town: 1.15, city: 0.4 }` — towns leafy, cities paved). Pipeline:

1. `planVillage(cols, rows, Math.random, settlement)` → a logical layout (§3).
2. Carve roads: `if (layout.roads[r][c]) ground[r][c] = 'path_stone'`.
3. For each plot: `composeBuilding(...)` → `footprintRect(plot)` → `placeBuilding(...)`.
4. `villageDecor` (plaza fountain + lamps), `fillVillageNature` (blue-noise trees, denser
   toward edges, excluding a `nearBuilding` set and requiring the tree's whole vertical
   column to clear roads/buildings), `scatterGroundCover`.

The editor inflates a city to a markedly larger grid (~1.7× town linear) on top of the
denser street grid and ~4× building cap, so a city *reads* bigger on screen.

### Forest — `placeForest`

Dispatches a sub-layout via `FOREST_LAYOUTS`: `passages → layoutPassages`, `open →
layoutOpenGlade`, `lake → layoutLake`. Uses a boolean `trees[][]` mask carved by
rooms/corridors, keeps the largest open clearing (`keepLargestClearing` via `floodOpen`),
carves gates to the edges, then `commitTrees` stamps **4-cell vertical tree columns**
(`TREE_COLUMN = ['tree_stem_bottom','tree_stem','tree_leaf','tree_crown']`, plus a dead
variant). The `lake` layout paints a circular water body, carves shore + gates, optionally
drops a cone feature, and `repairFloorConnectivity` floods the largest floor region to
guarantee walkability.

### Temple — `placeTemple`

One centred, south-facing `temple` building, then `templeHall` lays a checkered
`marble`/`gold_tile` aisle below the door with an `altar`, flanking `brazier`s, and a
`pillar` colonnade.

### Cave — `placeCave`

Cellular-automata cavern: `CAVE_FILL = 0.45` random rock → `CAVE_ITERATIONS = 5` smoothing
passes (the 4-5 rule in `nextRockState`: *a rock stays rock with ≥4 rock neighbours; floor
turns rock with ≥5*, Moore 8-neighbourhood, out-of-bounds counts as rock) →
`keepLargestClearing` → carve a south gate → `commitRocks` (blocking) → decor.

### Boss-stage — `placeBossStage`

A walled arena: `arenaRect` (margin 3) → `openArena` carves the room → `openEntranceCorridor`
(width 4, south) → `commitArenaWalls` → `paveArena` with `ancient_stone` → `placeBossAnchor`
(the `Ω` glyph) → `decorateArena` (corner braziers, dais pillars, rune ring).

### Shared placement mechanics

- **Terrain** is the `ground[][]` string grid, repainted per-archetype, seeded from
  `ZONE_PALETTES[zone].groundTypes`.
- **Props** go through `placeProp` — *place iff in-bounds and not already blocked; set
  collision when blocking.*
- **Player spawn** — `chooseSpawn` is a guard-clause fallback chain:
  `spawnInFrontOfVillage(...) ?? walkableNearCenter(...) ?? firstWalkable(...)`.

---

## 3. Settlement layout — `villageLayout.ts`

A pure planner: *"same (dims, rng() sequence) → same plan."* `Settlement = 'town' | 'city'`;
`Facing = 'south' | 'north' | 'east' | 'west'` (which way a door faces its road). Composed by
`planVillage`:

```ts
const { roads, frontages, entrances } = planRoads(cols, rows, rng, settlement)
const plaza = planPlaza(cols, rows, roads, settlement)
const plots = placePlots(roads, frontages, cols, rows, rng, settlement, plaza)
return { roads, plots, entrances, plaza }
```

### Scaling — town vs city

| Const | town | city |
|---|---|---|
| `HOUSE_RANGE` | 4–6 | 7–11 |
| `BIG_RANGE` | 1–3 | 3–5 |
| `GRID` (H×V streets) | 3×3 | 5×6 |
| `PLAZA_SIZE` | 5 | 7 |
| `MAX_PER_FRONTAGE` | 6 | 99 |
| `BUILDING_CAP` | 18 | 72 |

Plus `ROAD_W = 4`, `SETBACK = 1`. A city ends up ~4× a town on the same map.

- `planRoads` — evenly-spaced full-span streets (`streetLines`), each `ROAD_W` wide; records
  edge `entrances`; builds a `Frontage` on **both sides** of every street (a door-line one
  setback off the road, with `away: ±1` and a `facing`).
- `buildingMix(settlement, rng)` — `randInt(HOUSE_RANGE)` houses + `randInt(BIG_RANGE)`
  big-houses, shuffled, then prefixed `['store', 'hospital', ...rest]` — **every settlement
  is guaranteed exactly one store and one hospital.**

### Centre plaza + fountain

- `findPlazaSpot` — the **nearest-to-centre** road-free `size×size` block, found by spiraling
  outward along Chebyshev rings from the map centre.
- `planPlaza` — tries `PLAZA_SIZE[settlement]`, then a compact `5` fallback, scoring by
  centrality minus a size bonus; returns a `PlazaRect {c0,r0,size}` or `null`.
- `placePlots` pre-marks the reserved plaza as occupied so houses **ring** it. Store +
  hospital are placed first on the top south-facing frontage (civic frontage faces the
  viewer). Each lot reserves `expandRect(foot, 1)` (footprint + 1-cell buffer) and checks
  `rectClear`, so **no two buildings ever abut.**

The fountain itself is dropped by the generator's `placeCentrepiece` (≈ L557): it paves the
whole block `path_stone`, computes a centred odd basin (`size >= 7 ? 5 : 3`), blocks the
basin cells in the collision grid, and pushes **ONE** `makeTownFountain(centreCol, centreRow,
basin)` prop carrying the basin span in its `footprint` field — so the renderer draws one big
fountain over the whole basin (not N mini-wells), and you walk the paved ring around it.

---

## 4. Buildings

### Composing a facade — `buildingComposer.ts`

`composeBuilding(spec)` (≈ L93) → `ComposedBuilding { type, length, height, depth, door,
roofTop, cells[][] }`. Pure.

- `BuildingType = house | big-house | store | hospital | cathedral | temple | castle`;
  `BuildingCellKind = 'wall' | 'window' | 'door' | 'roof' | 'empty'`.
- `TYPE_SPECS` give per-type `{ baseLength, floors, doorWidth, depth }`. **`depth` is the
  ground footprint extent perpendicular to the facade, decoupled from facade `height`.**
- Roofs: `ROOF_ROWS = 2`; peaked triangle for `PEAKED_ROOF = {house, temple, cathedral}`,
  else flat. `roofTop` = the single apex cell `{x: floor(length/2), y: 0}` — **the lone
  walkable roof tile.**
- `facadeLabel` / `facadeLabels` map each cell to a `CellLabel`; the apex is `'roof_top'`
  (walkable via `isWalkable`), everything else blocks — exactly like a tree's single walkable
  `tree_leaf_top`.
- `rotateCells(cells, rotations)` rotates the facade 90° CW per turn so the door lands on the
  four road-facing sides (0→south, 1→west, 2→north, 3→east).

### Stamping into the grid — `placeBuilding` / `stampFootprintCell`

```ts
// placeBuilding(ctx, facade, plot, rect)
const door = doorCell(plot.facing, rect)        // centre of the road-facing edge
for (let row = rect.row; row < rect.row + rect.h; row++)
  for (let col = rect.col; col < rect.col + rect.w; col++)
    stampFootprintCell(ctx, plot.type, col, row, col === door.col && row === door.row, rect.col, rect)

// stampFootprintCell — the door-walkable rule:
const label: CellLabel = isDoor ? 'door' : 'roof'
props.push({ ...cell, blocking: !isDoor, buildingType: type, edge: footprintEdgeClass(col, row, rect) })
collision[row][col] = !isDoor
```

So **every footprint cell blocks except the single door cell** → collision == footprint minus
the door. `footprintEdgeClass` classifies each cell `nw/n/ne/w/interior/e/sw/s/se` for
tileset mapping; `footprintSide` / `footprintRing` give the fountain its rim → water → centre
reading. The facade's vertical elevation is **not** stamped on the ground — the iso/2D
renderers raise it from `facade` over this flat footprint.

### Live editing — `buildingEditor.ts`

The hand-edit twin (pure geometry over a `GridBuilding`), with the invariant *"collision ==
footprint after every edit."* Key functions: `buildingRect`, `doorCellFor` (mirrors
`stageGenerator.doorCell` exactly), `buildingFootprintCells` (cells + the lone walkable door),
`buildingCellBlocked` (a footprint may not cover another asset, blocking terrain, or a road —
`ROAD_GROUND = 'path_stone'`), `canPlaceBuilding`, `moveBuilding`, `rotateBuilding`,
`orientBuilding`, and `makeBuilding(type, facing, centerCol, centerRow)` (builds a fresh
`GridBuilding` via `composeBuilding`, so a hand-placed building matches a generated one).

---

## 5. Seasons (`zones.ts`) + connectors (`connectors.ts`)

### Seasons, not spatial zones

`zones.ts` header: *"A 'zone' is now a SEASON."* `ZoneId = 'spring' | 'summer' | 'autumn' |
'winter' | 'desert' | 'beach' | 'lava'`; `DEFAULT_ZONE = 'spring'`. `ZONE_PALETTES[zone]`
gives `{ id, groundTypes[], hazard, wallColor, accentColor }`. `groundTypes[0]` is the
default fill the generator seeds; `hazard` is the water-equivalent (winter = walkable
`ice_water`; lava = always-blocking `lava`).

### Connectors

Connectors link the current template to a target; stepping/interacting on a connector cell
teleports the player. Pure rule (`connectors.ts`):

```ts
const firesOnEnter = c.interaction === 'walk' || c.interaction === 'auto'
if (event === 'enter' && firesOnEnter) return c        // ConnectorEvent: 'enter' | 'interact'
if (event === 'interact' && c.interaction === 'interact') return c
```

`normalizeConnector` migrates a legacy single-cell `{col,row,...}` connector to the
multi-cell `{cells:[{col,row}],...}` shape so every read path (load/render/trigger) sees
`cells`. A connector may also carry a typed `action` (move/collect/reveal) that overrides the
default teleport (`src/engine/triggers.ts`). Connectors are authored in the editor — never
emitted by `generateStage`.
</content>
