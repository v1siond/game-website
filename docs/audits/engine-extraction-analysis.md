# Engine Extraction Analysis — pulling Nebulith out of `game-website`

**Type:** read-only analysis / proposal. No source modified, nothing committed.
**Date:** 2026-06-30
**Question:** How much work is it to extract the Nebulith **game engine** into its own
package/repo and consume it from `game-website`, and what is the best consumption approach?
**Foundation:** builds on [ARCHITECTURE.md](../ARCHITECTURE.md),
[folder-structure.md](./folder-structure.md), and
[dead-code-and-duplication.md](./dead-code-and-duplication.md). A cleanup sequence (dead-code
removal + dedup + a staged `templates.tsx` split) is **in progress**; the `templates.tsx`
split is the long pole and is also the hard prerequisite for this extraction.

---

## TL;DR

- **The engine is already ~85% a clean, framework-free library.** `src/engine/*` and
  `src/game/*` contain **zero** React/Next imports. The only things standing between today
  and a publishable package are (1) the renderers + game-loop + pure runtime still **trapped
  in `templates.tsx`** as zero-arg closures, (2) a couple of **dependency-direction leaks**
  (the `Connector` type lives in `lib/api.ts`; the REST CRUD client is mixed with the pure
  codec), and (3) **~2,400 LOC of dead second-engine code** in `src/engine` that must not
  travel with the package.
- **Recommended approach: a single-repo npm/pnpm workspace monorepo** — one package
  `@nebulith/engine` (engine + game + assets + codec + renderers, **framework-free, no React
  dep**) consumed by the `game-website` app. It gives you a real package boundary, shared
  types with zero duplication, and instant local iteration, while keeping a true separate-repo
  split a trivial `git filter-repo` away if you ever need it. A separate repo + private
  registry now would buy a solo dev nothing but a publish/bump/install treadmill.
- **Effort is dominated by one long pole: the `templates.tsx` split (Phase 0).** That work is
  already scheduled for other reasons. *Excluding* Phase 0, the extraction itself is roughly
  **1–2 focused weeks** (define boundary + workspace wiring + migrate consumers + CI).
  *Including* Phase 0 honestly, it is **multi-week**.
- **"Engine as a service" does not apply to the engine.** Generation, combat, and rendering
  are client-side canvas work. The only API-shaped concern — template **storage** — is
  *already* a service (`/api/templates` + Prisma) and should stay one. The engine consumes a
  `TemplateData` JSON DTO; the app owns where that JSON lives.

---

## 1. Extractable surface + public API

### 1.1 What IS the engine (candidate modules)

| Area | Path | LOC (live) | Framework coupling |
|---|---|---|---|
| Grid model | `src/engine/IsometricGrid.ts` | 359 | pure |
| Tileset / cell data | `Tileset.ts` (957), `cellTileset.ts` (202), `cellLabels.ts` (159), `colors.ts` (69), `multiCellAssets.ts` (228), `compositeFill.ts` (106) | ~1,720 | pure |
| Stage generation | `stageGenerator.ts` (1,820), `villageLayout.ts` (392), `zones.ts` (73), `buildingComposer.ts` (214), `buildingEditor.ts` (217), `isoBuilding.ts` (48) | ~2,760 | pure |
| World links / triggers | `connectors.ts` (56), `triggers.ts` (129) | 185 | pure |
| Animation runtime | `cellAnimation.ts` (230), `animationCycles.ts` (113), `assetAnimations.ts` (57), `entityAnim.ts` (19), `behaviors.ts` (18) | 437 | pure |
| Attack visuals / entity art | `attackAnimations.ts` (106), `entityArt.ts` (241), `entityQuestMarker.ts` (20) | 367 | pure |
| Movement | `movement.ts` (278) | 278 | pure |
| **RPG domain (`src/game/*`)** | combat, abilities, weapons, projectiles, gear, inventory, loadout, entities, archetypes, spawner, patterns, quests, types | ~2,440 | pure |
| Games-list flow | `game/games.ts` (83), `game/gamesStore.ts` (50) | 133 | **`window.localStorage`** |
| ASCII art | `src/assets/ascii/*` (buildings/vegetation/props/characters + barrel) | 577 | pure (leaf, zero `@/` imports) |
| Shared math | `src/lib/math.ts` | 30 | pure |
| **Persistence codec** | `serializeGrid` / `deserializeToGrid` inside `src/lib/api.ts` | ~55 | pure (only needs `IsometricGrid`) |
| **Engine logic trapped in the page** | renderers + game loop + combat runtime + codec inside `templates.tsx` | **~4,700** | **canvas + closure-captured React state** |

