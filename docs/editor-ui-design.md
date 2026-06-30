# Nebulith Editor — UI Design

> Status: **approved design** (this session). The "Figma for video games": prototype a playable game
> idea in **~5 minutes**, ultra-intuitive for newbies but powerful. ASCII is the default art skin;
> swappable tilesets are the next milestone. This doc is the source of truth for the editor rebuild;
> it reorganizes ALL existing features (nothing is removed) and adds the art-swap + trigger systems.

## North star — the 5-minute golden path

Every layout choice serves this flow having near-zero friction (depth is *available*, never *in the way*):

```
1. ⚡ Generate        pick Forest/Village → a full, alive, accurate map (already works; the MVP engine)
2. 🎨 Style           one click: ASCII → "Pixel Forest" → whole world reskins
3. ↖ Select & tweak   click a goblin → Inspector → bump HP, give it an attack
4. ⚡ Add a trigger    click the cave door → "on enter → win"   (now it's a game)
5. ▶ Play             walk it. Done.
```

## Layout — Hybrid (tool-rail + canvas + morphing Inspector + on-canvas quick-actions)

```
TOP   ↖ iso 2d top flow        ⚡ Generate ▾    🎨 Style: ASCII ▾    ▶ Play   💾 Save
┌ rail ┬──────────── canvas ────────────┬────────── INSPECTOR ──────────┐
│ ↖ Sel │            ┌ ✦ ⚡ ↗ ◰ ┐         │  (morphs to the selection)    │
│ ▢ Pnt │            └────┬─────┘         │   ▸ Goblin (enemy)            │
│ ◈ Unit│              ╔══╧══╗            │     ❤ HP   ▓▓▓ 30            │
│ ⌂ Bldg│              ║ <#  ║ ← selected │     ⚔ Attack    6            │
│ ↗ Link│              ╚═════╝            │     ◰ Art / sprite           │
│       │                                 │     ✦ Animation   ⚡ Trigger  │
└───────┴─────────────────────────────────┴───────────────────────────────┘
        quick-actions float on the selection · full settings live in the Inspector
```

- **Tool-rail (left, slim icons):** `↖ Select` (default) · `▢ Paint` (tiles/ground) · `◈ Unit` · `⌂ Building` · `↗ Connector`. Pick a tool → click the canvas to place; `Select` → click to inspect.
- **Canvas (center):** the game world; the view toggle (iso/2d/top/flow) lives in the top bar. Selection draws a highlight + the floating quick-action toolbar above the element.
- **Inspector (right):** the star — see below.
- **Top bar:** view toggle · **⚡ Generate** (zone + variant dropdown) · **🎨 Art Style** switcher · **▶ Play** · **💾 Save**.
- **Quick-actions (float on selection):** the hottest verbs as icons — `✦ animate · ⚡ trigger · ↗ connect · ◰ style` — each just scrolls/opens that Inspector section. One click on the canvas; deep edit in the panel.
- **Modals = libraries only:** the **Tile / Art-Style browser**, the **Ability database**, **Games / Flows**, the player **Inventory**. (Everything else is inline.)

## The Inspector morphs to the selection

This is the learnability unlock: the right panel always answers "what can I do with *this*?", showing only the relevant sections, consistent across types.

| Selected | Inspector sections |
|---|---|
| **Cell** | ◰ Tile/ground · ⛰ Height · ✦ Animation · ⚡ Trigger |
| **Unit** (enemy/npc/player) | ✎ Name · ❤ Stats (HP/attack/defense/speed…) · ◰ Art/sprite · ✦ Animation · ⚔ Attacks/Abilities (→ Ability DB) · 🧭 Movement pattern · ⚡ Trigger (on-defeat) |
| **Building** | ⌂ Type · ▢ Door side · ◰ Art (walls/roof) · ✦ Animation |
| **Connector** | ↗ Target level · ⚡ When (enter/interact) · ⊹ Spawn cell |
| **Nothing** | the stage: ⚡ Generate · 🎨 Style · grid size · day/night |

