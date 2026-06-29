# Ability System (Nebulith engine) — design

> Status: **design + v1 skeleton**. This documents the full intended system; only a small,
> extensible slice is built this session (see "v1 — built this session"). The rest is specced so it
> can be exported/expanded later without rework.

## Goal

A **data-driven ability system** for the game engine. The engine ships a set of **seeded ability
animations** (fire slash, bolt, nova, heal glow, …). Authors don't hand-animate; they **compose an
ability** by picking a seeded animation and filling in the data: name, category, trigger key,
requirements, and effect magnitudes (damage / healing / debuff …). Abilities live in an **abilities
database**; each entity equips **up to 4**, bound to keys **1–4** (rebindable).

Design north star: *Diablo 2, minus the filler.* No "+X% to a stat" abilities — those are boring.
**Active abilities only:** new attacks, defensive actives, debuffs, protection, healing. **Stat
increases and RNG procs come exclusively from gear** (armor, rings, …) as passives.

## Core model

```ts
type AbilityCategory = 'offensive' | 'defensive' | 'debuff' | 'protection' | 'healing'

// Seeded by the engine — the fixed library of animations an author can attach to an ability.
type AbilityAnimation =
  | 'fire-slash' | 'ice-slash' | 'cleave'   // melee
  | 'bolt' | 'piercing-shot'                // ranged
  | 'nova' | 'lightning'                    // magic
  | 'heal-glow' | 'guard-flash'             // support / defense

interface AbilityEffect {
  damage?: number
  healing?: number
  shieldMs?: number                         // protection: damage-reduction window
  debuff?: { kind: 'slow' | 'poison' | 'weaken'; durationMs: number; magnitude: number }
}

interface AbilityRequirement {
  level?: number                            // gates use behind the progress system
  weaponKind?: string                       // e.g. only with a sword / bow / staff
}

interface AbilityDef {
  id: string
  name: string
  description: string
  category: AbilityCategory
  animation: AbilityAnimation               // which seeded animation plays
  cooldownMs: number                        // "every X seconds"
  requirements?: AbilityRequirement
  effect: AbilityEffect
}
```

- An **entity loadout** = up to 4 `AbilityDef` bound to slots/keys 1–4.
- **Cooldowns** are per-ability; the HUD shows the 4 slots with a cooldown sweep.
- **Basic attack** (`f`) is not an ability — it's the always-available strike on a **1.5s** cooldown.

## Progress system (specced, not built yet)

Abilities can require a level. A minimal XP/level model powers `requirements.level`:
- Entities gain XP from kills (rarity-weighted, reusing the existing kill bookkeeping).
- Level thresholds unlock higher-tier abilities.
- This is **documented only** for now — v1 leaves `requirements` on the model but doesn't enforce a
  level (treat unmet `level` as "always allowed" until the progress system lands).

## Authoring — a configurable SYSTEM, not hardcoded slots

This is the core of it. It is NOT "every entity has 4 fixed abilities." It is a **system**:

1. **Ability database (CRUD).** A registry of abilities the author can **add / delete / update**. Each
   `AbilityDef`: name + description, **category**, a **seeded animation**, **cooldown**,
   **requirements**, and **effect** numbers (damage / healing / debuff). The engine ships seeded
   abilities; the author edits + adds more (choosing from the seeded animation library — they don't
   hand-build animations).
2. **Assign into slots — per ANY entity.** Abilities are **put into** an entity's action slots and
   **taken out** again (assign / remove / move). The same system applies to the **player AND enemies**
   — an enemy's "attack pattern" is just its assigned abilities (see the enemy-attack work). This is
   **linked to the attacks system**: an ability IS an attack/defense/debuff.
3. **Action-bar UI builder (à la WoW's Bartender).** The author controls their **action UI**: build
   bars/slots, place which ability goes where, rearrange. Not a fixed 4-slot bar — a buildable layout.

Persistence rides the same template/asset channel as the rest (see `src/lib/api.ts` + the marker-asset
pattern), so an entity's ability loadout + the bar layout save/load with the template.

## Visual hook

An ability's `animation` overrides the swing/cast visual. Example: **Fire Slash** reuses the in-hand
melee swing (`drawIsoPlayer`) but **tints the blade red/orange** for the duration. The attack-anim /
in-hand-swing code already takes a glyph + swing progress; the animation id selects a tint + any
extra particles.

## Already built (first slice)

- `src/game/abilities.ts` — the pure `AbilityDef` model + cooldown/requirement helpers + seeded
  `FIRE_SLASH` + a default loadout. The play loop fires the slot's ability by key (key `1` → Fire
  Slash → red/orange swing, applies damage, cooldown). Basic attack 0.5s.

## v1 of the CONFIGURABLE system (this session) — extensible, not hardcoded

1. **Ability registry (the database):** turn `abilities.ts` into a registry of seeded abilities with
   **variety** — at least one per category (offensive Fire Slash; a defensive guard; a debuff; a
   ranged shot) — exposed as a list the UI can read. Structure it so add/update is trivial later.
2. **Editable per-entity loadout:** the player's loadout (slot → abilityId) is **editable** — the
   inventory's 1–4 Special slots let you **assign** an ability (pick from the registry) and **remove**
   it. The play loop reads the entity's CURRENT loadout (NOT a hardcoded default). Loadout lives where
   both the UI + the play loop read it (and saves with the template).
3. **Display:** the slots + a HUD action bar show the assigned abilities + cooldown sweep; pressing the
   key fires whatever is assigned.

Deliberately **NOT** built yet (documented, later): the full **Bartender-style bar builder** (multiple
bars, drag-to-arrange layout, resize), a full ability-CREATE editor (new defs from scratch in-UI), key
rebinding, the seeded-animation library expansion, and the XP/level progress system + requirement
enforcement. v1 = a real configurable system (registry + assign/remove + display) on a fixed 4-slot
bar; the bar LAYOUT builder is the next phase.
