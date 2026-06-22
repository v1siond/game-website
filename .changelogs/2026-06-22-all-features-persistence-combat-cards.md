# 2026-06-22 — close the feature gaps + 4K branded video pipeline

- **Entity + quest persistence**: `Template` gains `entities`/`quests` Json columns
  (mirror connectors); api.ts TemplateData/CreateTemplateInput + the routes round-trip
  them; the editor saves `entitiesRef`/`questsRef` and restores them on load. Enemies/
  NPCs/quests now survive save→reload. (Needs a dev-server restart for the new Prisma
  client.) 3 persistence tests.
- **Loadout → live combat**: the equipped weapon, a shield's block%, and gear stat
  bonuses (str/int/defense/dodge) feed the play loop, so equipping in the inventory
  panel actually changes the fight (player + enemy dodge, shield block).
- **Special items usable**: number keys (1–0) use the bound special slot — consumables
  apply their effect (hp/rage/mana); bombs/scrolls consume with a toast.
- **4K branded video pipeline** (`playwright/cards/`): build-intro-card / build-outro-card
  / add-music / finish-video — intro+outro cards, soft music, 3840×2160@60, marks shifted.