Sections are collapsible; a newbie sees the top 2–3 (name/stats/art), power users expand the rest. The quick-action icons jump straight to a section.

## Systems → how they plug in

### Art-style / tileset swap (next milestone)
- **Global skin** (top-bar 🎨): a style = a mapping `element-type → tile`. Switching the active style re-skins the whole game instantly. ASCII is the built-in default; tilesets are added styles.
- **Per-element override:** Inspector `◰ Art` → opens the **Tile Library** (a modal), tiles categorized by style; pick one to override just this element. An element with no override follows the global skin.
- **Data model:** each renderable resolves its glyph/tile via `resolve(elementType, style, override?)`. ASCII renderers stay; a tile renderer draws an image/sprite when the style provides one. Real tiles come from an uploaded set or a built-in pack (see `docs/animation-system.md` "real tiles" note).

### Triggers (unified — absorbs connectors)
> **Select a cell or element → ⚡ Trigger → "When `[event]` → do `[action]`."**
- **events:** `on enter` (step on cell) · `on interact` (press E) · `on defeat` (kill this unit)
- **actions:** `spawn` units · `give` item · `go to` level *(= today's connector)* · `win` / `lose` · `show message`
- A cell/element can hold one or more triggers. Connectors become the `go to level` action, so the connector authoring folds into this one model. The play loop already has the hooks (connector enter/interact, quest events, win/lose state) — triggers wire onto those.

### Animation (any element)
- Inspector `✦ Animation`: one-click presets (wind-sway, flicker…) or **Customize** → the frame-based builder (`docs/animation-system.md`, already built) in a focused popover. Works identically for a cell, tree, unit, building.

### Entity stats / abilities
- Inspector `❤ Stats`: live steppers/sliders (HP/attack/defense/speed/dodge…). `⚔ Attacks/Abilities` → the **Ability database** modal (already built: registry + assign-into-slots). Enemy attack patterns reuse the same model.

### Generate / randomize (the MVP engine)
- `⚡ Generate` (zone = season, variant = Forest/Village/City…). Forest + Village are accurate today (enough for the MVP demo); the rest improve later. This is what makes a 5-minute game possible — the world starts populated and alive.

## Migration — every current feature re-homes (nothing lost)

| Today | New home |
|---|---|
| DISPLAY / STAGE PRESETS / ASSETS / ENTITIES / BUILDINGS / CONNECTORS sidebar cards | tool-rail (modes) + Inspector (per-selection settings) + top bar (Generate/Style/views) |
| Entity edit modals (identity/stats/movement/attack) | Inspector sections for a selected unit |
| Inventory / Quests / Ability browser / Games-Flows | library modals (unchanged) |
| Animation Author panel | Inspector ✦ Animation + the frame builder popover |
| Connectors authoring | the `go to level` trigger action |

## Build plan (staged, each validated + nothing breaks)

The `templates.tsx` split (renderers → `src/engine/render`, components → `src/components/game`, runtime → `src/game/runtime`) means we assemble from extracted pieces, not surgery on a 12k-line file.

- **A — Layout shell:** top bar + tool-rail + Inspector frame around the existing canvas; route current actions into them. Behavior unchanged underneath.
- **B — Morphing Inspector:** selection → Inspector sections; migrate the entity/cell/building/connector editing out of the old cards/modals into the panel.
- **C — Quick-action toolbar:** the on-canvas floating verbs.
- **D — Art-style system:** the style data model + global skin switch + Tile Library + per-element override (the milestone — also needs a tile/sprite renderer path).
- **E — Trigger system:** the unified trigger model + UI + wiring onto the play-loop hooks (folding in connectors).

Each stage: keep the editor fully working, validate (tsc + tests + isolated-server smoke + screenshots), commit + push. A and B are pure reorganization (low risk); D and E add the milestone systems.

Open/refinable later: multiple triggers per cell ordering, style packs format, tile upload UX, message/dialog styling.
