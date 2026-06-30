# Dead Code & Duplication Audit — game-engine

_Read-only audit. Date: 2026-06-30. Scope: the tile/iso RPG game-engine —
`src/pages/personal-projects/game-engine/templates.tsx` (12,881 lines), `src/engine/`,
`src/game/`, `src/assets/`, `src/lib/`. Portfolio/CV/theme findings are noted only where obvious.
Nothing was deleted or modified; this is for the orchestrator to act on._

Tooling used: `knip`, `ts-prune`, `depcheck` (all run under the repo's Node 24 via nvm), cross-checked
with `grep`. The three tools disagree on edge cases (config-/CLI-/registry-referenced symbols), so every
finding below is curated — false positives are called out, and anything reachable via Next.js routing,
a string key, or a test is marked **RISKY**.

---

## Summary

| Category | Count | Approx. lines |
|---|---|---|
| Fully-dead engine files (zero importers anywhere) | 4 | ~1,270 |
| Dead OOP "canvas engine" cluster (kept alive ONLY by 1 stale prototype route) | 6 | ~925 |
| Tested-only engine modules (no production importer) | 2 | ~139 |
| Stale prototype Next routes (RISKY) + their private deps | 4 pages | ~330 + ~1,580 transitive |
| Backup files (portfolio-side, obvious) | 3 | ~3,261 |
| Genuinely-dead exports inside live files | ~6 | small |
| Duplicated-logic clusters | 3 major + several minor | ~190 dup lines + scattered |
| Unused npm deps (after false-positive filtering) | 3 (1 RISKY) | — |

The single biggest win is a whole **OOP/canvas rendering engine** (`GameEngine`/`Camera`/`Player` +
`MapComposer`/`asciiComponents`/`buildingComponents` + `tileVocabulary`) that is entirely disconnected
from the live ASCII/iso game in `templates.tsx`. ~2,200 lines are dead or kept alive only by four
orphan prototype pages that nothing links to.

---

## Dead code — SAFE (high confidence)

### A. Fully-dead engine files — zero importers anywhere (incl. tests)
Confirmed by `knip` (unused files) + `grep` for every import form. Safe to delete.

| File | Lines | Why it's dead |
|---|---|---|
| `src/engine/tileVocabulary.ts` | 180 | Not imported by any source or test. A standalone tile-vocabulary/legacy-mapping layer the live grid never uses. |
| `src/engine/MapComposer.ts` | 249 | Not imported anywhere. Imports `asciiComponents` (also dead). |
| `src/engine/buildingComponents.ts` | 315 | Not imported anywhere. "Super-Mario-style" component registry; only writes into `COMPONENTS` from the dead `asciiComponents`. |
| `src/engine/asciiComponents.ts` | 526 | Only imported by `buildingComponents.ts` and `MapComposer.ts` — both dead. So the whole trio is a closed dead loop. |

**~1,270 lines, fully safe.** Remove all four together (asciiComponents must go with its two consumers).

### B. Genuinely-dead exports inside otherwise-live files
These symbols are exported but referenced by nothing (not other modules, not tests, not in-module).
Confirmed against `ts-prune` "(used in module)" markers + grep.

- `src/engine/Tileset.ts:1016` `getTile()` — dead helper. (`getTilesByCategory`/`getAssetsByCategory` next to it ARE used.)
- `src/engine/Tileset.ts:1020` `getAsset()` — dead helper.
- `src/engine/Tileset.ts:947` `TERRAIN_PRESETS` (+ the `TerrainPreset` interface at :939, used only by it) — dead.
- `src/engine/entityArt.ts:172` `ENEMY_ART_ALT` — dead (no importer).
- `src/engine/entityArt.ts:221` `BOW_GLYPH`, `:222` `GUN_GLYPH` — dead consts (the live `weaponGlyph()` resolves glyphs itself; only `SWORD_GLYPH` is referenced).
- `src/engine/cellTileset.ts:85` `GROUND_DECOR` (+ `DecorTile` at :84) — dead.

**Note (NOT dead, but flagged by knip):** `GUARD/FROST/CLEAVE/ARCANE_BOLT/NOVA_BURST/CHAIN_LIGHTNING/
BULWARK/POISON_DART/ENFEEBLE/MEND/RENEW` in `src/game/abilities.ts` are listed by knip as "unused
exports", but they are all aggregated into `ABILITY_REGISTRY` (`abilities.ts:212`), so they're used.
The only cleanup there is **dropping the redundant `export` keyword** (they don't need to be public).
Same pattern for `cellAnimation.ts` `FLOWER_SWAY/LAMP_FLICKER/BUSH_RUSTLE` (registered internally),
`game/weapons.ts` `RANGED_MIN/MAX_REACH`, `game/patterns.ts` `DEFAULT_STEP_*`. Treat as cosmetic
over-export, not dead code.

### C. The dead barrel
- `src/engine/index.ts` (8 lines) — the `@/engine` barrel. Imported by exactly one file: the stale
  prototype page `src/pages/engine-test.tsx` (see RISKY section). Everything live imports engine
  modules by their concrete path (`@/engine/IsometricGrid`, `@/engine/Tileset`, …), never the barrel.

---

## Dead code — RISKY (verify before removing)

### D. The OOP "canvas engine" cluster — alive ONLY via one orphan prototype route
This is a complete, separate game engine (class-based, canvas-pixel, not the ASCII/iso grid the real
game uses). Its **only** entry point is `src/pages/engine-test.tsx`, which does
`import { GameEngine, convertLegacyAsset } from '@/engine'`. Nothing links to `/engine-test`
(grep for the route returns no `<Link>`/href). Remove the prototype page and this entire cluster
becomes safe to delete.

| File | Lines | Reachable only via |
|---|---|---|
| `src/engine/GameEngine.ts` | 374 | barrel ← `engine-test.tsx` |
| `src/engine/Camera.ts` | 82 | barrel + GameEngine |
| `src/engine/Player.ts` | 326 | barrel + GameEngine |
| `src/engine/types.ts` | 73 | only Camera/Player/GameEngine/barrel (engine-specific `Vector2/Rectangle/RGBA/LevelData/…`; **distinct from the live `@/game/types`**) |
| `src/engine/adapters/legacyAdapter.ts` | 62 | barrel (`convertLegacyAsset`) ← `engine-test.tsx` |
| `src/engine/index.ts` | 8 | the barrel itself |

**~925 lines.** RISKY only because `engine-test.tsx` is a Next.js page (a real route). It is a stale
prototype with no inbound links — confirm it's not deployed/bookmarked, then drop page + cluster together.

### E. Tested-only engine modules — no production importer
These have unit tests but are imported by **no** production code. They are parallel/abandoned
implementations of systems that the live game does differently.

- `src/engine/attacks.ts` (89) — `chooseAttack/fire/initAttacker/cellDistance/…`. The live attack
  path is `src/game/combat.ts` + `src/engine/attackAnimations.ts`; this older attack module is only
  referenced by `__tests__/engine/attacks.test.ts`. (RISKY: deleting it means deleting its test.)
- `src/engine/animationAuthoring.ts` (50) — `makeCycle/validateCycle/makeTrigger/describeCycle`. Only
  `__tests__/engine/animationAuthoring.test.ts` imports it. (Its dependency `animationCycles.ts` IS
  live — used by `assetAnimations.ts` and `IsometricGrid.ts`.)
- `src/engine/entityArt.ts:210` `ENEMY_ART_TYPES` — exported solely for `entityArt.test.ts`; not used
  by the renderer. (Keep if you want the coverage; otherwise it's test-only surface.)

### F. Stale prototype Next routes + their private dependency trees (RISKY — routing)
Four pages under `src/pages/` are early prototypes. They're real routes (so RISKY), but nothing in the
app links to them, and they keep otherwise-dead subsystems alive:

| Prototype page | Lines | Keeps alive (private to it) |
|---|---|---|
| `src/pages/engine-test.tsx` | 195 | the OOP cluster (D) + `src/canvasLogic/gameAssets/chineseTemple.ts` |
| `src/pages/top-view.tsx` | 46 | `src/engine/TileGrid.ts` (202) + `src/levels/village-grid.ts` (191) — both used by nothing else |
| `src/pages/test-ascii.tsx` | 51 | `src/canvasLogic/testLevel/loadCanvasLevel.ts` |
| `src/pages/interactive-ascii-version/index.tsx` | 37 | `src/canvasLogic/lobby/load.ts` |

The whole **`src/canvasLogic/`** directory (1,390 lines: `player.ts`, `eventListeners.ts`, `config.ts`,
`gameAssets/chineseTemple.ts`, `gameAssets/lobby.ts`, `lobby/load.ts`, `testLevel/loadCanvasLevel.ts`)
is reachable only through these three prototype pages. `TileGrid.ts` + `levels/village-grid.ts` are
reachable only through `top-view.tsx`. If the four prototype pages go, ~1,580 additional transitive
lines become safe to remove.

> The live game is `src/pages/personal-projects/game-engine/templates.tsx` (+ `index.tsx`); the live
> homepage is `src/app/page.tsx` → themed worlds. The four pages above are the legacy `pages/` router
> prototypes that predate the iso engine.

### G. Backup files (portfolio-side, but glaring)
- `src/components/themes/backups/CellShadedTheme.backup.tsx` (1,033)
- `src/components/themes/backups/NeonCyberTheme.backup.tsx` (965)
- `src/components/themes/backups/RubberHoseTheme.backup.tsx` (1,263)

**~3,261 lines.** `.backup.tsx` snapshots committed next to the live themes — version control already
covers this. Safe to delete (this is portfolio, not game-engine, but it's the largest single dead-weight).

### Not dead (false positives worth recording)
- `scripts/gen-lava-village.ts`, `scripts/preview-stage.ts` — knip flags as "unused files," but they're
  standalone CLI dev helpers (run via `ts-node`) that import `stageGenerator`/`zones`. **Keep.**
- `src/components/sections/*` (Hero/About/Experience/Projects/Skills) and `src/data/index.ts` — knip
  flags as unused; these are the older portfolio section components superseded by the theme system.
  Portfolio-side; verify before touching.
- `playwright/support/*.js` exports — test/showcase harness, not app code.

---

## Duplicated logic

### DUP-1 (HIGH) — iso vs 2D player render is copy-pasted (~75 lines)
The player figure + swing-arm + held-weapon + shield is implemented twice, near line-for-line. The 2D
copy's own comments say _"(mirrors drawIsoPlayer)"_ and _"(Mirrors drawIsoPlayer.)"_.

- **iso:** `drawIsoPlayer` — `templates.tsx:9880-9999`
- **2D:** the `obj.type === 'player'` branch inside `render` — `templates.tsx:9510`… body at `:11615-11717`

Duplicated almost verbatim across both:
- swing-arm hide logic — `9916-9921` vs `11630-11634` (`swingArmDir`, idle-pose `row.replace('>'/'<')`)
- the swing-arm block — `9935-9961` vs `11655-11681` (`armChar`, `armR`, `rot = -dir*1.3*(1-swingP)`, translate→rotate→`fillText` weapon, the `scale(-1,1)`/`rotate(PI)` "weapon points outward")
- the rest-hold weapon block — `9963-9979` vs `11682-11697`
- the shield disc — `9983-9998` vs `11701-11716` (identical filled-disc + boss-highlight + double-draw)

Only difference is the coordinate source (iso uses `x ± pHalf`, 2D uses `p.x ± fontSize*k`).
**Refactor:** extract `drawPlayerArms(ctx, { cx, armY, shoulderX, shoulderY, facingDir, fontSize,
weaponSize, armR, weaponGlyph, shieldGlyph, swingP, swingTint, bodyColor })` and call it from both
renderers (the figure body already shares `drawBlockFigure`/`drawFigureVitals`). **Risk: medium** —
pixel-positioning code; pair with a screenshot/grid check on both views.

### DUP-2 (HIGH) — three near-identical "marker codec" triples (~110 lines)
`templates.tsx:367-510` defines the same serialize/deserialize shape three times to smuggle records
through the template's `assetsData` array:

- entities — `ENTITY_ASSET_TYPE` + `entitiesToAssets`/`isEntityAsset`/`entityFromAsset`/`entitiesFromAssets` (`:367-410`)
- quests — `QUEST_ASSET_TYPE` + `questsToAssets`/`isQuestAsset`/`questFromAsset`/`questsFromAssets` (`:418-461`)
- buildings — `BUILDING_ASSET_TYPE` + `buildingsToAssets`/`isBuildingAsset`/`buildingFromAsset`/`buildingsFromAssets` (`:469-510`)

Each is: a marker-type const → `map` to `{ type, label: JSON.stringify(x) }` → `isXAsset` type guard →
`try { JSON.parse } validate, else null` → filter+decode loop.
**Refactor:** one generic factory, e.g.
`makeAssetCodec<T>(markerType, encode, validate) → { toAssets, fromAssets }`. Collapses three triples
into three one-liners. **Risk: low** — pure functions, `entitiesToAssets/entitiesFromAssets` already
exported for tests, so behavior is straightforward to lock down first.

### DUP-3 (MEDIUM) — duplicated math/RNG micro-helpers across engine/game
Same tiny helpers redefined per file (no shared module):
- `lerp = (a,b,t)=>a+(b-a)*t` — `engine/cellAnimation.ts:63` **and** `engine/attackAnimations.ts:85` (identical).
- `clamp = (v,lo,hi)=>Math.max(lo,Math.min(hi,v))` — `engine/villageLayout.ts:75` **and** `engine/stageGenerator.ts:95` (identical).
- `randInt` — `engine/villageLayout.ts:76` (rng-param) **and** `engine/stageGenerator.ts:94` (`Math.random`) — same intent, two signatures.
- Distance metrics, four variants: `cellDistance` (chebyshev) `engine/attacks.ts:47`, `chebyshev` `game/spawner.ts:63`, `manhattan` `engine/stageGenerator.ts:1190`, and inline chebyshev in `templates.tsx:1025` & `:1210`.

**Refactor:** a small `src/engine/math.ts` (or `src/lib/math.ts`) exporting `lerp/clamp/randInt/
chebyshev/manhattan`; import everywhere. **Risk: low.**

### DUP-4 (informational) — the iso / 2D / top render trio is parallel-by-design
There are three full render paths kept visually in sync on purpose (comments at `:10393-10396` spell
this out): labeled cells (`drawIsoLabeledCell:10024` / `draw2DLabeledCell:10397` / top via
`drawTopEntity`), entities (`drawIsoEntity:10251` / `drawTopEntity:10302`), buildings
(`drawIsoBuilding:10614` / `draw2DBuilding:10464` / `draw2DBuildingTile:10419`), and fountains
(`drawIsoTownFountain:10891` / `drawIsoWellFountain:11003`). The shared primitives are **already**
factored out well — `drawBlockFigure`, `drawGroundShadow`, `drawFigureVitals`, `drawRangeRing`,
`drawIsoPrism`, `treeCanopyLayers`, `fillQuad`. This is mostly healthy; the remaining duplication worth
removing is the per-view glyph-with-shadow draw (`fillStyle '#000' fillText(+1,+1)` then `fillStyle fg
fillText`) repeated in nearly every draw fn — extract a `drawGlyphShadowed(ctx, text, x, y, fg, bg?)`
helper. **Risk: low**, but lots of call sites; do it incrementally. No action required beyond that.

---

## Unused dependencies

`depcheck` and `knip` disagreed; reconciled against `package.json` scripts and `node_modules`:

**Likely-removable:**
- `ts-jest` (devDep) — **MEDIUM confidence.** Jest is configured via `next/jest` (SWC transform);
  `ts-jest` is referenced nowhere (`jest.config.ts`, `jest.setup.ts`, sources all clean). Both tools agree.
- `@types/jszip` (devDep) — **MEDIUM confidence, redundant.** `jszip` ships its own
  `node_modules/jszip/index.d.ts`, so the separate `@types/jszip` is unnecessary (and can clash).

**Remove only after verifying the build:**
- `@prisma/engines` (dep) — **RISKY.** Flagged unused by both tools and referenced only in
  `package.json`, but Prisma 7's `prisma generate` (run in `build`/`postinstall`) may rely on it being
  resolvable. Verify `npm run build` still works before dropping.

**False positives — KEEP:**
- `ts-node` — used via `npx ts-node` in the `prisma.seed` script and the `scripts/*.ts` dev helpers.
- `eslint`, `eslint-config-next` — used by `next lint` (the `lint` script).
- `postcss`, `jest-environment-jsdom`, `@types/jest` — referenced by config/string (`postcss.config.mjs`,
  `testEnvironment: 'jsdom'`, ambient Jest globals), not by import.
- `postcss-load-config` / `ffmpeg` (knip "unlisted") — transitive/CLI; not action items.

---

## Prioritized recommendations (top 5 highest-value cleanups)

1. **Delete the fully-dead engine quartet** — `tileVocabulary.ts`, `MapComposer.ts`,
   `buildingComponents.ts`, `asciiComponents.ts` (~1,270 lines). **Risk: none** — zero importers, remove
   the three asciiComponents-coupled files together.
2. **Retire the OOP canvas engine + its one prototype route** — drop `pages/engine-test.tsx`, then
   `GameEngine/Camera/Player/types/legacyAdapter/index.ts` (~925 + 195 lines). **Risk: medium** (Next
   route) — confirm `/engine-test` isn't deployed/linked first.
3. **Sweep the three other stale prototype routes + `canvasLogic/`** — `top-view.tsx`, `test-ascii.tsx`,
   `interactive-ascii-version/`, then `TileGrid.ts` + `levels/village-grid.ts` + the whole
   `src/canvasLogic/` tree (~1,900 lines). **Risk: medium** (routes) — same "confirm orphan" check.
4. **De-dup the player renderer (DUP-1) and the marker codecs (DUP-2)** in `templates.tsx` — extract
   `drawPlayerArms()` (~75 dup lines gone) and a `makeAssetCodec<T>()` factory (~110 → ~30). **Risk:
   low–medium**; verify both views render identically (grid/screenshot) after the player refactor.
5. **Trim dependencies + dead exports** — remove `ts-jest` and `@types/jszip`; verify-then-remove
   `@prisma/engines`; delete the genuinely-dead `Tileset.getTile/getAsset/TERRAIN_PRESETS`,
   `entityArt.ENEMY_ART_ALT/BOW_GLYPH/GUN_GLYPH`, `cellTileset.GROUND_DECOR`. **Risk: low** (deps:
   keep `@prisma/engines` if `npm run build` complains).

_Bonus (portfolio-side, biggest raw line count): delete `src/components/themes/backups/*.backup.tsx`
(~3,261 lines) — version control already holds these snapshots._
