# Folder-Structure Audit — game-website (portfolio + Nebulith game-engine)

**Type:** read-only audit. Nothing was moved, renamed, or committed.
**Date:** 2026-06-30
**Scope:** whole repo, with focus on the tile/iso RPG game-engine and the
`src/pages/personal-projects/game-engine/templates.tsx` monolith.

---

## TL;DR

- One repo hosts **two apps**: a Next.js **App-Router portfolio** (`src/app/*`,
  `src/components/themes/*`, `src/data/*`) and a **Pages-Router game-engine "Nebulith"**
  (`src/pages/personal-projects/game-engine/*` + `src/engine`, `src/game`, `src/levels`,
  `src/assets/ascii`). The router split (`app/` vs `pages/`) is the de-facto portfolio↔game
  boundary and is mostly clean — but logic layers (`engine`/`game`/`lib`/`components`) are shared
  and that's where entanglement and the big problems live.
- **`engine` / `game` / `lib` is a coherent, documented 3-layer split** (world+render-data /
  RPG mechanics / app-infra+persistence). It is largely respected by the extracted modules.
- **The single biggest structural problem:** `templates.tsx` = **12,881 lines** in one file —
  the editor UI + all three renderers + entity/player draw + the save/load codec + the combat
  game-loop + ~30 React components, all in a page. `docs/CODING-STANDARDS.md` already names it as
  *the* anti-example, citing it at **~5,300 lines** — it has since grown **~2.4×**.
- **Pure logic is trapped in the page:** 6 test files import gameplay logic directly from
  `templates.tsx` (a Next.js page). Tests importing from a page route is the clearest possible
  signal that the page is hoarding modules that belong in `src/engine` / `src/game` / `src/lib`.
- Secondary rot: a **legacy parallel engine** (`src/canvasLogic`) reachable only from 3 scratch
  dev pages; **`.backup.tsx` files** committed under `src/components/themes/backups`; a **split
  test root** (`/__tests__` at repo root *and* `src/__tests__`); overlapping type homes
  (`src/interfaces` vs `src/types` vs per-module `types.ts`).

---

## 1. Current structure (annotated map)

### Top level
```
src/
  app/            App-Router PORTFOLIO (CV, sprite tools)         — portfolio
  pages/          Pages-Router GAME-ENGINE + legacy scratch pages — game + dev
  engine/         World/tile/grid + render-DATA + procedural gen  — game-engine core
  game/           RPG domain mechanics (combat, quests, items…)   — game-engine core
  levels/         Concrete authored levels (village)              — game content
  assets/         ASCII art + sprites + fonts                     — shared/game
  canvasLogic/    LEGACY parallel engine iteration                — dead-ish
  lib/            App infra + persistence + portfolio data        — mixed
  components/     React UI: portfolio themes + cv + worlds + game widgets
  contexts/, themes/  Portfolio theme/profession context+config   — portfolio
  data/           Portfolio CV/content data                       — portfolio
  hooks/          Scroll/animation hooks                          — portfolio
  i18n/           next-intl config                                — portfolio
  interfaces/     Legacy OO interfaces (CanvasObject, GameAsset)  — dead-ish
  types/          Single ambient decl (html2pdf.d.ts)             — infra
  styles/         globals.css + theme css                         — portfolio
  __tests__/      66 test files mirroring src                     — tests
__tests__/        3 test files (sprite-generator/pixellab)        — tests (2nd root!)
docs/             4 guides + superpowers/specs                    — docs
.changelogs/      project changelog entries                       — meta
prisma/, scripts/, playwright/, public/, messages/                — infra/assets
```

### `src/engine/` — world + tile + render-DATA + procedural generation (36 files, ~10k LOC)
Intended layer: *how the world is represented and what to draw, as data* — not React, not RPG rules.
Coherent and well-factored into small modules.
- **Grid/tiles:** `IsometricGrid.ts` (359), `TileGrid.ts` (202), `Tileset.ts` (1022),
  `cellTileset.ts`, `tileVocabulary.ts`, `cellLabels.ts`, `cellTileset.ts`, `MapComposer.ts`.
