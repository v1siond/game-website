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
