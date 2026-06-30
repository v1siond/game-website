# Nebulith — Documentation Index

**Nebulith** is an ASCII tile-based isometric RPG game engine: build a level once in a
top-down grid, then walk and play it in top / 2D / isometric views. It lives in this site
under `src/pages/personal-projects/game-engine/` (engine logic in `src/engine/*` and
`src/game/*`).

**New here? Read [ARCHITECTURE.md](./ARCHITECTURE.md) first** — it's the map of the whole
system; every other doc is a zoom-in.

## As-built reference (written from the code)

| Doc | What it covers |
|---|---|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | The heart: one top-down map as the source of truth, collision == building footprint (door stays walkable), the three pure renderers + shared projection + camera + iso offscreen ground cache, the game loop, the data flow (stage gen → grid → render; editor; play mode), and the save/load codec (`nebulith:*` marker records + the field-preserving clone). Includes the live-vs-legacy file map and a gotchas list. |
| [world-generation.md](./world-generation.md) | Stage generation pipeline + the `ARCHETYPES` dispatch (town/city/forest/cave/temple/boss-stage), settlement layout (roads, plots, centre plaza + fountain, town-vs-city scaling), building composition + footprint stamping, seasons (`zones.ts`), and connectors. |
| [combat-and-entities.md](./combat-and-entities.md) | The `resolveAttack` damage pipeline, the player ability registry + loadout (slots 1–4), enemy attack patterns + selector, enemy archetypes, the spawner, gear, and the play-loop targeting / 8-way aim / jump + attack visuals. |
| [rendering-and-sprites.md](./rendering-and-sprites.md) | The label standard (`labelForCell`, per-label collision, autotiling), the ASCII sprite system (walk frames, entity art + palettes), the two animation engines (transform track + glyph-swap cycles), and the bracket-arm player swing. |

## Design docs (the "why" + v1 scope)

These predate / accompany the build; they capture intent and what was deliberately deferred.
The as-built docs above link to them.

| Doc | What it covers |
|---|---|
| [ability-system.md](./ability-system.md) | Data-driven ability system design: seeded animations, the ability database, per-entity loadouts, and the configurable enemy-attack pattern. |
| [animation-system.md](./animation-system.md) | Frame-based cell-animation authoring design (author defines motion as frames, not opaque presets). |
| [games-flows.md](./games-flows.md) | "Games" = ordered flows of templates (level 1, 2, 3 …); the model + v1 localStorage persistence (`gamesStore.ts`). |
| [editor-ui-design.md](./editor-ui-design.md) | The approved editor redesign ("Figma for games"): the 5-minute golden path, the hybrid layout (tool-rail + canvas + morphing Inspector + on-canvas quick-actions), the global art-style/tileset swap, the unified trigger model, and the staged build plan. |

## Standards

| Doc | What it covers |
|---|---|
| [CODING-STANDARDS.md](./CODING-STANDARDS.md) | The stack-specific senior bar (TypeScript · React · ITCSS · canvas/game-loop), with concrete anti-examples from this repo. |

## Other references in the repo

- `docs/superpowers/specs/` — homepage theme + section design specs (the surrounding portfolio
  site, not the engine).
- `.changelogs/` (repo root) — dated change notes; the running history of how the engine got
  built (cell labels, collision model, combat, persistence, iso perf, …). Useful archaeology
  when a design decision is unclear.
- `playwright/NEBULITH-DEMO-SCRIPT.md` — the demo walkthrough script.

## Audits (`docs/audits/`)

Point-in-time analyses (read-only findings + recommendations; nothing auto-applied).

| Doc | What it covers |
|---|---|
| [audits/dead-code-and-duplication.md](./audits/dead-code-and-duplication.md) | Dead/unused code (the legacy OO engine + orphan prototype routes, fully-dead engine files, dead exports, `.backup.tsx`) and duplicated logic (player render iso↔2D, the entity/quest/building codec triples, scattered math helpers), each with file:line + safe-vs-risky removal notes. |
| [audits/folder-structure.md](./audits/folder-structure.md) | Folder/code-placement review: the 12.8k-line `templates.tsx` god file + a staged split plan, pure logic trapped in the page route, the legacy parallel engine, and ranked structural recommendations (effort/risk/payoff). |
| [audits/engine-extraction-analysis.md](./audits/engine-extraction-analysis.md) | Feasibility/effort/approach for extracting the engine into its own package consumed by game-website: extractable surface + public API, coupling blockers, approach options (recommends a workspace monorepo), and a phased effort estimate. |
</content>
