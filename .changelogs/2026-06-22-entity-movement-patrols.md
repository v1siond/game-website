# Entity movement patterns — enemies patrol

Date: 2026-06-22

Engine+game suites 278/278 green (5× stable), tsc clean on touched files.

## What changed

Enemies were completely static. Added a movement system:

- NEW `src/engine/movement.ts` (pure, tested): `stepMover(pos, pattern, cursor,
  isBlocked, chooseRandom?)` advances an entity ONE cell per tick toward its current
  waypoint; `sequential` loops the waypoints, `random` picks the next via an
  injected chooser (deterministic tests). Never steps into a blocked cell (waits).
- `types.ts`: `MovementPattern` (mode + waypoints) on the cross-module contract;
  `Entity.movement?` + `Entity.hittable?` fields.
- `templates.tsx`: placed enemies get a default left-right patrol so they move out
  of the box; the play loop advances all patrolling enemies on a throttled
  (~360ms) tick, treating walls / the player / other entities as blocked, syncing
  `entitiesRef` + React state.

## Deferred (still open under task #11)
- Entity TYPES (decoration / hittable / non-hittable) — `hittable` field exists but
  isn't wired into combat/rendering; `decoration` kind not added (it broke the
  exhaustive `Record<EntityKind>` maps — needs those handled first).
- Waypoint AUTHORING UI (click to lay a patrol path) — enemies use a default patrol
  for now.

## Files
`+ engine/movement.ts` · `+ __tests__/engine/movement.test.ts` · `~ game/types.ts`
· `~ pages/.../templates.tsx`

## NOTE
Needs a browser pass (patrol cadence/feel) along with the other unverified visual
changes this session.
