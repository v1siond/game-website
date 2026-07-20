# Nebulith — Editor Interaction & Behavior Spec

Status: **design captured 2026-06-21** (Alexander). How the editor lets a non-dev select things
and configure their behavior, plus the UI reorg and art-style requirements.

## 1. Selection-driven configuration (the core interaction)
Clicking a placed thing **selects** it and opens its config on the **right sidebar** — stats/options
appear *only when selected*, never cluttering the left sidebar.
- **Click an entity** → selected → right panel shows: its **stats** (for combatants), and options to
  add **attacks**, **quests** (NPC), **movement patterns**, **actions/animations**.
- **Click a structure/asset** → selected → right panel shows its options (actions, animations,
  movement if applicable).
- **Important:** character/enemy stats must NOT show on the sidebar by default — only on selection.

## 2. Entity model (expanded)
An entity has a **type/role**: `decoration` · `enemy` · `npc` · `player` · and hit-behavior flags
`hittable` / `non_hittable` (and more as needed). Per entity, configurable:
- **Stats** (combatants): HP + the combat stats.
- **Attacks**: which attacks it can use.
- **Quests** (NPC quest-givers).
- **Movement patterns** (see §3).
- **Actions / animations** (see §4).

## 3. Movement patterns
- An entity (esp. an enemy) can have **many movement patterns**.
- Patterns run **sequential** (one after another) or **randomized** (pick at random).
- A pattern is a path/behavior (patrol a route, chase, wander a region, idle). Authored on the
  entity's right-panel config; the play loop drives the entity along the active pattern.

## 4. Asset / structure actions & animations
Some assets/structures carry **timed actions** and **looping animations**:
- A **cannon** fires every X seconds (a timed action → spawns a projectile / triggers an attack).
- A **lamp** runs a looping light animation (a visual loop, no gameplay effect).
- Same select→configure pattern: select the asset → set its action interval / animation on the right.
- Model: an asset can hold `actions[]` (timed/triggered) and `animation` (loop spec). The renderer
  plays the animation; the loop fires the actions on their interval.

### 4.1 The ✦ Animate… modal — ONE shared editor for tiles AND units
Selecting a **tile OR a unit** and pressing **✦ Animate…** opens the SAME `TileAnimationEditor` modal. It
authors a LIST of animations of two kinds (see `ANIMATION-SYSTEM.md`):
- **settings** — tween render values (opacity / y-rise / colour / zoom / height…) from → to (the fountain
  water grow). Tiles only.
- **sprite** — a frame-swap cycle (walk / idle / attack): a frame strip whose thumbnails are the tiles' **baked
  images** (resolved label→image — never a raw glyph), an entity trigger (idle / move / attack / interact /
  key) + direction, timing + loop. This is the former standalone *character animation* editor, now folded in as
  the sprite kind, so **units inherit the animation authoring like every other tile feature**. A unit offers
  the sprite kind only (it stores `EntityAnimation[]`, bridged to/from the sprite envelope); a tile offers both.
- The live hero IS an entity — authoring a sprite animation on the player animates the running hero, no extra
  wiring (the renderer already plays `entity.animations` by trigger + direction).
- **🎲 Random move** — beside the two Add buttons, a "Random move" button drops in a RANDOMIZED movement
  animation you can then tweak, so you don't have to build every walk cycle by hand (Alexander: *"click animate
  and add a random animation (movement) or build one manually like we do now"*). It appends a sprite-kind cycle
  (`randomMovementAnimation`): a `move`-triggered, any-direction loop that swaps the unit's OWN tile (frame 0)
  with its mirror (a visible step) at a randomized cadence — editable like any other row.

## 5. UI reorg (reduce scrolling)
Current editor has TOO MUCH vertical scrolling. Target:
- **TOP NAV BAR:** **Export** + **Save / Load template** move here (out of the right sidebar).
- **LEFT sidebar:** Views + grid · Stage presets · **Assets — EXPANDABLE/collapsible** groups
  (Ground/Nature/Building/Decorations/Composite) so they don't all scroll at once.
- **RIGHT sidebar:** **Connectors** + **Entities** + the **selection config** panel (§1).
- Net: left = "what to place", right = "configure what's placed", top = file/export ops.

## 6. Composite/structure asset SCALING (bug → requirement)
**Bug:** selecting N cells then clicking e.g. "Well" stamps a **fixed 4-cell** `COMPOSITE_ASSETS`
shape (`placeCompositeAsset`), ignoring the selection — and it's not persisted to the template nor
visible in iso/2D. **Requirement:** a composite/structure must **scale to the selected cells** (40
selected → a 40-cell well), like a building stamped from its backend composition, be added as real grid assets
(labeled, per the keystone), persist in the template, and render in all three views.

## 7. Art styles
- **Default (regular) art style** in addition to lava + frozen → so we can generate a **regular
  forest**. The `verdant` zone already exists in the engine — expose it in the UI zone selector as
  the default ("Regular"/"Default"). Default zone = verdant.
- **Zone-styled trees** must match the selected style: lava → charred, frozen → frosted (done in the
  generator via TREE_PALETTES; verify they render per the selected zone).
- **Lava must look like lava:** the lava-zone floor (ash/rock/basalt) is now dark charred ground with
  ember glow (was neutral gray). Keep pushing the molten read.
- **Zone decorations:** **volcanoes** for lava, **mountains** for frozen — large multi-cell labeled
  decorations (render per-cell via the keystone path; emit from the generator + a label set).