**Aggregate:** the engine is roughly **~14,000 LOC of real engine code** — of which **~9,300
already lives in clean, tested modules** (`engine` + `game` + `assets` + `math` + codec) and
**~4,700 is still fused into `templates.tsx`** (see §1.4).

### 1.2 What STAYS in `game-website` (not the engine)

- The whole **portfolio** (`src/app/*`, `src/components/themes/*`, `src/data/*`,
  `src/contexts`, `src/i18n`, `cv-data*.ts`) — unrelated.
- The **Next.js page shell + gallery** (`templates.tsx` orchestration shell after the split,
  `index.tsx`), `_app.js`, `_document.js`.
- The **REST CRUD client + API routes + Prisma**: `listTemplates`/`getTemplate`/`createTemplate`/
  `updateTemplate`/`deleteTemplate` in `api.ts`, `src/pages/api/templates/*`, `prisma/`,
  `src/lib/prisma.ts`. This is the *storage service*, not the engine (see §2.4).
- **React game UI** extracted by the split (`components/game/{hud,panels,editor}`) — consumes
  the engine but is app presentation; keep it in the website (or a later optional
  `@nebulith/react` package). Keeping it out is what lets the core package stay React-free.
- **All dead/legacy code** (§2.7) — must be deleted, not extracted.
- **`pixellab.ts`, `animation-keyframes.ts`** — sprite-generator tooling for the portfolio's
  App-Router sprite tools, not the iso game engine.

### 1.3 Proposed PUBLIC API surface (`@nebulith/engine`)

A consumer (the website, a CLI, a test) should be able to do:

```ts
import {
  // ── Model (source of truth) ──
  IsometricGrid, type GridAsset, type GridBuilding,

  // ── World generation ──
  generateStage, stagePaint, type StageData, type VariantId,
  type ZoneId, ZONE_PALETTES,
  scatterEntities, ENEMY_TYPES,

  // ── RPG domain ──
  resolveAttack, createInventory, createLoadout, GEAR_CATALOG,
  type Entity, type Quest, type Direction, type Connector,

  // ── Renderers (canvas; take an explicit RenderContext — see §2.2) ──
  renderIso, render2D, renderTopView,

  // ── Game runtime (extracted from templates.tsx) ──
  stepCombat, tickProjectiles, makeEnemyRuntime,
  type PlayerState, aimDelta, jumpLandingCell, findTarget,

  // ── Persistence codec (DTO ⇄ grid; no transport) ──
  serializeGrid, deserializeToGrid, type TemplateData,
} from '@nebulith/engine'
```

