# Inventory + triggers wired into the game

Date: 2026-06-22

Engine+game suites 278/278 green, tsc clean on touched files. Both modules existed
but were unused ("shelf-ware"); now they're live in the editor + play loop.

## Inventory (#8 / part of #9)

- Player carries an `Inventory` (state + ref), seeded with the starter sword
  (equipped), an Oak Staff, a Leather Vest, and a Health Potion.
- **Equip** weapon → drives the player's attacks (equip the staff → magical ranged);
  **equip** armor → folds its defense into the player when taking melee hits
  (`CombatStepInput.playerArmor`, applied in `applyEnemyRetaliation`).
- **Use** consumable → applies its effect to live combat state (heal / rage / mana).
- Quest **item rewards** now drop into the bag (`REWARD_GRANTERS.item` un-stubbed).
- New `InventoryCard` in the right sidebar (equipped gear + per-item Equip/Use).

## Triggers (#7) — connectors generalized to typed actions

- `engine/triggers.ts` is now USED: the play loop resolves a fired connector's
  action via `resolveAction` (dispatch on effect kind, no branching).
- `Connector.action?` (typed, optional) round-trips as JSON. Absent = legacy
  teleport; present = `goto_region` (move in-stage) / `collect` (→ inventory) /
  `content` (reveal). `collect` synergizes with the new inventory.
- Connector authoring gained an action-type selector + arg inputs (item id /
  section id); Save allows a typed action without a teleport target.

## Deferred / notes
- `content` reveal is a toast for now (a real CV-section panel is the follow-up).
- Talent/archetype + weapon-stat-bonus folding into attack (the rest of #9) still open.
- `goto_region` reads the "Arrive at" col/row at selection time.

## Files
`~ game/types.ts` · `~ pages/.../templates.tsx` · `~ lib/api.ts`
(+ uses existing `game/inventory.ts`, `engine/triggers.ts`)

## NOTE
Needs a browser pass (equip/use, typed connectors) with the other unverified
session changes.
