# 2026-06-22 — gear catalog, entity randomizer, visual equipment panel

- **gear catalog** (`game/gear.ts`): 20 ASCII items — sword/axe/bow/staff/shield (block 35),
  armor for every slot (iron + leather, dodge gear), rings/neck, potions + bomb + teleport
  scroll; `starterWarriorGear`/`starterMageGear`. 22 tests.
- **entity randomizer** (`game/spawner.ts`): `scatterEntities` drops enemies/NPCs onto free,
  distinct walkable cells with stats + dodge + a random-waypoint movement pattern;
  deterministic under an injected rng; caps to available cells. 8 tests. Wired to a
  "Scatter entities" button in the Entities card.
- **visual equipment panel**: per-entity `Loadout` (equip grid of 9 slots + 24 bag + 4
  special slots with number-key shortcuts). Opens with the **I** key or a button; click bag
  items to equip/use, click equipped to unequip, cycle special-slot keys, add catalog gear.