- **Procedural generation:** `stageGenerator.ts` (1823 — the second-largest file in the repo),
  `villageLayout.ts` (394), `zones.ts`, `connectors.ts`, `triggers.ts`.
- **Buildings:** `buildingComposer.ts`, `buildingEditor.ts`, `buildingComponents.ts`,
  `isoBuilding.ts`, `compositeFill.ts`, `multiCellAssets.ts`.
- **Animation/behavior data:** `animationAuthoring.ts`, `animationCycles.ts`, `assetAnimations.ts`,
  `attackAnimations.ts`, `cellAnimation.ts`, `entityAnim.ts`, `entityArt.ts`,
  `entityQuestMarker.ts`, `behaviors.ts`, `movement.ts`, `attacks.ts`.
- **Legacy OO core (older iteration):** `GameEngine.ts` (374), `Camera.ts`, `Player.ts`,
  `adapters/legacyAdapter.ts` — **only `engine-test.tsx` uses these via `engine/index.ts`.**
- `colors.ts`, `asciiComponents.ts`, `types.ts`, `index.ts` (barrel — exports only the legacy
  core + a few tile helpers; most modules are imported deep, not via the barrel).

### `src/game/` — RPG domain mechanics (15 files, ~3.5k LOC)
Intended layer: *the rules of the RPG*. `game/types.ts` is the documented cross-module contract.
- `combat.ts`, `abilities.ts`, `weapons.ts`, `projectiles.ts`, `gear.ts`,
  `inventory.ts`, `loadout.ts`, `entities.ts`, `archetypes.ts`, `spawner.ts`,
  `patterns.ts` (movement+attack patterns), `quests.ts`, `games.ts` + `gamesStore.ts`
  (multi-level game container + localStorage), `types.ts`.

### `src/lib/` — app infra + persistence + portfolio data (6 files)
**Mixed bag** — the only place where two concerns share a dir:
- *Game/infra:* `api.ts` (241 — template REST client + `serializeGrid`/`deserializeToGrid`
  persistence codec), `prisma.ts`, `pixellab.ts` (425 — sprite-gen API), `animation-keyframes.ts`.
- *Portfolio:* `cv-data.ts`, `cv-data-static.ts` (687) — CV content, unrelated to game/infra.

### `src/pages/` — game-engine page + scratch dev pages
- `personal-projects/game-engine/index.tsx` (224) — template gallery / "new game" launcher.
- `personal-projects/game-engine/templates.tsx` (**12,881**) — the entire editor + runtime + 3
  renderers. **The subject of this audit.**
- `engine-test.tsx`, `top-view.tsx`, `test-ascii.tsx`, `interactive-ascii-version/index.tsx`
  — **dev/scratch harnesses** wired to the legacy `canvasLogic`/`GameEngine` engine; not part of
  portfolio nav or the real game route.
- `api/templates/[id].ts`, `api/templates/index.ts` — Pages-Router API for template CRUD.
- `_app.js`, `_document.js`.

### `src/components/` — React UI
- **Portfolio (the bulk, ~50k LOC):** `themes/*` (15 giant theme components, 1.2k–4.9k lines each;
  `MedievalFantasyTheme.tsx` is **4,942** lines), `themes/shared/*`, `themes/DarkFantasy/*`,
  `themes/Mythic/*`, `cv/*`, `sections/*`, `worlds/*`, `sprites/*`, `ThemeSwitcher`, `Toast`,
  `FPSTracker`, `layouts/`, `providers/`.
- **`themes/backups/`** — `CellShadedTheme.backup.tsx` (1033), `RubberHoseTheme.backup.tsx` (1263),
  `NeonCyberTheme.backup.tsx` — committed backup copies (dead).
