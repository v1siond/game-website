# 2026-06-22 — zones, iso perf/zoom, forest tuning, dodge/block

## Zones / content
- Replaced elemental zones with **seasons**: spring (default), summer, autumn, winter — drive ground + tree/nature tints.
- Added **3 biome zones**: desert (sand, dry scrub, oasis), beach (sand + sea, palms), lava (ash/rock/basalt, molten hazard, charred trees). Editor zone picker now shows all 7 (4-col grid).
- Forests **~36% less dense** (summer passages ~45%→~29%) via a per-zone `FOREST_DENSITY` knob; **spring clearly airier than summer** (~22% fewer trees, distinct palettes — spring fresh + blossom pink, summer deep green).
- **6 spring flower types** (✿ ❀ ✾ ❁ ✽ ❋), all walkable; summer a smaller set; arid/cold zones don't flower.

## Isometric rendering
- **Zoom-aware visible range**: tile span derived from the actual zoomed tile size and clamped to the grid (iterate exactly the on-screen cells — fewer zoomed in, more zoomed out; no blank edges, no wasted scan).
- **Cube ground**: every tile extrudes down (`cubeDepth`) into a shaded block.
- **Occlusion-culled cube sides**: a side face draws only when the toward-camera neighbour is lower/absent — interior faces (hidden anyway) are skipped (~2×N → ~2×perimeter fills).
- Earlier: dropped the per-frame `measureText` in `drawIsoLabeledCell`/`drawIsoEntity` (the canvas-2D layout call that tanked fps).

## Editor
- Default grid **40×40**.
- **Assets palette**: each section is a collapsible dropdown (collapsed by default); the Assets card stays expanded.

## Combat (TDD)
- **dodge%** on `Stats` (optional, 0 default) + **blockChance%** on shields (`Weapon`).
- `resolveAttack` rolls dodge then block (injected `roll` RNG for determinism) before damage; a dodged/blocked hit still fires but deals 0. 290 engine/game tests green.
