# Quests (travel/find), archetype, entity inspector, view UX, cannon

Date: 2026-06-22

Engine+game suites 282/282 (stable ×3), tsc clean on every touched file.

## Quests — travel/find objectives (#10)
`quests.ts` already supported all kinds; wired authoring + events. Quest draft now
picks objective kind (slay / travel-to-cell / find-NPC, NPC dropdown for find); the
loop feeds `travel` on reaching a cell and `find` on interacting with an NPC.
`applyQuestEvent` generalizes the old kill-only helper (same-ref when nothing advances).

## RPG archetype (#9)
Warrior/Magician selector in the Inventory card equips the matching weapon
(sword/axe vs staff) from the bag (builds on the #8 equip system).

## Entity types + inspector (#11, #12)
Click a placed entity → right-sidebar inspector: edit name / enemy-type, toggle
**hittable** (a non-hittable enemy is passive — `isLivingEnemy` skips it, so it
neither targets nor retaliates), see stats + patrol, delete.

## View / sidebar UX (#18, #19, #20)
- Mouse-wheel **zoom on isometric** (own zoom factor scaling the iso projection).
- Sidebars no longer tied to view; a **Preview/Edit toggle** (desktop+mobile) hides
  all editor UI for a clean game preview, in ANY view.
- **Flow view keeps the sidebars** (gating is just `showSidebars` now).

## Collapsible cards (#14, partial)
The shared `Card` is now collapsible (click the title) — solves "too much
scrolling / assets should be expandable". DEFERRED (cosmetic, needs browser
iteration): moving the Entities card to the right + Export/Save-Load into the top
nav (full cards don't fit a thin nav — a redesign).

## Structure behaviors (#13)
NEW `engine/behaviors.ts` (pure, tested): `shouldFire` (cannon cadence) + `lampPulse`
(lamp glow). Placeable **cannon** (Building palette) auto-fires at a player within
range every ~1.8s; lamps animate through `lampPulse`.

## Files
`+ engine/behaviors.ts (+test)` · `~ game/types.ts` · `~ game/quests.ts` (none) ·
`~ engine/Tileset.ts` (cannon tile) · `~ pages/.../templates.tsx`

## NOTE
All of this is verified by tests + tsc, NOT the browser. The big visual/gameplay
stack (this + prior batches) needs the user's validation pass.
