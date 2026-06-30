# Labels, ASCII Sprites & the Animation Runtime

> The presentation layer that turns grid cells into drawn ASCII. Three pieces: the **label
> standard** (semantics shared by every view), the **ASCII sprite system** (hand-authored
> art + the procedural block figure), and the **animation runtime** (two independent
> engines). For the cell-animation *design/authoring* vision see
> [animation-system.md](./animation-system.md); this is the as-built runtime. The renderers
> themselves are covered in
> [ARCHITECTURE.md §3](./ARCHITECTURE.md#3-the-render-pipeline).

---

## 1. The label standard — `src/engine/cellLabels.ts` + `labelForCell`

Every cell an asset occupies carries a descriptive **label** naming its part
(`tree_stem_bottom`, `roof_top`, `door`, …). Two things hang off the label, and **only** the
label — never the renderer:

1. **Per-label collision** — `isWalkable(label)`. The walkable set is tiny and explicit:
   ```ts
   const WALKABLE_LABELS = new Set(['tree_leaf_top', 'roof_top'])  // everything else blocks (fail-safe)
   export function isWalkable(label: string): boolean { return WALKABLE_LABELS.has(label) }
   ```
   A tree's canopy *top* and a building's apex *roof_top* are walkable; walls, windows,
   **doors** (as a label), trunk, leaves, and anything unknown block. (Note: a real door cell
   is kept walkable at *stamp* time via `collision = !isDoor`, not via this set — see
   [world-generation.md §4](./world-generation.md#4-buildings).)
2. **Render glyph + color** — owned by the **tileset** (`cellTileset.ts`'s `cellTile`), not
   here. This module is pure semantics.

### The debug-caption standard — identical top/2D

`labelForCell(type, pos)` (`stageGenerator.ts`) is the **one** function every debug overlay
(top / 2D / iso) uses to caption a cell, so a cell's label can never drift between views:

```ts
export function labelForCell(type: string, pos = ''): string {
  const t = type.toUpperCase()
  return pos ? `${t} ${pos}` : t        // "BUILDING NW", "TREE CANOPY NE", or bare "LAMP"
}
```

`pos` is a pre-resolved position token: `footprintSide(col, row, rect)` for footprint
elements (the `nw/n/ne/w/interior/e/sw/s/se` class), `treeSubpart(label)` for trees
(`TRUNK` / `CANOPY TOP` / `CANOPY <SIDE>` / `CANOPY`), or `''` for single-cell assets. The
fountain reuses `footprintSide` + `footprintRing` to read rim → water → centre.

### Autotiling a mass (trees, future roofs)

A filled mass (forest canopy) is labeled by **autotiling**: each cell gets a 9-piece
edge/corner/interior label from its 4-orthogonal-neighbour openness. `autotileLabel(family,
filled, col, row)` is a **pure 16-entry table lookup** (`SLOT_BY_SIGNATURE`) — no branching;
corners win over single edges; a fully enclosed cell is interior; thin/lone masses collapse
onto the nearest outer corner so they still read as edge pieces. `MassFamily` makes this
reusable (Open/Closed): add a family (tree, roof, water…), not a new branch.
`isGroundContact(filled, col, row)` marks the bottom edge of a column (where a ground shadow
belongs).

---

## 2. ASCII sprites — `src/assets/ascii/characters.ts` + the block figure

### Hand-authored art

`src/assets/ascii/` holds multi-row string-array art, barrelled through `index.ts`
(`buildings`, `vegetation`, `props`, `characters`). The **player** has directional walk
frames — `idle`, `right1/right2`, `left1/left2`, `up1/up2`, `down1/down2`, and a `jump` pose:

```
idle:  ' 0 '      right1: ' 0 '     jump: '\0/'
       '<#>'              '/#>'            ' # '
       '/ \'              '- \'            '! !'
```

The `<` / `>` characters on the arm row are the figure's **facing brackets** — the same glyph
the swing arm reuses (§4). NPC variants (`npcSkinny/Normal/Heavy/Kid`) and monsters
(`slime`, `ghost`, `skeleton`) follow the same shape.

### Entity sprites + palettes — `src/engine/entityArt.ts`

Enemies render from `ENEMY_ART` (bespoke goblin/skeleton/ghost/spider/wolf/orc/slime/bat/
bandit; `ENEMY_FALLBACK` for unknown types); players/NPCs use `NPC_ART`. `entityPalette(entity)`
gives `{ fg, bg }` (bright glyph on a dark block — the trees' visual language): enemies by
type hue, players/NPCs by a tone chosen deterministically from their id (`hashString` →
`characterTone`). `entityArtFrame(entity, frame)` swaps between base art and `ENEMY_ART_ALT`
(same dimensions, so no jitter) for a 2-frame idle. `entityFootprint(entity)` derives the cell
footprint from the art (`w = max(1, round(cols/3))`, `h = max(2, ceil(rows/1.5))`) and is
shared by both the renderer and collision. `topRoleColor(entity, quests)` colors the top-view
`>` glyph (yellow player, red enemy, NPC blue/green/purple by quest state). Held-weapon
glyphs: `weaponGlyph(weapon)` (sword `Ɨ`, bow `}`, gun `¬`, staff `i`, axe `T`, shield `O`;
unarmed → `''`).

---

## 3. The animation runtime — two independent engines

They compose: one changes **where/how** a cell is drawn, the other changes **which glyph** is
drawn.

### 3a. Transform track — `src/engine/cellAnimation.ts`

The author defines an asset's motion directly as **frames**. Frame 0 is the rest pose; each
later frame is a small transform offset `AnimFrame { dx, dy, rot?, scale? }` (dx/dy are
fractions of a tile). A `CellAnimation { id, cells[], frames[], durationMs, delayMs, loop,
trigger, ease? }` is pure clock → transform:

```ts
transformAt(anim, now): AnimTransform   // frames 0→N-1 spread across durationMs (N-1 eased segments)
                                        // the delayMs tail HOLDS the last frame; looping wraps on duration+delay
```

`easeT('sine', t)` = ease-in-out (reads as natural sway); `linear` is the default param.
`assetCellTransform(anim, now)` returns the transform to apply when drawing, or **`null`**
when there's nothing to animate (no anim, a single rest frame, or a non-`'always'` trigger) —
keeping the cheap allocation-free path for the vast majority of un-animated cells. v1 renders
the `'always'` trigger only. Seeded one-click presets (starting templates the author can
tweak): `WIND_SWAY` (the doc's leaf-wind example: static → right → left → right),
`FLOWER_SWAY`, `LAMP_FLICKER` (a scale pulse), `BUSH_RUSTLE`.

### 3b. Glyph-swap cycles — `src/engine/animationCycles.ts`

A reusable cycle engine for entities **and** assets alike. A thing owns a set of `cycles`;
each `AnimationCycle { id, animations[], mode, delayMs, trigger }` plays its `Animation`s
(each a sequence of `AnimFrame = readonly string[]` glyph frames) in a `mode`:

- `stacked` — every animation plays at once (composited layers — this is how a walk cycle and
  an attack cycle overlap).
- `sequential` — one at a time, in order, looping, with `delayMs` between.
- `randomized` — same, but each slot picks a **deterministic** pseudo-random animation
  (`randIndex` via a hashed sine — no `Math.random`, so it stays testable).

`cycleActive(cycle, activeStates)` gates on the trigger (`always`, or while a `state` like
idle/walk/combat is active); `cycleFrames(...)` returns the frames a cycle contributes at
`now` (freezing on the last frame during a slot's delay portion to avoid flicker);
`activeFrames(...)` composites every active cycle into a flat draw list (cycle order = layer
order). All pure: `(cycles, now, activeStates) → frames`.

---

## 4. The player swing — the bracket arm

The player's melee swing in `drawIsoPlayer` (≈ L9916 in `templates.tsx`) deliberately reuses
the walk sprite's **facing bracket** as the swing arm — no separate limb is drawn:

- While swinging, the static facing-side bracket is hidden (`row.replace('>',' ')` / `'<'`)
  so two arms never appear; the base figure falls back to the idle pose for a predictable arm.
- The swing arm IS the bracket glyph (`>`/`<`), pivoting at the **shoulder** and rotating from
  raised-up (`swingP = 0`, windup) to forward/middle (`swingP = 1`, strike):
  `rot = -dir * 1.3 * (1 - swingP)`. It is short (≈ one char, like the walk arm).
- The held weapon glyph rides the hand just past the bracket, pointing outward in both
  facings, double-drawn (black shadow then `swingTint ?? '#e6e6e6'`) — and an ability's tint
  recolors it (e.g. Fire Slash → red/orange).

Other figure touches: a ground shadow sized to the figure (`drawGroundShadow`); a `breathe`
bob; and an **armor tint** — the body glyph turns steel-blue (`#bcd4ff` on `#243a5e`) the
moment armor is equipped, warm yellow otherwise.
</content>
