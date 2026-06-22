# 2026-06-22 — equipment loadout model

Per-entity `Loadout` (pure, immutable, TDD — `game/loadout.ts`):
- equip slots: helmet, chest, gloves, boots, weapon1, weapon2, ring1, ring2, neck
- configurable bag (default 24) + special slots (default 4) bound to number keys (1–0)
- `allowedSlots` (weapons→weapon1/2, rings→ring1/2, etc.), `equip`/`unequip`,
  `addToBag`, `setSpecial`, `setShortcut`, `loadoutBonuses` (dodge from armor, block from shields)
- `Armor` gains optional `slot` (GearSlot) + `dodgeBonus`. 11 tests green.

Foundation for the entity-scoped inventory UI (equip grid + bag + special shortcuts).