- **No `components/game/` exists** — every game widget lives inside `templates.tsx` instead.

### Tests & docs
- `src/__tests__/` (66 files) mirrors src cleanly: `engine/` (27), `game/` (22), `lib/`,
  `components/`, `contexts/`, `themes/`, `app/`, `data/`, `hooks/`, `accessibility/`,
  `integration/`, `snapshots/`.
- **Second test root `/__tests__/` (3 files)** at repo level: `AnimatedSprite`, `pixellab`,
  `sprite-utils` (App-Router sprite-generator). Inconsistent with `src/__tests__`.
- `docs/`: `CODING-STANDARDS.md`, `ability-system.md`, `animation-system.md`, `games-flows.md`,
  `superpowers/specs/*`. Flat but reasonable; no `docs/audits/` until this file.

---

## 2. Issues (ranked: placement / boundaries / naming)

### P0 — `templates.tsx` is a 12,881-line page holding ~5 distinct layers
A Next.js page should be a thin route shell. This one contains: the **save/load codec**, the
**combat game-loop + enemy AI**, **all three renderers + entity/player draw**, **~30 React
components**, **690 lines of preset DATA**, and a **4,644-line god component**. It violates the
repo's own `CODING-STANDARDS.md` §3 ("Pure logic out of components", "Rendering/canvas separate
from React state", "Split large files") — which already cites this file by name, at less than half
its current size. Full breakdown and split plan in §3.

### P1 — Pure logic is imported FROM a page by tests (proves misplacement)
6 test files import gameplay logic straight out of the page module:
- `__tests__/game/targeting.test.ts` → `findTarget`, `makeEnemyRuntime`
- `__tests__/game/jump.test.ts` → `aimDelta`, `jumpLandingCell`, `PlayerState`
- `__tests__/game/eightWayAim.test.ts` → aim helpers
- `__tests__/game/enemyAttackPattern.test.ts` → attack-pattern helpers
- `__tests__/game/playerName.test.ts` → `playerDisplayName`, `DEFAULT_PLAYER_NAME`
- `__tests__/game/questOfferModal.test.tsx` → `QuestGiveBody`, `QuestLogPanel`, `questAnchorScreenPos`

These functions are pure (or pure-ish UI) and belong in `src/game/*` / `src/components/game/*`.
The tests are effectively *already named* after the target modules (`game/targeting`, `game/jump`)
— they just point at the wrong source file.

### P2 — Legacy parallel engine (`src/canvasLogic`) + its scratch pages
`canvasLogic/` (config, eventListeners, player, gameAssets/{chineseTemple,lobby},
lobby/load, testLevel/loadCanvasLevel) is an **older engine iteration** that duplicates concepts now
owned by `src/engine`. It is reachable **only** from `pages/engine-test.tsx`,
`pages/test-ascii.tsx`, `pages/interactive-ascii-version/index.tsx` — none of which are linked from
the real game or portfolio. The legacy `engine/{GameEngine,Camera,Player,adapters}` + `engine/index.ts`
barrel exist mainly to serve `engine-test.tsx`. This is two engines in one tree; new readers can't
tell which is canonical.

### P3 — `lib/` mixes portfolio CV data with game/infra
`cv-data.ts` / `cv-data-static.ts` (portfolio content) sit beside `api.ts` / `prisma.ts` /
`pixellab.ts` (infra). CV data is the same *kind* of thing as `src/data/*` (portfolio content) and
would be better there; `lib/` should be infra/persistence only.

### P4 — Overlapping type homes / naming inconsistency
Domain types live in **three** competing places: `src/interfaces/` (`CanvasObject`, `GameAsset`,
`LevelProps` — used only by the legacy adapter + `canvasLogic`), `src/types/` (one ambient
`html2pdf.d.ts`), and per-module `types.ts` (`engine/types.ts`, `game/types.ts` — the real
contracts). `interfaces/` overlaps `GameAsset` concepts already modeled in the live engine and adds
confusion. Pick one convention (per-module `types.ts` is the live one).

