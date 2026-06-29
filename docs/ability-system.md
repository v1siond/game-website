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

## Enemy attacks — a CONFIGURABLE pattern (this session)

Enemies used to have a single attack: one `AttackPattern { mode:'melee'|'ranged', cooldownMs }`. They
now get a **multi-attack pattern** that mirrors the movement system: an **ordered list of attacks** +
a **traversal mode** (`'sequential'` cycles the list then repeats; `'random'` picks one each swing).
This is **linked to the attacks system** — an enemy attack IS an attack like the player's.

### Model (`src/game/types.ts`)

```ts
type AttackMode = 'melee' | 'ranged'              // a single attack's RANGE
type AttackPatternMode = 'sequential' | 'random'  // traversal — mirrors MovementMode

interface EnemyAttack {           // the enemy-side mirror of a player ability/attack
  mode: AttackMode                // melee = strike when adjacent; ranged = bolt within reach
  damage: number                  // extra damage on top of the enemy's strength (the swing's weapon base)
  cooldownMs: number              // time before the enemy's NEXT attack
  animation?: AbilityAnimation    // seeded animation → swing/bolt tint
  reachCells?: number             // ranged reach (chebyshev); melee uses adjacency
  abilityId?: string              // set when built from a registry ability (provenance + label)
  name?: string                   // display label
}

interface AttackPattern {         // mirrors MovementPattern
  mode: AttackPatternMode
  attacks: EnemyAttack[]
}
```

**Type choice — a lean `EnemyAttack`, not raw `AbilityDef`.** An enemy attack carries `mode`
(melee/ranged) and `reachCells` as first-class fields the combat tick + editor need directly; a player
`AbilityDef` expresses range only implicitly (via `animation`) and has no reach, plus id/name/category/
requirements that are noise for a hand-authored enemy swing. So `EnemyAttack` is a focused record (the
same way the player path extracts a lean `AbilitySwing { damage, tint }` from an `AbilityDef` rather
than threading the whole def through the loop). We **still reuse the registry**:
`enemyAttackFromAbility(ability)` builds an `EnemyAttack` from any `AbilityDef` — reusing its damage,
cooldown, animation/tint and inferring melee-vs-ranged from the animation — so "add an attack from the
registry" gives the enemy a real, player-grade attack. *Reuse where it fits; a dedicated type where it
doesn't.*

### Pure model + selector (`src/game/patterns.ts`, unit-tested)

- `makeEnemyAttack`, `defaultEnemyAttack`, `enemyAttackFromAbility`, `animationRange`, `ENEMY_ATTACK_PRESETS`.
- Immutable editing: `buildAttackPattern`, `setAttackPatternMode`, `addEnemyAttack`,
  `removeEnemyAttack`, `updateEnemyAttack` (damage/cooldown clamped).
- `normalizeAttackPattern(raw)` — accepts the **new** multi-attack shape OR a **legacy** single
  `{ mode:'melee'|'ranged', cooldownMs }` save (back-compat) OR nothing, and always returns a
  non-empty pattern. Missing/empty → the engine default (one strength-only melee), so nothing regresses.
- `nextEnemyAttack(pattern, { fireCount, rng? })` — the selector. Sequential cycles by `fireCount`;
  random picks via `rng`; empty → the default attack.

### Combat tick (`templates.tsx` → `applyEnemyRetaliation`)

Each living enemy picks its **next** attack via `nextEnemyAttack` (the per-enemy `fireCount` lives in
`EnemyRuntime.attackFireCount`). If that attack is in range (melee adjacency / ranged reach) and off
**its** cooldown, it fires: `enemyFist(entity, attack)` rides the attack's `damage` as the swing's
weapon base through the existing `resolveAttack` (so defense / dodge / block still apply), and the
animation system plays the attack's `'slash'` (melee) or `'shot'` (ranged) recolored to its tint. So an
enemy with `[melee, ranged]` visibly alternates a swing and a bolt.

### Authoring (entity editor → Attacks modal, `EntityAttackBody`)

Mirrors the movement editor: a top **Default / Sequential / Random** select, then a list of attack rows
(melee/ranged + damage + cooldown + tint + remove), with **+ Melee**, **+ Ranged**, and a **+ From
library…** picker (presets + offensive registry abilities). The pattern rides the entity record, so it
**saves with the template**.

### Deliberately NOT built yet (documented, later)

- **A full per-attack custom editor** — naming an attack, free-form reach, a richer effect block
  (debuffs/healing on enemy attacks), per-attack school (magical enemy attacks).
- **Real travelling enemy projectiles** — enemy ranged currently deals damage on fire + shows a
  travelling `'shot'` anim; upgrading to the player's deferred-impact `Projectile` (dodge-by-moving)
  needs the projectile system to treat the player as a target. The `'shot'` anim already flies enemy→
  player, so it reads as a projectile.
- **Conditional / trigger logic** — "use the ranged attack when the player is far, melee when adjacent",
  HP-threshold phase changes, telegraph windows, aggro/leash. The selector is intentionally a pure
  `(pattern, state) → attack` so a smarter policy can replace `fireCount`/`rng` without touching the tick.
- **Ranged/melee animation library expansion** — more seeded animations + particles (shared with the
  player ability work above).
