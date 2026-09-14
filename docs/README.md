# game-website docs — index

These docs **mirror the engine model**; the canonical copies live in
[`nebulith/docs/`](../../nebulith/docs/) and win on any conflict. This repo's copies map the model to
the frontend code (`src/engine/*`, `src/game/*`, `src/components/game/*`,
`src/pages/personal-projects/game-engine/*`). Working rule: **check docs → understand → do the work**,
and update the relevant doc in the same change.

## Read first — the model

- [`MAP-MODEL.md`](MAP-MODEL.md) — the cell/block/tile model and the three views (ISO/2D/TOP). **Start here.**
- [`ENGINE-ARCHITECTURE.md`](ENGINE-ARCHITECTURE.md) — one grid → three renders; the data flow and invariants.
- [`TILE-VOCABULARY-CONTRACT.md`](TILE-VOCABULARY-CONTRACT.md) — the `<base>_<edge>` tile naming.
- [`TILESET-AUTHORING.md`](TILESET-AUTHORING.md) · [`TILE-BACKEND-MIGRATION.md`](TILE-BACKEND-MIGRATION.md) — how tiles are authored and owned by the backend.

## Authoring objects

- [`OBJECT-CONSTRUCTION.md`](OBJECT-CONSTRUCTION.md), how an object (a tile composition) is built so it looks like the thing it is named after: the reference-first process, the engine facts sheet, the six patterns, the checklist. Read it before authoring any composition.
- [`HITBOXES-AND-ELEVATION.md`](HITBOXES-AND-ELEVATION.md), the hitbox and elevation implementation spec.
- [`DESIGN-ENTRANCES.md`](DESIGN-ENTRANCES.md), the design for the four map entrances, with the honest render comparison.
- [`references/SOURCES.md`](references/SOURCES.md), the isometric reference art every object is modelled against, with sources and licences.

## Features & systems

- [`FEATURES.md`](FEATURES.md) — per-feature flows and where they live in the code.
- [`EDITOR-INTERACTION-SPEC.md`](EDITOR-INTERACTION-SPEC.md) — the editor interaction model.
- [`ANIMATION-SYSTEM.md`](ANIMATION-SYSTEM.md) — the `Animation` envelope + z-index draw priority.
- [`LIGHTING.md`](LIGHTING.md) — the night ground-glow lighting model.
- [`GENERATION-SPEC.md`](GENERATION-SPEC.md) — the layer-pass stage/town generator.
- [`ALGORITHMS.md`](ALGORITHMS.md) — the algorithm decision database for generator problems.
- [`COMBAT-AND-SYSTEMS-SPEC.md`](COMBAT-AND-SYSTEMS-SPEC.md) · [`TRIGGERS-SPEC.md`](TRIGGERS-SPEC.md) — the game layer and the trigger system.

## Standards & roadmap

- [`CODING-STANDARDS.md`](CODING-STANDARDS.md) — **the senior bar for this repo** (TypeScript, React, ITCSS, canvas/game-loop).
- [`ARCHITECTURE.md`](ARCHITECTURE.md) · [`NEBULITH-SOURCE-OF-TRUTH.md`](NEBULITH-SOURCE-OF-TRUTH.md) · [`GAPS-AND-ROADMAP.md`](GAPS-AND-ROADMAP.md) — the wider system, vision, and roadmap.