### P5 — Committed backups & dead files in source
`src/components/themes/backups/*.backup.tsx` (~3,300 lines) are version-control-as-filenames. Dead
code in the tree (`CODING-STANDARDS.md` §"YAGNI + no dead code").

### P6 — Split test root
`/__tests__` (repo root, 3 files) vs `src/__tests__` (66 files). One repo, one test root — pick one
(`src/__tests__`, which is the established pattern).

### P7 — Misleading names
`templates.tsx` and the route `/game-engine/templates` actually mean "the editor + the whole game
runtime", not "templates". The product is branded **Nebulith** in code (`nebulith:entity` asset
types) but nothing in the folder tree reflects that. Lowest priority — fix after the split, since
renaming the route is itself a (small) risk.

---

## 3. `templates.tsx` split plan (staged, with risk)

### 3.1 What's actually in the file (by line range)

| Lines | ~LOC | Content | Layer it belongs to |
|---|---|---|---|
| 1–186 | 186 | imports (40+ groups from engine/game/lib) | — |
| 187–525 | 339 | constants + **codec**: `entitiesTo/FromAssets`, `questsTo/FromAssets`, `buildingsTo/FromAssets` | `lib` / `engine` persistence |
| 525–1463 | 938 | **combat runtime**: `EnemyRuntime`, `findTarget`, `stepCombat`, `applyPlayerAttack`, `tickProjectiles`, `applyEnemyRetaliation`, projectiles; **quest draft**; `questAnchorScreenPos` | `src/game/runtime` |
| 1464–2183 | 720 | `TEMPLATE_PRESETS` + `PRESET_CATEGORIES` (**pure DATA**) | `src/game/presets` |
| 2184–2458 | 275 | small presentational comps (`Card`, `TileSwatch`, swatches) + swatch DATA | `components/game` + `engine` data |
| 2459–2619 | 160 | `PlayerState`, facing/aim/jump logic (pure, **tested**) | `src/game/runtime/player` |
| 2620–3324 | 705 | HUD + quest + editor UI comps (`CombatHud`, `AbilityBar`, `QuestHud`, `QuestAuthoringCard`, `GameEditor`, `GamesViewOverlay`, `FlowViewOverlay`) | `components/game` |
| 3325–4572 | 1,248 | enemy-move/cannon/loadout helpers + tooltips/panels/modals/entity-editor bodies | mix: `game/runtime` + `components/game` |
| 4573–9216 | **4,644** | `TemplateEditor` — the god component (loop + state + handlers + JSX) | stays a page, but thinned |
| 9217–12881 | **3,665** | **render pipeline**: `render` (iso), `render2D`, `renderTopView` + all `drawIso*`/`draw2D*`/`drawTop*`, lighting, water, fountains, hp/quest markers, block figures | `src/engine/render` |

So roughly: **~3.6k LOC of renderers**, **~2.5k LOC of pure runtime/codec/data**, **~2.2k LOC of
React components**, and a **~4.6k LOC component** that should shrink to an orchestration shell of a
few hundred lines once the rest leaves.