Suggested internal layout of the package (mirrors the existing split + the audit's split plan):

```
packages/engine/src/
  model/        IsometricGrid, cellLabels, tileset, colors, multiCellAssets
  worldgen/     stageGenerator, villageLayout, zones, buildings, connectors, triggers
  domain/       (was src/game) combat, abilities, gear, inventory, loadout, entities, spawner, patterns, quests, types
  anim/         cellAnimation, animationCycles, attackAnimations, entityArt, movement, behaviors
  runtime/      player, combatLoop, questDraft           ← extracted from templates.tsx
  render/       iso/ topdown/ birdseye/ shared/           ← extracted from templates.tsx
  codec/        gridCodec + serializeGrid/deserializeToGrid + TemplateData/Connector types
  assets/ascii/ buildings, vegetation, props, characters
  math.ts
  index.ts      the public barrel above
```

### 1.4 Pure vs coupled (the decisive split)

- **Pure / framework-free (already so):** *everything* in `src/engine/*` and `src/game/*`
  except the two noted below — **confirmed: zero `react`/`next` imports in either tree.**
  Plus `assets/ascii/*`, `lib/math.ts`, and the `serializeGrid`/`deserializeToGrid` codec.
  This is the bulk and it is genuinely a library today.
- **Canvas-coupled but React-free (the renderers):** the three renderers + the `drawIso*`/
  `draw2D*`/`drawTop*` families (~3,665 LOC in `templates.tsx`). They only need a
  `CanvasRenderingContext2D` (a browser global typed by the TS `dom` lib — **no runtime
  dependency**). The blocker is not canvas, it is that today they are **zero-argument
  `useCallback` closures** (`const render = useCallback(() => {…})`) that read grid, camera,
  player, and dozens of file-local constants straight from component scope. To ship them they
  must accept an explicit typed `RenderContext` (§2.2).
- **React/Next-coupled (stays in the app):** the `TemplateEditor` god component, the rAF loop
  wired through refs, the HUD/panel/editor components, the gallery, `useRouter`/`Head`/`Link`.
- **DOM-global-coupled (decide per §2.5):** `game/gamesStore.ts` calls
  `window.localStorage` directly; the legacy `engine/Player.ts` + `GameEngine.ts` reference
  `document`/`window` (but those are **dead** — §2.7).

---

## 2. Coupling assessment — blockers ranked

Internal dependency direction is **mostly healthy** and points the right way:

- `assets/ascii/*` is a pure leaf (no `@/` imports).
- `engine` and `game` are framework-free.
- `engine` → `game` and `game` → `engine` is **type-only in all but one case**
  (`engine/movement.ts`, `engine/attacks.ts`, `engine/entityArt.ts` import `type` from
  `@/game/types`; the lone runtime crossing is `game/entities.ts` value-importing
  `entityFootprint` from `@/engine/entityArt`). The type graph is cyclic; **runtime is
  acyclic**. Consequence: **`engine` + `game` ship as ONE package, not two** (see B6).
- `engine`/`game` depend on `lib/math` (pure) and a stray `lib/api` **type** — both fixable.
- Nothing in `engine`/`game`/`assets` imports `@/components`, `@/contexts`, `@/data`,
  `@/hooks`, `@/themes`, or `@/app`. Clean.

### Blockers, ranked by how hard they gate the extraction

**B1 — (LONG POLE) The renderers + game loop + runtime are fused into `templates.tsx`.**
~4,700 LOC of engine code (renderers ~3,665; combat runtime/codec/player ~1,100) lives inside
a 12,881-line Next.js page. The renderers are parameterless closures; the game loop is a
once-mounted `requestAnimationFrame` reading latest state through refs; runtime helpers share
file-local constants. **No package boundary can exist until this is split out.** This is
exactly Stages 1–5 of the `templates.tsx` split already planned in
[folder-structure.md §3](./folder-structure.md) — so Phase 0 of this extraction *is* that
split. Risk rises per stage (codec/runtime LOW → renderers MED → god-component HIGH).

**B2 — Renderer state decoupling (subset of B1, the technically hardest piece).** Turning the
zero-arg `render`/`render2D`/`renderTopView` into functions that take a typed `RenderContext`
(grid, camera, player, view flags, animation clock, the iso offscreen-cache handle) instead of
closure-capturing them. Hazards called out in ARCHITECTURE.md: **no shared projection helper**
(each renderer re-inlines its own `toScreen`; iso math is re-inlined again in
`drawIsoGroundLayer`/`drawIsoWaterCells` to avoid per-cell allocation), the **iso-only
offscreen ground cache** with its `camKey`/content-signature invalidation, and per-frame
allocation hot-paths. Pixel-positioning code with no types as a net → mitigate with
canvas golden/smoke snapshots before & after.

**B3 — The `Connector` type lives in `lib/api.ts` but the engine imports it.**
`engine/connectors.ts` and `engine/stageGenerator.ts` do `import type { Connector } from
'@/lib/api'`. That points the dependency the wrong way (engine → app persistence). **Fix:
define `Connector` in the engine package (`codec/` or `worldgen/`) and have `api.ts`
re-export it.** Small, mechanical, but it must happen for a clean build graph.

**B4 — `api.ts` mixes the pure codec with the REST transport.** `serializeGrid` /
`deserializeToGrid` are pure (depend only on `IsometricGrid`) → move into the package.
`listTemplates`/`getTemplate`/`createTemplate`/`updateTemplate`/`deleteTemplate` hit
`fetch('/api/templates')` → stay in the website. The DTO types (`TemplateData`,
`CreateTemplateInput`) are shared → move the *types* into the package, let the website's
transport client import them. Note `api.ts` also imports `@/engine/triggers` and
`@/game/types` today, so the file already straddles the boundary — splitting it cleanly
resolves that. Easy because the codec is already pure (covered by
`__tests__/lib/api.assetRoundtrip.test.ts`).

**B5 — `templates.tsx`/`index.tsx` are the only real external consumers.** Good news framed as
a blocker only for sequencing: outside the package, the live consumer surface is essentially
**one page + its gallery**. (The audits' grep confirms the *other* importers —
`pages/engine-test.tsx`, `pages/top-view.tsx`, `levels/village-grid.ts` — are dead prototypes;
`levels/village.ts` is live, used only by `templates.tsx`.) Migration in Phase 3 is therefore
narrow, but it must wait for B1.

**B6 — engine↔game type cycle → one package.** Not a blocker to fix, a design constraint to
respect: do **not** try to publish `@nebulith/engine` and `@nebulith/game` as two packages —
the cycle (and `game/entities.ts` → `engine/entityArt.ts`) would force `peerDependencies` on
each other. Ship them as one package with internal folders.

**B7 — `window.localStorage` in `game/gamesStore.ts`.** The Games-list (level-flow) persists
straight to `localStorage`. Two clean options: (a) treat `games.ts`/`gamesStore.ts` as
**app-flow** and leave them in the website (they are arguably not engine core), or (b)
**dependency-inject a storage adapter** (`{ get(key), set(key,val) }`) so the package stays
environment-agnostic. Lean toward (a). Minor either way.

**B8 — Dead second engine must not be extracted.** `src/engine` still carries the OO canvas
engine (`GameEngine.ts`, `Camera.ts`, `Player.ts`, `engine/types.ts`, `adapters/legacyAdapter.ts`),
`TileGrid.ts`, `MapComposer.ts`, `asciiComponents.ts`, `buildingComponents.ts`,
`tileVocabulary.ts` — **~2,400 LOC of dead code** kept alive only by orphan prototype routes.
If extraction runs before the in-progress dead-code removal, you drag a *whole second engine*
into the new package. **Sequence the dead-code deletion first** (it is already underway).

**B9 — The `@/*` path alias.** Engine modules import via `@/game`, `@/lib/math`, `@/assets`.
In a standalone package these become package-internal/relative paths; the package needs its
own `tsconfig` (e.g. `@/*` → its own `src/*`, or just relative imports). Mechanical, but
touches every file — best done with a codemod during Phase 1.

**Not a blocker:** React/canvas peer-deps. Because the recommended core package is **React-free**
(the editor UI stays in the app), there is **no React peerDependency to manage** and **no
canvas runtime dep** (ctx is a passed-in browser global). This removes the single thorniest
part of most "extract the UI library" efforts.

---

## 3. Consumption approach — options + recommendation

The engine is a **client-side canvas library**. The transport-shaped concern (template
storage) is already separated. That frames every option below.

| Option | Fit | Pros | Cons |
|---|---|---|---|
| **(a) npm package on a registry** (private GitHub Packages / public npm) | OK *after* a workspace exists | Real versioning; clean consumer; reusable by other apps | Publish→bump→install treadmill kills local iteration for a solo dev editing both sides at once; `npm link` "fixes" it but is fragile and duplicates deps; premature now |
| **(b) git submodule** | Poor | No build tooling needed; keeps repos separate | Notorious DX (forgotten pointer commits, detached HEAD); no workspace type-resolution; manual build wiring; worst option for a solo dev |
| **(c) monorepo workspace** (npm/pnpm/yarn workspaces, optional Turborepo) | **Best** | One repo, one `npm install`; types resolve via symlink/TS project refs (zero dup); **instant local iteration** (edit engine → site sees it); single CI & single PR for cross-cutting changes; trivially liftable to a separate repo later | Slightly more root config; not "its own repo" literally (but see recommendation) |
| **(d) vendored copy** | No | Zero tooling | No real separation; defeats the purpose; drift |
| **(e) engine-as-API/service** | **Only for storage** | — | Rendering/generation/combat are browser canvas work — cannot live behind an API. **Template storage already IS the service** (`/api/templates` + Prisma); keep it. Do not service-ify the engine |

### Recommendation: **single-repo npm/pnpm workspace monorepo**

```
nebulith/                    (or keep the existing repo and add packages/)
  package.json               { "workspaces": ["packages/*", "apps/*"] }
  packages/engine/           @nebulith/engine — framework-free core (§1.3 layout)
  apps/web/                  the game-website Next app (consumes @nebulith/engine)
  tsconfig.base.json         shared compiler options + project references
```

**Why this wins for *this* codebase and a solo owner:**

1. **Local iteration speed is the dominant cost.** You will be editing the engine and the
   site together for a long time after the split. A workspace makes the engine's source
   resolve directly (or via `tsc --watch`) — no publish loop. A registry package or submodule
   taxes every cross-cutting change.
2. **Shared types with zero duplication.** `Entity`, `Quest`, `Connector`, `TemplateData`,
   `GridAsset` are needed on both sides. In a workspace they are imported from the package and
   resolved at source — no `.d.ts` syncing, no version skew.
3. **The React/canvas peer-dep problem disappears** because the core is React-free; the
   workspace just declares `react`/`react-dom` once at the app.
4. **CI stays one pipeline** (build engine → typecheck/test → build app). The existing
   `next/jest` setup and the 50 engine/game tests move into the package and keep running.
5. **It is the prerequisite for *any* later separation anyway.** If you genuinely need a
   separate repo + private registry later (e.g. a second consumer app), the package is already
   a clean unit: `git filter-repo` the `packages/engine` history out, publish to GitHub
   Packages, swap the workspace dep for a versioned one. The workspace is strictly the
   lower-risk first move and never wasted.

> If a separate repo is a hard requirement *now*, the honest answer is: do the workspace
> first regardless, then split — there is no shortcut that skips Phases 0–1. The literal
> "own repo" is a ~Small add-on (Phase 5) once the workspace exists, not an alternative to it.

---

## 4. Phased effort estimate + risks

Effort scale: **S** ≈ <1 day · **M** ≈ 1–3 days · **L** ≈ multi-day/multi-session.

### Phase 0 — Prerequisites: split `templates.tsx` + delete the dead engine — **L (the long pole)**
*Already in progress for other reasons.* Execute the [folder-structure §3](./folder-structure.md)
split (Stages 1–5) and the [dead-code](./dead-code-and-duplication.md) removal:
- Codec → `lib/gridCodec.ts`; presets → `game/presets`; pure runtime (`player`, `combatLoop`,
  `questDraft`) → `game/runtime` (LOW); renderers → `engine/render/*` behind a **typed
  `RenderContext`** (MED, B2); HUD/panels/editor → `components/game/*` (MED); thin the god
  component + collapse the module-global view-mode desync (HIGH).
- Delete the dead OO engine + orphan prototype routes + `canvasLogic` (B8).
- **Risk:** the renderer decoupling (B2) and the rAF-loop/ref/closure rework (Stage 5) are the
  hairy parts — live game loop, pixel positioning, iso offscreen cache. **Mitigation:** canvas
  golden snapshots + the grid-assertion TDD baseline already used in this repo; lean on the 50
  existing engine/game tests + the 6 page-importing tests as the safety net.
- **Could go wrong:** the renderers silently depend on a file-local const that doesn't make it
  into `RenderContext` → subtle visual regressions invisible to unit tests. Hence golden frames.

### Phase 1 — Define the package boundary + public API + build — **M**
- Create `packages/engine`; move the now-extracted modules in (engine + game + assets + math +
  codec + runtime + render). Author `index.ts` (§1.3).
- Fix **B3** (move `Connector` into the package, re-export from `api.ts`) and **B4** (split the
  pure codec + DTO types out of `api.ts`).
- Add the package `tsconfig` and a build (`tsc` emit, or `tsup` for dual ESM/types). Rewrite
  `@/*` imports → package-internal (B9, codemod).
- Move the 50 `__tests__/engine` + `__tests__/game` tests into the package; keep `next/jest`
  or switch the package to plain `ts-jest`.
- **Risk:** LOW–MED — mostly mechanical once Phase 0 has produced clean modules. Watch the
  `@/*` rewrite and the engine↔game one-package constraint (B6).

### Phase 2 — Workspace wiring — **S–M**
- Root `package.json` `workspaces`, `tsconfig.base.json` + project references, move the Next
  app under `apps/web` (or leave it at root and just add `packages/`). `npm install` links
  `@nebulith/engine` into the app.
- **Risk:** S–M — Next + workspace + Prisma path quirks (the `prisma generate` postinstall and
  the `@/*` alias in the app's `jest.config`/`tsconfig` need to coexist with the new package).

### Phase 3 — Migrate `game-website` to consume the package — **M**
- Repoint `templates.tsx`, `index.tsx`, and the website-side codec/transport from `@/engine`,
  `@/game`, `@/assets`, `@/lib/api` codec → `@nebulith/engine`. Delete the moved `src/engine`,
  `src/game`, `src/assets/ascii`, `src/lib/math` from the app.
- Decide B7 (keep `games`/`gamesStore` in the app, or DI a storage adapter into the package).
- **Risk:** MED — consumer surface is narrow (B5: one page + gallery), but it is the *live*
  game; full-flow smoke test (generate → edit → save → reload → play) is mandatory before
  declaring done.

### Phase 4 — CI + versioning — **S–M**
- Build order (engine before app), run the engine test suite + the app suite in CI.
- Versioning: in a workspace, internal `workspace:*` needs no version bumps. If/when you
  publish, add **changesets** for semver + a publish step.
- **Risk:** S — standard.

### Phase 5 (optional) — Lift into its own repo + private registry — **S (only after 0–4)**
- `git filter-repo` `packages/engine` into a new repo, publish to GitHub Packages, swap the
  workspace dep for `^x.y.z`. Only worth it once there's a second consumer.

### Effort summary

| Phase | Effort | Gating risk |
|---|---|---|
| 0 — split + dead-code removal (**prerequisite, in progress**) | **L** | renderer decoupling (B2), god-component/rAF rework |
| 1 — package boundary + API + build | M | `@/*` rewrite, codec/Connector inversion |
| 2 — workspace wiring | S–M | Next/Prisma/jest alias coexistence |
| 3 — migrate consumers | M | it's the live game — full-flow regression |
| 4 — CI + versioning | S–M | low |
| 5 — own repo + registry (optional) | S | only after 0–4 |

**Total, excluding Phase 0** (which is happening anyway): **~1–2 focused weeks** (M + S/M + M +
S/M). **Including Phase 0:** multi-week, and Phase 0 is by far the largest and riskiest chunk —
it is *the* honest long pole. The good news the data shows: once Phase 0 lands, the library is
**already framework-free**, the consumer surface is **one page**, and there is **no React/canvas
peer-dep tangle** to fight — so Phases 1–4 are comparatively routine.

### The three honest long poles
1. **The `templates.tsx` split (Phase 0)** — ~4,700 LOC of engine logic to lift out of a
   12.9k-line page, including the live rAF loop and the closure-captured renderers.
2. **Renderer decoupling (B2)** — turning zero-arg canvas closures into `RenderContext`-driven
   functions without visual regressions (iso offscreen cache, re-inlined projection math).
3. **The `api.ts` persistence seam (B3/B4)** — invert the `Connector` type and cleanly separate
   the pure codec (→ package) from the REST transport (→ app). Smaller, but load-bearing for a
   clean dependency graph.
