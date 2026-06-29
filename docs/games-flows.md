# Games / Flows (Nebulith engine) — design

> Status: **design + v1**. A "flow" of templates, presented to the player as a **Game**. Document the
> model + build a scoped v1 (like the ability/animation systems).

## Goal

A **Games** view that lists playable flows. Clicking a game drops you straight into the **first level**
(template) of that flow's order, in the play view. A flow defines an **ordered** sequence of templates
(level 1, 2, 3 …) that the author sets and can reorder; you can also jump directly to "level N" even
when not following the order linearly.

## What is a "flow / game"

The editor already has a **Flow view** (every template a node, every connector an edge — the spatial
graph). That graph captures *how rooms connect*, but not a **playable order**. So a **Game** is an
explicit, named, **ordered list of templates**:

```ts
interface Game {
  id: string
  name: string
  templateIds: string[]   // ORDERED — index 0 = level 1, 1 = level 2, …
}
```

- A game references existing templates by id; the same template can appear in different games.
- Level N = `templateIds[N-1]`. "Go to level N" loads that template in the play view.
- Connectors still drive in-flow walking (walk into a connector → its linked template); the game order
  is the **authored progression / quick-jump**, independent of the spatial connector links.

**Design call (v1):** a Game is an EXPLICIT grouping the author builds (not auto-derived from connected
components of the graph), because the author wants to *define the order* (level 1/2/3) — connectors are
spatial, not an order. If we later want "auto-detect a flow from connectors," it's additive.

## Persistence

Games are small (name + id list). v1 stores them the lightest way that doesn't need a schema
migration (the Prisma route was friction-prone): a `games` list in localStorage keyed to the
workspace, OR piggyback the existing template/asset channel. Document the choice; a proper `Game` DB
table is the later upgrade. (Whatever the v1 store, it must round-trip: create a game, add/reorder
templates, reload, it persists.)

## UI

1. **Games view** (a route/panel, e.g. reachable from the top nav near "Flow" / "← Templates"): lists
   all games (name + level count + a thumbnail of level 1 if cheap). **▶ Play** on a game → load
   `templateIds[0]` and enter the play view (reuse #37's Execute Game play mode + #38 grid camera).
2. **Game editor:** create/rename a game; **add templates** to it (from the template list) and
   **reorder** them (drag or up/down) — the order IS the level sequence; remove a template; a "go to
   level N" affordance that loads any level directly (for testing).
3. From the existing **Flow view**, an entry point to "make/edit this as a game" is a nice bridge
   (optional in v1).

## v1 (this session)

- The `Game` model + a tiny pure store (create / rename / addTemplate / reorder / remove / delete),
  unit-tested (ordering is preserved; level N → templateIds[N-1]; reorder/remove keep integrity).
- A **Games list view**: lists games, **▶ Play** loads level 1 into the play view (Execute Game).
- A **game editor**: create a game, add templates in order, reorder, remove; "go to level N" loads a
  level directly.
- Persistence good enough to round-trip (localStorage v1; DB table documented as the upgrade).

Deliberately **NOT** v1 (documented): a proper `Game` DB table + multi-user sync, auto-deriving a flow
from connector graph components, per-game settings (starting inventory, difficulty), thumbnails if
expensive, and win/lose/flow-complete handling.
