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

## Authoring (the database / editor — later)

The editor will let an author:
1. Create an `AbilityDef`: name + description, pick a **category** and a **seeded animation**, set
   **cooldown**, **requirements**, and **effect** numbers (damage/healing/debuff).
2. Bind up to 4 to an entity's slots (keys 1–4, rebindable).

The engine stays "not super customizable out of the box": authors choose from the **seeded animation
library** and tune data — they don't build new animations. Persistence rides the same template/asset
channel as the rest (see `src/lib/api.ts` + the marker-asset pattern), so an entity's loadout can be
saved/loaded with the template.

## Visual hook

An ability's `animation` overrides the swing/cast visual. Example: **Fire Slash** reuses the in-hand
melee swing (`drawIsoPlayer`) but **tints the blade red/orange** for the duration. The attack-anim /
in-hand-swing code already takes a glyph + swing progress; the animation id selects a tint + any
extra particles.

## v1 — built this session (intentionally small)

- `src/game/abilities.ts` — the pure model above + a cooldown helper + **one seeded ability**
  (`FIRE_SLASH`, offensive, `fire-slash` animation) + a default loadout (Fire Slash on slot 1).
- Basic attack cooldown set to **1.5s** (was looping every 200ms — too fast).
- Wiring (in the play loop): **key `1` → Fire Slash** when off cooldown → plays the swing with a
  **red/orange blade**, applies its damage, starts its cooldown.

Deliberately **NOT** built yet (documented above, exported later): the full seeded animation library,
the abilities-database editor UI, the cooldown HUD for all 4 slots, key rebinding UI, the XP/level
progress system + requirement enforcement, defensive/debuff/healing example abilities.
