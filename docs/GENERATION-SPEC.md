# Nebulith — Building Architecture & Stage Generation Spec

Status: **design in progress** (base rules locked 2026-06-21; formulas + themed generation being developed).
This is the spec we build the stage generator + building composer toward. See
[`ARCHITECTURE.md`](ARCHITECTURE.md) for current engine reality and
[`TILE-VOCABULARY-CONTRACT.md`](TILE-VOCABULARY-CONTRACT.md) for the tile naming the generator must emit.

> Note: "blocks" are collision-only (logical), not elevation — see memory
> `project-nebulith-collision-model`. A building's visual size comes from its **art/footprint**,
> not from raised terrain. All sizes below are in **grid cells**.

---

## 1. Building dimensions — LOCKED base rules

A building is a **multi-cell structure**, not a single tile. Two measures:
- **Length** = horizontal footprint along the facade (cells). The **facade length NAMES the composition**
  (`hospital_6`, `store_5`, `house_4`) — so the load-time stamp must use the plot's **facade** length, never
  the footprint's grid col-span. For an **east/west-facing** plot the grid col-span is the *depth*, not the
  facade length; deriving the composition kind from it asks for a non-existent composition (`hospital_4`) and
  stamps 0 cells, leaving a **foundation with no building** (the Image #42 orphan). Stamp a generated building
  by its recorded authoritative `PlacedBuilding.kind`, not by re-deriving from its col-span.
- **Height** = vertical extent of the drawn structure (cells): floors' body + roof.

**House — minimums (the base unit):**
- **Height ≥ 4 cells**: ≥ 3 cells of body (per the "≥3 tall" rule) **+ 1 cell roof**.
- **Length ≥ 8 cells.**
- **Door ≥ 2×2 cells** (2 wide × 2 tall) — a real walk-in opening, not a 1-cell mark.
- **Smallest possible house = 4 × 8** (height × length): 3 body + 1 roof, 8 long, 2×2 door.

**Floors:** each additional floor adds **+3 cells** of body height. Roof is always **+1**.
→ `height = floors × 3 + 1` (1-floor house = 4; 2-floor = 7; 3-floor = 10).

**Door:** width ≥ 2, height ≥ 2; placed on the facade, default centered (offset allowed). Bigger
structures use bigger entrances (gates) — see the formula.

---

## 2. Structure sizing formula (PROPOSED — to refine together)

Derive every structure type from the base house (8 long × 4 tall, 2×2 door) via per-type
multipliers. Starting point (tune by eye once the composer renders them):

| Structure | Length (cells) | Height (cells) | Door / gate | Notes |
|-----------|----------------|----------------|-------------|-------|
| **House (base)** | 8 | 4 (1 floor) | 2×2 | the unit |
| Big house | 12 | 7 (2 floors) | 2×2 | wider + taller |
| Store / shop | 10 | 4 | 3×2 (wide front) | wide display front |
| **Cathedral** (`card`? confirm) | 14 | 12 | 3×4 | tall nave + spire |
| Temple | 16 | 8 | 4×3 | columned, raised platform feel via art |
| Castle | 24 | 12 + towers | 4×4 gate | keep + perimeter towers (towers = +6 height) |
| Bridge | length = span | 2–3 | n/a | long + low; spans water/gaps |

General form: `length = base.length × kL(type)`, `height = floors(type) × 3 + roofUnits(type)`,
`door = clamp(scaleWithLength)`. Constraint: every habitable structure obeys the §1 minimums.

**Open question:** "card" in the user's list — assume **cathedral**? Confirm.

---

## 3. Themed stage generation (PROPOSED — limited input → good stage)

Goal: "frozen castle", "lava castle", etc. — a small, controlled input set produces a coherent,
good-looking stage (NOT random noise). This is the "control most of what the AI/generator
receives" principle from [`../README.md`](../README.md).

### 3.1 MVP preset matrix — zone × variant (START HERE)

> **Status (observed 2026-09 — the code is newer than this section).** The zone × variant matrix is a
> **backend catalog** now, not a frontend table: `GET /api/generators` serves the map-type CATEGORIES and
> the GENERATORS in them, each with the seasons it runs in and every knob a generate takes
> (`nebulith/lib/nebulith/catalog/generator_source.ex` → `generator_categories` / `generators`; client +
> selectors in `game-website/src/lib/generatorCatalog.ts`; T-113).
>
> The shipped catalog, read off the live API 2026-09-12: seasons `spring · summer · autumn · winter ·
> desert`, and FOUR categories, `forest · settlement · cave · temple`. Town and city merged into one
> `settlement` category (they are two presets of one kind of place, his *"City and town options are the same,
> it'd put them in a single category"*), and `forest` carries three layouts (`woodland`, `jungle`, `meadow`);
> `meadow_river` is gone, a river is an OPTION now. The catalog is a TREE: 24 generator rows, each a kind with
> its variations underneath (`generators.parent_id`, merged by `generator_tree/1`).
>
> Each generator's `config` carries its own grid range (`cols`/`rows` min-max, `cellSize`, `isoScale`),
> `units` (`townsfolk` / `enemies` / `enemyTypes`), and, for a settlement, `nature`, `settlement` tuning and
> the `buildings` material + colour palette.
>
> The zone PALETTES are MIGRATED (this sentence used to say they were not). They come from `GET /api/zones`
> plus the season-independent tables in `game_rules`; `src/engine/zones.ts` is now a set of READERS over that
> catalog, and the 302 lines of authored values are gone. A season the backend does not serve has no palette,
> and a caller with no palette plants nothing.
>
> The frontend holds **no** list of seasons, map types or layouts: the four tables that used to
> (`editorConfig.ts` `STAGE_ZONES` / `STAGE_VARIANTS` / `STAGE_VARIANT_LABELS` / `VARIANT_LAYOUTS`) were
> deleted with T-113. Adding a map type is a seed row. `lava` and `beach` still exist as `ZoneId` values
> but no generator runs in them, so they are off the menu; `frozen`/`verdant` are gone. The lava/frozen
> matrix below is the earlier design and does NOT describe the current build — reconcile it (and §7 of
> `EDITOR-INTERACTION-SPEC.md`) with the catalog before building to it.
>
> **Still frontend, deliberately:** the five generator LAYERS (`GENERATOR_LAYERS`, `editorConfig.ts`) are
> engine PASSES (`stageGenerator.ts` `LAYER_IDS`), not generator records, and `/api/generators` serves no
> layer list.
>
> **Not yet migrated, measured 2026-09-12 rather than assumed.** The settlement tuning constants in
> `engine/villageLayout.ts` are fine: every one resolves `served ?? CONSTANT`, so they are documented defaults
> and the served value always wins. Three siblings are NOT fine, because they shadow served data outright and
> the served value can never take effect:
>
> - `NATURE_MULT` (`stageGenerator.ts:913`) against the served `settlement.natureMultiplier`, which the backend
>   carries on EIGHT rows (town 1.3, city 0.5, town_small 1.8, town_forest 2.4, town_swamp 2.0, and more).
> - the `naturePass` literals `scatterGroundCover(ctx, 0.12)` / `scatterFlowers(ctx, 0.06)`
>   (`stageGenerator.ts:1005-1006`) against the served `nature` block that is already in scope. Its sibling
>   `tallGrass` IS read from the served block, which is what proves the wiring exists and these two bypass it.
> - the save path's `isoScale: 1.4` (`stageGenerator.ts:4907`) against a served `2.5`.
>
> The wider audit of frontend-held data lives in the workspace board, section B2.

Replace today's ~30 messy presets (many dead cultural themes) with a small, manageable matrix:
- **Zone** = elemental theme → palette + prop set. MVP: **lava** and **frozen** ONLY.
- **Variant** = place archetype → layout. MVP: **village, forest, cave, temple, boss-stage**.

MVP set (2 zones × 5 variants = 10 stages — enough to build a game):

| Zone | Variants |
|------|----------|
| **Lava** | lava village · lava forest (with a few caves) · lava cave · lava temple · lava boss-stage |
| **Frozen** | ice village · ice forest · ice cave · ice temple · ice boss-stage |

The **cave** is authored once per zone and **randomized per run** (reuse the archetype, vary the
layout) so it gives several playthroughs from one definition. Only after these two zones make a
playable game do we expand to more zones (jungle, underwater, beach, desert…) and variants. A stage
is therefore identified by `(zone, variant)` — e.g. `lava/temple`, `frozen/cave`.

**Inputs (the limited set):**
- `theme` — frozen / lava / desert / verdant / gothic / … → drives **palette** (ground, water,
  wall, accent colors + tile chars) and prop set.
- `archetype` — town / castle / temple-grounds / dungeon / boss-room / village → drives **layout**.
- `size` — small / medium / large → scales footprint + structure count.
- `view` — isometric / 2D-top / 2D-horizontal.

**LAYOUT-FIRST (the core principle).** Always define the STRUCTURE before the elements: partition
the map into sections/rooms, wire them into a connected network (spanning-tree corridors + edge
gates), and only THEN populate each section with elements. Never scatter elements and hope paths
emerge. (Forest = distributed clearing rooms → nearest-neighbour corridors → trees fill the rest;
modeled on HGSS / Infinite Fusion Viridian Forest = clearings + corridors + tree masses.)

**Pipeline (archetype-driven, not pure RNG):**
1. **Layout archetype** picks a coherent skeleton. e.g. *castle* = central keep + perimeter walls
   + gatehouse + courtyard; *town* = roads grid + plaza + houses along roads; *boss-room* = arena
   + entrance + boss anchor.
2. **Place structures** using the §2 sizing formula (real 8×4+ buildings with 2×2 doors), snapped
   to the layout (houses face roads, keep centers the castle, etc.).
3. **Apply theme palette** to ground/water/walls/props (frozen → ice/snow/blue; lava →
   ash/obsidian/ember). Tile labels per the vocabulary contract.
4. **Connect & populate** — roads/paths between structures, props, spawn point, and **connectors**
   (level/content/region) at doors and exits.
5. **Validate** — coherence checks (no buildings on water/roads, doors reachable, sizes legal).

"Good" = coherent archetype + legal sizing + themed palette + reachable doors — reproducible from
the 4 inputs. Expand archetypes/themes incrementally; make robust over time.

---

## 4. Build order (this subsystem)

1. **Building composer** — given (type, floors, length, theme) emit a legal multi-cell structure
   (walls + 2×2 door + windows + roof) as tiles/composite, obeying §1. Replaces the current
   single-`█` / tiny-composite buildings.
2. **Sizing formula** (§2) wired into the composer; tune visually.
3. **Archetype layouts** (§3 step 1–2) for a couple of archetypes (town, castle).
4. **Theme palettes** (§3 step 3) — start with 2 (e.g. frozen, lava).
5. **Connectors + validation** (§3 step 4–5).

Depends on a usable editor (the UI rebuild) to author/preview, and feeds the AI generator later
(the generator produces art for these same labeled structures).

---

## 5. THE LAYERS

A LAYER IS A SET OF THINGS IN A GIVEN CONTEXT. It is a subsystem, not a function, not a pass, not a call site:
*"a layer IS NOT a function or a method used in the engine, is the overal system that generates something"*.

The context here is A LEVEL BEING COMPLETE. That is wider than the map generator, and the two must not be
conflated: *"A LAYER DOESN'T NECESSARILLY RUNS IN THE GENERATOR, IS JUST A THING IN THE CONTEXT OF THE LEVEL
COMPLETION"*. Units are a layer of elements even though the generator does not scatter them.

### 5.1 The layers, in order

| # | layer | what it is | group |
|---|---|---|---|
| 1 | **grid + terrain** | the grid (size, cell, rows) and the terrain built on it, by zone / region / season, which determines what objects will be added and the type of floor | layout |
| 2 | **water** | blocks pathways | layout |
| 3 | **pathways** | adapts to the space water left on the grid; carries the exits | layout |
| 4 | **objects** | where the generator enters into play. Tile compositions: buildings, nature, decor. Houses, fountains, trees. Content AND ordering differ per zone: a jungle's objects are not a town's | objects |
| 5 | **units** | the creatures and townsfolk. Depends on everything above | |
| 6 | **fog** | to optimize, handle distance. NOT IMPLEMENTED | |
| 7 | **lightning** | affects all elements. NOT IMPLEMENTED | |
| 8 | **shadow** | depends on lightning and on positioned elements. NOT IMPLEMENTED | |
| 9 | **post processing / optimization** | NOT IMPLEMENTED | |

`layout` is the name for 1 to 3 together: *"layout refers to the underlying subsystem already mentioned (grid,
terrain, water, pathways), it groups them under it, we can name it differently, but basically those are the
'main' layers"*. `buildings` / `nature` / `decor` are the objects layer seen closer up.

**EVERY TEMPLATE RUNS THE SAME LAYERS.** A template does not own a pipeline. It varies by the DATA it feeds
them, and today only `objects` differs: *"basically the only layer that changes (sat the moment) is the objects
layer, in the future the light, fog and shadow will also change, because they depend on the base objects
layout"*.

### 5.2 What is NOT a layer

- **Region** and **elevation** are elements used INSIDE the terrain layer. *"region is not a layer, elevation
  is not a layer either"*.
- **Anything that is a step inside a layer.** Sealing the border, cutting the gates, keeping a way walkable and
  clearing what stands in it are all PATHWAYS. Flattening floors and blending transitions are TERRAIN. Stamping
  an entrance is OBJECTS. None of them is a layer, and each one that was given its own entry split logic that
  then only ever changed in one context: *"every time I've requested something, you've added a new thing that
  alñready existed and segmented logic into many code sections, then when one is changed, it only changes on a
  specific context instead of globally, hence why all your fixes suck and none was ever implemented as expected
  or only worked in a single map and not all"*.

### 5.3 Inputs are parameters ON a layer

Every input on the generator UI is a parameter of one layer: *"THE INPUTS ARE WHAT DEFINE THE PARAMETERS OF THE
FIRST LAYER, IN FACT EVERY INPUT FROM THE GENERATOR UI DOES EXACTLY THE SAME, IS A PARAMETER IN A GIVEN LAYER OF
THE SYSTEM"*. Size, cell and rows are parameters of layer 1. The river course is a parameter of layer 2. Exits
and pathway count are parameters of layer 3. The tree mix and the pathway surface are parameters of layer 4.

The UI's "layout" choice is ALSO a parameter, and it is a FILTER: *"LAYOUT IN THE UI JUST REFERS TO I WANT TO
ONLY EXECUTE THE SYSTEM UP TO THIS SPECIFIC LAYER. IE: ONLY GIVE ME AN EMPTY MAP WITH ALL PATHWAYS, GIVE AN
EMPTY MAP WITH A RIVER, GIVE THE FULL MAP, ETC"*. So the generator runs layers 1..N where N is what was asked
for.

### 5.4 Where the layers live

The layer LIST is backend data (`/api/generation_layers`): key, label, hint, position, seedable. The engine
binds a pass to each key and runs them in the served order, so adding fog is a row in the backend rather than a
release in this repo. A served layer the engine has no pass for does not run; a pass whose layer is not served
does not run either.

Seeding is per layer (`makeRng`, `GenerateOptions.seeds`), so re-rolling one layer changes only that layer:
every other layer, fed the same seed, reproduces identically.

### 5.5 What the code has instead, as of 2026-09-15

`STAGE_LAYERS` has ten entries and only two of them are layers. Recorded here because the gap is the work:

| in `STAGE_LAYERS` | what it actually is |
|---|---|
| `ways` | pathways, but running FIRST, before terrain and water |
| `terrain` | terrain + water + objects in one entry, dispatching to EIGHT private per-variant pipelines |
| `edge`, `gates`, `ways-clear`, `sightlines` | steps inside pathways |
| `pathway` | pathways AGAIN, a second entry under a second name |
| `entrances` | a step inside objects |
| `floors`, `transitions` | steps inside terrain |

Two consequences worth naming:

1. **The water dependency runs backwards.** Pathways are planned first and water is carved later, inside
   `terrain`, so a path cannot adapt to the space water left.
2. **The same job has one implementation per variant.** Measured: 22 functions assign a floor colour, 7 of them
   a base floor paint; 7 implementations of paving a way; 3 of repairing connectivity with 2 variants having
   none; regions and elevation built for 2 of the 8 pipelines. `paintJungleFloor` is the only function that
   applies a template's served `palette.floor`, so five woodland templates serve a floor colour nothing reads.

The backend list is wrong in the same way: it serves `ways` as a sibling BEFORE `layout`, when pathways belong
inside it, and it has no fog, lightning, shadow or post-processing rows.

### 5.6 Forest = the MEADOW layouts (rebuilt 2026-07-25 to match #24 / #14)

The forest variant builds one of three **meadow** layouts (references #14 = meadow, #24 = meadow + river, #26 =
meadow + two ways); the earlier `passages` / `open` / `lake` generators were **retired**. A `ForestLayout` is
`meadow | meadow_river | meadow_pass`, and a plain forest generate (no explicit layout) **randomly picks one**
(seeded via `ctx.rand`, so it reproduces).

Both build an OPEN muted-olive meadow that **DOMINATES** the map (an airy field, not a clearing hemmed by trees):

- **`meadow`** — the open field with faint rectangular **garden-plot** grid lines (a colour), subtle brown
  **dirt/earth** patches, a few grey field **rocks**, and tiny scattered **flowers** ("not everything is
  green"); a **SINGLE** cobblestone entrance on the near (**bottom-left**) edge, lined with **lamp posts** +
  colourful **flower beds**; and **SPARSE** tree **CLUMPS** framing the top / left / right edges plus a few at
  the bottom corners — **never a dense ring** (the dense tree-border was the wrong look).
- **`meadow_river`** — the same, PLUS a **colour-only WINDING river** hugging **three** sides (top / left /
  right), a meandering channel set in from the edge with sandy **BANKS**, leaving the near (bottom) edge **OPEN**
  for the entrance and a thin **LAND strip BEYOND** the river for the framing trees. It is **NOT** a 4-sided
  perimeter ring / moat. A walkable stone **BRIDGE** crosses it at the top-right.
- **`meadow_pass`** (#26) — the open field opened on **TWO opposite edges** (top + bottom, aligned on the same
  column) for a **through-route** you enter one side and exit the other, each way paved cobble + lined with lamp
  posts + flower beds. No river. Distinct from single-entrance `meadow` — a "variation = new type".

**Composition appearance (2026-07-25, toward #24 — validate on :3000):** tree/bush **canopies render as ROUNDED
crowns**, not leaf-faced cubes — the `leaf_center` cell defaults to the `shape:"circle"` FORM (MAP-MODEL §5, the
existing silhouette setting, NOT new shape logic). The entrance **lamp posts** carry a **small DARK lantern** bulb
by day (bulb `scale` 0.6→0.34 + an authored per-cell `settings.color`), still lighting warm gold at night via the
`night` colour animation. Both ride the general rule that a composition cell's **`settings.color` tints its baked
tile in the base render** (MAP-MODEL §8) — `stampComposition` now applies it, so any composition can ship a
recoloured cell.

The whole floor is a **COLOUR on a RAISED tile**: grass / earth / cobble are per-cell `floorColors` STATE the
generator writes on the flat-but-**height-1** `meadow` tile, and the river is the flat colour-only **height-1**
`water` tile (blue, blocking). Because the floor is a **height-1 BLOCK**, everything **stacks ON TOP of it**,
globally and data-driven from the tile's own height (`floorBlockLift`):

- **units** (the player, NPCs, enemies) render **lifted onto the block top** — they stand ON the meadow, not
  sunk through it (a flat town floor is height 0 → lift 0 → towns byte-identical). The lift is added to the
  unit's iso draw offset, the SAME `isoStackLift` trees/props ride.
- **ornaments** (flowers, rocks, decor) are placed at `heightLevel = floorBlockLift`, i.e. a **transparent
  billboard in a cell ON TOP of** the floor block — the floor colour shows beneath, no green cube around the
  bloom (a flower = `display:'single'` + `transparent`, MAP-MODEL §4). The generator emits **no 0-height tiles**.

TILES are spent only on **ornaments** (flowers, rocks) + the bridge — the "reduce tiles, grass + water are
colour" model. Colour is per-cell DATA the render READS (MAP-MODEL §4), never derived at render, and coarsened
to **ZONE/PATCH level** so `compressGround` merges the floor into runs (a **row-band** season gradient +
**patch checkerboard** plots + patch-quantised river ripple — the per-cell diagonal gradient + per-cell plot
grid-lines were the FPS killer). A single **reusable land-only guard** (`isWaterGround`/`isLandCell`) keeps
**every** prop, tree, lamp, ornament AND unit/spawn OFF water — nothing lands on a water cell except the bridge
deck. `repairFloorConnectivity` fills only TINY stranded pockets, so the land strip beyond the river stays a
deliberate separate area. Structure is locked by `stageGenerator.meadow.test.ts`; the visual match itself is
validated on the running game (:3000).