### 3.2 Target homes
```
src/lib/gridCodec.ts                 entity/quest/building ↔ GridAsset (pairs with api.ts serializeGrid)
src/game/presets/templatePresets.ts  TEMPLATE_PRESETS + PRESET_CATEGORIES (data)
src/game/runtime/player.ts           PlayerState, facing, aim, jump
src/game/runtime/combatLoop.ts       EnemyRuntime, findTarget, stepCombat, retaliation, projectiles
src/game/runtime/questDraft.ts       QuestDraft + builders
src/engine/render/index.ts           barrel
src/engine/render/iso/*              render(), drawIso* family, lighting/water/fountains
src/engine/render/topdown/*          render2D + draw2D*
src/engine/render/birdseye/*         renderTopView + drawTop*
src/engine/render/shared/*           shadow text, hp bars, quest markers, block figure, color utils
src/components/game/hud/*            CombatHud, AbilityBar, QuestHud, vitals
src/components/game/panels/*         EquipmentPanel, QuestLogPanel, PlayerStatsPanel, InventoryCard, Modal, tooltips
src/components/game/editor/*         GameEditor, GamesViewOverlay, FlowViewOverlay, entity-editor bodies, swatches
src/pages/.../templates.tsx          thin shell: hooks + <renderers/> + <components/>
```
(`src/engine/render/` vs `src/game/runtime/` could alternatively be `src/game/render`; either is
fine as long as renderers — which only consume grid+state and draw — sit on the engine side and RPG
rules sit on the game side. Renderers depend on both `engine` tiles and `game` entity types, so
`engine/render` is the better fit.)

### 3.3 Stages — do in this order (each ships independently, behind tests)

**Stage 0 — Scaffolding (no behavior change, ~LOW).** Create the target dirs + barrels. Nothing
moves yet. Lets later stages land as pure cut/paste + import rewrite.

**Stage 1 — Codec + preset DATA (LOW risk, no React).**
Move §187–525 codec → `lib/gridCodec.ts`; move §1464–2183 presets → `game/presets/templatePresets.ts`.
Pure functions/data; codec is already partly exported and covered by
`__tests__/lib/api.assetRoundtrip.test.ts` + `templatePersistence.test.ts`. **Risk:** LOW.
**Payoff:** removes ~1,050 lines and untangles persistence. **Dep:** GridAsset (engine), Entity/Quest
(game) — both already imported.