## 8. ◈ Unit — the top-nav creature picker (place enemies/units)
Units are placed from the **top-nav ◈ Unit** dropdown, NOT the Paint palette (paint lists regular tiles only —
§11 of the nebulith spec). The dropdown is the *enemy/creature* picker the user asked for (Alexander: *"I don't
see the enemy tiles in the unit top nav option, how can I decide which enemies to add now? … move the enemy
painting to the unit top nav and edit the functionality either randomize the enemies (scatter them) or add/remove
them normally like we'd do when painting"*).

- **The picker (`UnitPicker`)** lists the `units`-category tiles (`tilesForStyle(styleId).units`, placeable
  figures only — FX/projectile units filtered via `placementFor`), so you SEE + pick WHICH creature to add. The
  data agent folds monsters, animals and people into `units`, so one picker serves them all: the picked tile's
  slug decides the entity KIND (`entityKindForUnitSlug`: person → npc, monster/animal → enemy, player → player).
- **Two placement modes.** **＋ Add** — pick a creature, click the map to place it one at a time (like painting;
  Erase removes). **⤳ Scatter** — randomize several of the picked creature across the free space (each with the
  picked art pinned + a real `spawner` patrol so they wander); no pick → the mixed enemies+NPCs scatter.
- **Static or animated.** In Add mode a **● Static / ✦ Animated** toggle decides the placed unit's motion. Static
  pins a stationary single-waypoint pattern (§8 nebulith spec — a hand-placed enemy stays put). Animated attaches
  a random wandering patrol PLUS a `randomMovementAnimation` (so it moves AND animates). Default is Static.
- **Player / NPC / Erase / Collision** stay as utility tools in the dropdown; the old free-text "Enemy type"
  field is gone (the visual picker replaces it).

## 9. Editor panel hygiene (each surface does one job)
Per Alexander, the panels were doing too much — trimmed so each surface is convenient and uncluttered:
- **Paint (left) sidebar = pick a tile + place it, nothing else.** The **Height**, **Opacity** and **Clear
  selected cells** controls are removed from Paint — those are Inspector (right-sidebar) concerns, edited
  per-tile there. Paint is just the DB tile palette now.
- **No STYLE card in the Inspector.** The right sidebar's nothing-selected state no longer shows a Style card
  (style is set from the top-nav 🎨 Style dropdown) — just a compact "nothing selected" hint.
- **No tutorial prose on the cards.** The long instructional paragraphs ("How to build a house", "Pick a
  building and click the map to STAMP…", "A building is just its cells…", "…tiles — pick one, then click the
  map…") are stripped. Cards keep their controls + at most a one-line functional status.

## 10. Placement REPLACES anything — red ONLY when it doesn't fit
Placing a composition (building / tree / fountain / lamp post) works on a **replace-anything** basis
(Alexander: *"the map should work on a 'replace anything if I want to' type of thing … it's only red when
there's not enough cells or blocks in the area I want to put the composition … if there's a building in a
place and I want to put another in the same place, I should be able to"*).
- **Validity = fit only.** The ghost is **red only when the footprint runs OFF the map** (out of bounds / not
  enough cells). Occupied cells and roads are **fine** — the ghost is green wherever the footprint fits. Pure
  rule: `compositionFits(grid, cells)` (buildingCatalog) checks in-bounds and nothing else; `planComposition`
  sets `plan.valid` from it (the render tints the ghost green/valid, red/invalid).
- **Stamp REPLACES.** On placement (`placeComposition`, templates), every footprint cell is **cleared first**
  (`grid.clearAssetsAtCell` drops the cell's assets + collision + height), then the new composition is stamped
  onto the clean cells — so dropping a building on top of another swaps it with **no stray stacked remnant**.
  Hand-placing a pre-built building routes through this SAME path (a building is just a composition).
- The old rule (occupied / road / water → invalid) applied only to the manual place tool; the **world
  generator still avoids overlaps** (`canPlaceBuildingComposition`) so auto-layouts don't stack buildings.

## 11. Undo / redo (Ctrl+Z / Ctrl+Y) — a bounded editor history
Map edits are undoable (Alexander: *"ctrl + y and ctrl + z functionalities … replace a building for another,
then ctrl+z to go back to previous building or ctrl+y to go forward … 4-5 steps forward and backwards"*).
- **Model:** a bounded **snapshot ring** of the MAP — grid layers (ground / height / collision / floor colour
  / floor dims) + placed assets + entities. UI-only state (selection, panels, camera) is **not** captured.
  `useEditorHistory` (with the pure `editorHistory` stack + `mapSnapshot` capture/restore) checkpoints the
  pre-edit map at the START of each map-mutating edit; **Ctrl+Z** restores it exactly, **Ctrl+Y** (or
  **Ctrl+Shift+Z**) re-applies. Bound = **5 steps** each way (`HISTORY_LIMIT`); a new edit truncates the redo
  branch; loading a template or generating a stage resets the history.
- **Captured edits:** place/replace composition, paint / stack / erase a tile, unit add / erase / scatter /
  clear-all, collision toggle, clear-region. Continuous slider tweaks (per-tile W/H/D sliders) are **not** in
  history — they'd flood the 5-step buffer; they'd need per-gesture batching to be added cleanly.
- **UX:** the keys fire only when the editor/canvas is focused — **ignored while typing in an input/textarea**
  (so Ctrl+Z in a text field still edits text, not the map).

## Build order (after the current quest/inventory wiring)
1. Composite asset scaling + persistence/render (§6) — concrete bug.
2. UI reorg (§5) — top nav + expandable assets + right-side connectors/entities/selection.
3. Selection-driven config panel (§1) — the interaction backbone.
4. Entity types + movement patterns (§2,§3).
5. Asset/structure actions + animations (§4) — cannon/lamp.
6. Default art-style in UI + volcanoes/mountains decorations (§7).
