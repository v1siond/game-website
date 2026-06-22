# 2026-06-22 — true end-to-end: build + play a multi-room game

`src/__tests__/game/buildAndPlayGame.test.ts` (6 tests) drives the ACTUAL system, not
UI clicks: generate each room → `stageToTemplate` (serialize/"save") → wire `Connector`s
between templates → `deserializeToGrid` back into live grids → place entities with
movement patterns → accept a quest → `stepMover` patrols → `resolveAttack` combat →
traverse the connector chain room-to-room → finish + turn in the quest. Asserts:
- every room serializes/deserializes into a playable grid (walkable spawn, roomy area)
- every connector targets a real room and lands on walkable ground REACHABLE from spawn
- the whole level graph is connected (BFS from the start reaches all rooms)
- enemies actually patrol (never into a wall); combat actually kills; quest completes
- a full play-through visits forest → temple → cave → boss through the connectors