**Stage 2 — Pure runtime that tests already target (LOW–MED risk).**
Move §2459–2619 → `game/runtime/player.ts`; §525–1463 → `game/runtime/{combatLoop,questDraft}.ts`
(+ `questAnchorScreenPos` to `engine/render/shared` since it's a projection helper). Then repoint
the 6 test imports (P1) to the new modules. **Risk:** LOW–MED — the existing tests are the safety
net; the only hazard is shared local constants travelling with the functions. **Payoff:** ~1,100
lines out; tests stop importing from a page.

**Stage 3 — Renderers (BIG win, MED risk).**
Move §9217–12881 → `engine/render/{iso,topdown,birdseye,shared}`. These take `ctx` + grid + state
and draw (no React), but they read many file-local constants/helpers — extract those into
`render/shared` and pass per-frame state through a typed `RenderContext` object instead of closure
capture. **Risk:** MED — no React, but lots of shared helpers and the standard's noted per-frame
allocation hot-paths; mitigate with canvas smoke/golden snapshots before & after. **Payoff:**
removes ~3,665 lines (the largest single reduction) and gives the renderers a real home + testability.

**Stage 4 — Presentational components (MED risk).**
Move §2184–2458, §2620–3324, and the panels/modals/tooltips/entity-bodies in §3325–4572 →
`components/game/{hud,panels,editor}`. Props-driven and mostly self-contained; co-locate
`questOfferModal.test.tsx`. **Risk:** MED — watch for components sharing local helper consts with
the editor. **Payoff:** ~2,200 lines out; reusable game UI; `components/game/` finally exists.

**Stage 5 — Thin the god component (HIGH risk, do LAST).**
What remains is `TemplateEditor` (§4573–9216). Extract the game loop into `useGameLoop`, editor
state into `useEditorState`/reducer + tool hooks (`useEntityTools`, `useBuildingTools`), leaving
`TemplateEditor` as an orchestration shell (<500 lines) composing hooks + extracted renderers +
extracted components. **Risk:** HIGH — this is the live `requestAnimationFrame` loop with
ref/latest-closure patterns, plus the **documented module-global ↔ React-state desync**
(`debugMode`/`topViewMode`/`flowViewMode`) that §2 of `CODING-STANDARDS.md` flags. Fix the desync
(collapse to one `viewMode` state machine) as part of this stage. Only safe **after** stages 1–4
have built the test/extraction safety net.

**Dependency order:** 0 → 1 → 2 → 3/4 (parallelizable) → 5. Codec/presets/runtime first (cheap,
pure), renderers + components next (independent of each other), god-component last.

---

## 4. Recommendations (prioritized — effort / risk / payoff)

| # | Recommendation | Effort | Risk | Payoff |
|---|---|---|---|---|
| 1 | **Execute the §3 split of `templates.tsx`** in staged order (1→5). This is the dominant structural debt and the repo's own standards already prescribe it. | XL (multi-session) | rises per stage (LOW→HIGH) | **Very high** — testability, navigability, kills the #1 anti-example |
| 2 | **Stages 1–2 first** (codec + presets + pure runtime → `lib`/`game`), repoint the 6 page-importing tests. Highest payoff-per-risk slice. | M | LOW | High — removes ~2.1k lines, fixes P1 immediately |
| 3 | **Decide the fate of `canvasLogic` + legacy `engine` core + scratch pages.** Confirm `engine-test/top-view/test-ascii/interactive-ascii-version` are unused, then either delete or relocate under an excluded `src/_dev/` (and drop the dead legacy `engine/{GameEngine,Camera,Player,adapters}` + barrel if truly unused). | S–M | LOW–MED (verify refs first) | High — removes a whole second engine; one canonical engine |
| 4 | **Add `src/components/game/`** as the home for extracted game UI (Stage 4 lands here). Establishes the missing portfolio↔game UI boundary in `components/`. | S (scaffold) | LOW | Medium |
| 5 | **Move CV data out of `lib/`** (`cv-data*.ts` → `src/data/`), leaving `lib/` as infra/persistence only. | S | LOW | Medium — clean layer |
| 6 | **Delete `components/themes/backups/*.backup.tsx`** (rely on git history). | XS | LOW | Low–Med — ~3.3k dead lines gone |
| 7 | **Consolidate the test root** — fold `/__tests__` (3 files) into `src/__tests__`, update `jest.config`/`roots`. | S | LOW | Medium — one mirror |
| 8 | **Unify type homes** — retire `src/interfaces/` (or fold into the relevant `types.ts`) once the legacy adapter/`canvasLogic` are gone; keep per-module `types.ts` + `src/types/` for ambient `.d.ts`. | S | LOW (after #3) | Medium |
| 9 | **Flesh out `engine/index.ts`** to a complete, intentional barrel (it currently exports only the legacy core + a few tile helpers while 30 modules are deep-imported), or drop the barrel and standardize on deep imports. Decide once and document. | S | LOW | Low–Med — consistency |
| 10 | **Rename `templates.tsx` → e.g. `editor.tsx`/`play.tsx` and the route** to match reality, ideally under a Nebulith-named folder. Do **after** the split. | M (route change) | MED (URLs, `index.tsx` links) | Low–Med — clarity |
| 11 | **Add an `ARCHITECTURE.md`** documenting the `app`(portfolio)↔`pages`(game) split and the `engine`/`game`/`lib`/`components/game` layer contract, so the boundary survives. | S | LOW | Medium — keeps it from re-rotting |

### What's already good (don't "fix")
- `engine` / `game` split is coherent, documented (`game/types.ts` contract), and heavily unit-tested
  (49 of 66 tests cover `engine`+`game`).
- The page **already imports** the bulk of its logic from `engine`/`game` — most mechanics were
  extracted; what's left in `templates.tsx` is the editor/renderer/codec residue this plan targets.
- App-Router portfolio vs Pages-Router game is a legitimate Next.js pattern and gives a real
  top-level portfolio↔game seam.
- `src/__tests__` mirrors `src` sensibly; `docs/` is small but on-point and already contains the
  standards this audit leans on.
