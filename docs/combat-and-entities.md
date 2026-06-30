# Combat, Abilities & Entities

> The as-built RPG layer: the damage pipeline, the player ability loadout, enemy attack
> patterns, archetypes, the spawner, gear, and the play-loop targeting/aim/jump. The whole
> `src/game/*` layer is **pure and React-free** — no globals, no clock, no RNG of its own;
> `now`, ids and `rng` are injected, mutators return new objects. The cross-module contract
> is `src/game/types.ts`.
>
> For the **design** of abilities + configurable enemy attacks, see
> [ability-system.md](./ability-system.md); this doc is what is wired up.

---

## 1. The damage pipeline — `src/game/combat.ts`

`resolveAttack(input): ResolveAttackResult` is the single entry point. Coefficients live at
the top of the file: `REGULAR_MULTIPLIER = 1`, `SPECIAL_MULTIPLIER = 1.75`,
`RAGE_PER_STRENGTH = 5`, `MANA_PER_INTELLIGENCE = 5`, `SPECIAL_RESOURCE_COST = 20`,
`MIN_DAMAGE = 1`.

### Derived stats & resources

- `deriveStats(base, weapon?, armor?)` folds equipment bonuses via `sumBonus` over a
  `StatBonus` shape (weapons carry defense as `baseDefense`, armor as `defenseBonus`). Adding
  a stat source is a new entry, not a new branch.
- `rageCap(strength) = round(strength·5)`, `manaCap(intelligence) = round(intelligence·5)`.
- `startingCombatState(stats)` = full HP + resources at cap. `applyDamage(hp, dmg) = max(0,
  hp−dmg)`; `isDead(hp) = hp <= 0`.

### Damage by school (dispatch map, not switch)

```ts
const SCHOOL_DAMAGE: Record<AttackSchool, DamageFormula> = {
  physical: (eff, weapon, mult) => (weapon.baseDamage + eff.strength) * mult,
  magical:  (eff, weapon, mult) => (weapon.baseMagic  + eff.intelligence) * mult,
}
```

Mitigation: `mitigatesMelee(school, range)` is true **only** for physical + melee. Melee
physical → `max(MIN_DAMAGE, round(raw) − defenderDefense)`; everything else (ranged physical,
all magical) passes through `max(0, round(raw))` unmitigated (magic-vs-defense is TBD).

### `resolveAttack`, in order

1. `startingHp = defenderHp ?? defender.maxHp`.
2. **Resource gate** — a `'special'` tier looks up `SPECIAL_RESOURCE[school]` (physical→rage,
   magical→mana); if available `< SPECIAL_RESOURCE_COST` it returns a **non-firing**
   `blocked(reason)` result (`fired:false`, 0 damage, state untouched).
3. **Avoidance rolls, BEFORE damage** (`roll = input.roll ?? Math.random`):
   `dodged = dodgePct > 0 && roll()*100 < defender.dodge`, then (if not dodged)
   `wasBlocked = blockPct > 0 && roll()*100 < defenderWeapon.blockChance`.
4. `damage = dodged || wasBlocked ? 0 : computeDamage(input)`.
5. `defenderHpAfter = applyDamage(startingHp, damage)`.
6. `spendResource` — specials debit `SPECIAL_RESOURCE_COST`; regulars spend nothing.

Result: `{ fired, reason?, damage, defenderHpAfter, lethal, dodged?, blocked?, resource,
resourceSpent, attackerStateAfter? }`. **A dodged/blocked special still fires and still
spends its resource** (you swung; it was avoided). There is **no crit system** — the pipeline
is `strength/weapon-base → multiplier → defense mitigation → dodge/block avoidance`.

---

## 2. Player ability loadout — `abilities.ts` + `loadout.ts`

### `AbilityDef` and the registry

An ability = a seeded animation + data. `AbilityCategory = offensive | defensive | debuff |
protection | healing`. `AbilityAnimation` is the fixed seeded library (`fire-slash`,
`ice-slash`, `cleave`, `bolt`, `piercing-shot`, `nova`, `lightning`, `heal-glow`,
`guard-flash`). `ABILITY_TINT: Record<AbilityAnimation, string>` recolors the swing.

`ABILITY_REGISTRY` ships **13** abilities covering every category:

| const | category | animation | cooldownMs | effect |
|---|---|---|---|---|
| `FIRE_SLASH` | offensive | fire-slash | 6000 | dmg 18 |
| `CLEAVE` | offensive | cleave | 7000 | dmg 22 |
| `POWER_SHOT` | offensive | piercing-shot | 8000 | dmg 26 |
| `ARCANE_BOLT` | offensive | bolt | 5000 | dmg 20 |
| `NOVA_BURST` | offensive | nova | 14000 | dmg 30 |
| `CHAIN_LIGHTNING` | offensive | lightning | 11000 | dmg 24 |
| `GUARD` | defensive | guard-flash | 12000 | shield 4000ms |
| `BULWARK` | protection | guard-flash | 16000 | shield 6000ms |
| `FROST` | debuff | ice-slash | 9000 | dmg 8 + slow 3000/0.4 |
| `POISON_DART` | debuff | piercing-shot | 8000 | dmg 6 + poison 5000/4 |
| `ENFEEBLE` | debuff | nova | 10000 | weaken 6000/0.3 |
| `MEND` | healing | heal-glow | 10000 | heal 25 |
| `RENEW` | healing | heal-glow | 7000 | heal 14 |

`getAbility(id)` is a registry `find`. Helpers: `abilityReady(ability, lastUsedAt, now)`
(first use always allowed), `meetsRequirements(ability, ctx)` — **`weaponKind` is enforced;
the `level` gate is deliberately not enforced** (pending the progress system).

### Slots 1–4

`AbilitySlot = 1|2|3|4`; `AbilityBinding = { slot, key, ability }` (key defaults to the slot
number, rebindable). `DEFAULT_ABILITY_LOADOUT = [{ slot: 1, key: '1', ability: FIRE_SLASH }]`
— v1 ships only Fire Slash on slot 1. Pure editors: `assignAbility`, `removeAbility`,
`rebindAbility` (if another binding holds the key the two **swap keys**, keeping triggers
unique). Lookups `bindingForKey` / `bindingForSlot`.

### Gear loadout — `loadout.ts` (separate from abilities)

`Loadout = { equipped: Partial<Record<EquipSlot, Item>>, bag: (Item|null)[], special:
(Item|null)[], shortcuts: string[] }`. `DEFAULT_SPECIAL_KEYS = ['5','6','7','8','9','0', …]`
— special-item slots start at **5** so they never collide with ability keys 1–4.
`allowedSlots(item)` (weapon → `weapon1/weapon2`; armor → `ARMOR_SLOTS` lookup, e.g. ring →
`ring1/ring2`; consumables → none). `loadoutBonuses(loadout)` folds every equipped item into
`{ strength, intelligence, defense, dodge, block }`.

---

## 3. Enemy attack patterns — `patterns.ts`

Mirrors the movement pattern system. `AttackMode = 'melee' | 'ranged'`; `AttackPatternMode =
'sequential' | 'random'`.

```ts
interface EnemyAttack {       // the enemy-side mirror of a player ability
  mode: AttackMode
  damage: number              // extra on top of the enemy's strength (0 = strength-only)
  cooldownMs: number
  animation?: AbilityAnimation
  reachCells?: number         // ranged reach (chebyshev); melee uses adjacency
  abilityId?: string; name?: string
}
interface AttackPattern { mode: AttackPatternMode; attacks: EnemyAttack[] }
```

- `DEFAULT_ENEMY_ATTACK` = `{ mode:'melee', damage:0, cooldownMs:900, animation:'cleave',
  name:'Strike' }`, wrapped in `DEFAULT_ENEMY_ATTACK_PATTERN` (the no-pattern fallback).
- `animationRange(animation)` → `'ranged'` for `bolt/piercing-shot/nova/lightning`, else
  `'melee'`.
- `makeEnemyAttack` (clamps damage ≥ 0, cooldown ≥ `MIN_ATTACK_COOLDOWN_MS = 200`).
- `enemyAttackFromAbility(ability)` — **reuses the player ability registry**: takes the
  ability's `effect.damage` / `cooldownMs` / `animation`, infers mode via `animationRange`,
  carries `abilityId` + `name`. This is how an enemy gets a "player-grade" attack.
- `ENEMY_ATTACK_PRESETS` — Claw, Fire Bite, Bolt (reach 6), Pierce (reach 8).
- Editors: `buildAttackPattern`, `setAttackPatternMode`, `addEnemyAttack`,
  `removeEnemyAttack`, `updateEnemyAttack`.
- `normalizeAttackPattern(raw)` — back-compat: accepts the new multi-attack shape, a legacy
  single `{ mode, cooldownMs }`, or nothing, and always returns a **non-empty** pattern.

The selector `nextEnemyAttack(pattern, { fireCount, rng? })`: `sequential` cycles the list by
`fireCount` (safe for negatives); `random` picks via the injected `rng`. The play loop keeps a
per-enemy `fireCount` and fires via `applyEnemyRetaliation` (≈ L1144 in `templates.tsx`).

> Movement patterns (`patterns.ts` + `movement.ts`) mirror this: a `MovementPattern` of
> waypoints/steps traversed `sequential`/`random`. The pure steppers — `stepMover`,
> `stepRunPatrol`, `stepStepList` — never walk into a blocked cell, and `motionPos` gives the
> renderer a continuous fractional grid position so motion is interpolated, never eyeballed.

---

## 4. Enemy archetypes — `archetypes.ts`

`EnemyArchetypeId = grunt | brute | skirmisher | archer | mage | raider`. An
`EnemyArchetype = { id, name, stats, moveDelayMs (LOWER = faster), reachCells, attack:
AttackPattern }`. The dispatch table `ENEMY_ARCHETYPES`:

| id | str/int/def/hp/dodge | moveDelayMs | reach | attack |
|---|---|---|---|---|
| grunt | 6/0/3/34/5 | 1000 | 1 | Strike (melee 4, cd1000) |
| brute | 12/0/6/72/0 | 1700 | 1 | `enemyAttackFromAbility(FIRE_SLASH)` (18/6s) |
| skirmisher | 5/0/1/20/18 | 550 | 1 | Quick Slash (melee 2, cd450) |
| archer | 4/0/1/22/10 | 900 | 6 | `BOLT` preset @ reach 6 |
| mage | 3/10/1/18/6 | 950 | 7 | Arcane Bolt (ranged 12, cd1900, nova) @ 7 |
| raider | 7/0/3/40/8 | 850 | 6 | Hack (melee) + Snipe (ranged @6) |

`brute` proves enemy attacks reuse the ability registry directly:
`attack: buildAttackPattern('sequential', [enemyAttackFromAbility(FIRE_SLASH)])`. Reach
constants `MELEE_REACH = 1`, `ARCHER_REACH = 6`, `MAGE_REACH = 7`.

> The mage's `nova` is **cosmetic in v1** — the combat tick resolves every enemy swing as
> physical.

`buildArchetypeProfile(id)` **deep-clones** stats + attacks so callers can't mutate the shared
table; `getArchetype`, `isArchetypeId`, `ENEMY_ARCHETYPE_IDS` round it out.

---

## 5. Entities & the spawner — `entities.ts`, `spawner.ts`

### Entity model

`Entity = { id, kind: 'player'|'enemy'|'npc', col, row, name?, baseStats, respawnMs?,
questId?, enemyType?, rarity?, movement?, attack?, hittable? }`. Default stats:
`DEFAULT_PLAYER_STATS` (10/10/5/100), `DEFAULT_ENEMY_STATS` (5/0/2/30), `DEFAULT_NPC_STATS`
(1/1/0/10). Factories `makePlayer`, `makeEnemy` (applies an archetype profile; explicit stats
always win), `makeNpc`. Placement/queries are all pure: `canPlaceEntity`, `placeEntity`,
`removeEntity`, `entityAt`, `entityCovers` / `entityAtFootprint` (multi-cell footprint,
bottom-anchored / centered), `entityOccupiedCells` (the `"col,row"` set the loop uses for
collision). Rarity: `Rarity = common|uncommon|rare|elite`, with `RESPAWN_MS_BY_RARITY`
(20s/35s/60s/120s) feeding `nextRespawnAt` / `isRespawned`.

### Spawner

`scatterEntities(opts)` is the entry point (deterministic under an injected `rng`).
`ENEMY_TYPES = [goblin, wolf, bandit, skeleton]`, mapped by `ARCHETYPE_BY_ENEMY_TYPE`
(goblin→grunt, wolf→skirmisher, bandit→archer, skeleton→brute). It does **type-grouped
zoning** (each type gets its own home zone in a near-square partition; unfilled quotas spill
over), enforces a global Chebyshev `minGap` (default 3) via `takeSpaced`, and uses
Fisher-Yates `shuffle`. Each enemy gets `hittable: true` and a jittered random patrol
(`makePatrol`, 3–4 waypoints ±2 around spawn, paced by the archetype's `moveDelayMs`).

---

## 6. Gear — `gear.ts`

A stat-only catalog; every export is a **factory returning a fresh object**. `Item` is a
discriminated union on `slot`: `{slot:'weapon', weapon} | {slot:'armor', armor} |
{slot:'consumable', effect}`.

- `Weapon = { id, kind, name, baseDamage, baseMagic, baseDefense, strengthBonus, intBonus,
  school, range, hands:1|2, reachCells, blockChance? }`. `WeaponKind = sword | axe | shield |
  staff | bow | gun | unarmed`. Examples: `sword` (1H melee, dmg12), `axe` (2H, dmg18, reach
  2), `bow` (2H ranged, reach 8), `gun` (1H ranged, reach 7), `staff` (2H magical, magic14),
  `shield` (baseDefense 6, **blockChance 35**).
- `Armor = { id, kind:'iron'|'leather', name, defenseBonus, strengthBonus, intBonus, slot?,
  dodgeBonus? }`. Iron leans defense/strength; leather leans defense/int **+ dodge**; rings
  are stat sticks (`dodgeRing`, `focusRing`).
- Consumables: `healthPotion {hp:30}`, `manaPotion {mana:20}`, `rageTonic {rage:20}`, plus
  empty-effect throwables `bomb` / `teleportScroll` (wired in the play loop).

`GEAR_CATALOG` lists all 21; `starterWarriorGear()` / `starterMageGear()` are starter sets.
**Gear has no rarity** — rarity lives on enemies. The play loop seeds the player bare-handed
(`BARE_HANDS`: dmg 4, reach 1, no blade drawn) with a starter inventory (oak staff, leather
vest, health potion).

---

## 7. Targeting, 8-way aim, and jump (play loop, `templates.tsx`)

These live in the loop, not the pure `game/*` layer.

### Facing vs aim

- `facingFromKeys(keys)` → the **4-way facing** (up/down/left/right) that drives the weapon
  hand and the sprite.
- `aimFromKeys(keys, use2D)` → an **8-way GRID aim**: sum each pressed direction's per-view
  grid delta (the *same* mapping movement uses, so you aim where you'd walk), then snap each
  axis to its sign. Two keys → a diagonal; opposite keys cancel; `null` when nothing is held
  (the last aim is kept, so a standing shot fires the last-aimed way). `aimDelta(player,
  use2D)` returns the live `aim` or falls back to the facing delta. The delta is in **grid
  space**, so all 8 directions resolve identically in 2D and iso.

### Jump

`JUMP_MS = 380`, `JUMP_PEAK_PX = 26`. `beginJump(player, grid, use2D, jump, now, forward)`
leaps along the **8-way aim** (a moving jump) or hops in place (standing, `forward = false`).
`jumpLandingCell` walks outward up to `JUMP_CLEAR + 1` and returns the **farthest reachable**
cell, skipping blocked/out-of-bounds cells between — so airborne, a wall only *shortens* the
leap instead of cancelling it. The loop then lerps the player from→to over `JUMP_MS` with a
parabolic `sin(π·t)·JUMP_PEAK_PX` visual hop, ignoring WASD/collision until landing.

---

## 8. Attack visuals — `engine/attacks.ts` + `attackAnimations.ts`

A separate, reusable engine-level attack layer (distinct from `game/combat.ts`): it owns
eligibility/timing/combos and visual playback; the caller owns damage + spawning.

- `attacks.ts` — `AttackDef { id, range, reach, cooldownMs, power, animKind, chainTo? }`;
  `chooseAttack(...)` picks the open combo step (if ready + in reach + within
  `COMBO_WINDOW_MS = 800`) else the first ready in-reach attack; `fire(def, state, now)`
  stamps the cooldown and opens the combo window.
- `attackAnimations.ts` — `AttackAnimKind = slash | shot | lightning | block`; `ATTACK_ANIM_MS
  = {slash:200, shot:360, lightning:320, block:260}`; per-kind ASCII `FRAMES` + `COLORS`.
  `weaponAnimKind(weaponKind, range)` (ranged→shot, staff→lightning, else slash).
  `animFrame(anim, now)` returns `{char, x, z, color, angle?}` or `null` when done — a **shot
  travels** (lerp by progress), a **slash stays in-hand** (reaches only `SLASH_REACH = 0.3`
  toward the target and rotates), magic/block land on the target cell; the color is
  `anim.tint ?? COLORS[kind]`, so an ability's `ABILITY_TINT` recolors the swing.

The player's own melee uses the **bracket-arm swing** in `drawIsoPlayer` (≈ L9916): the swing
arm IS the figure's facing bracket glyph (`>`/`<`, the same glyph the walk sprite uses),
pivoting at the shoulder from raised-up (windup) to forward (strike); the held weapon rides
the hand just past the bracket. See [rendering-and-sprites.md](./rendering-and-sprites.md).

---

## Cross-cutting notes

- **Two parallel attack representations coexist**: the game layer (`combat.ts` `resolveAttack`
  + `patterns.ts` `EnemyAttack`) and the engine layer (`attacks.ts` `AttackDef` /
  `chooseAttack` / `fire`). They share concepts (reach, cooldown, animation-by-name) but are
  not wired to each other in those files — the play loop composes them.
- Two animation vocabularies: the fine `AbilityAnimation` names (`fire-slash`, `bolt`, …)
  flow into `EnemyAttack.animation` + the tint; the coarse engine `AttackAnimKind`
  (`slash`/`shot`/`lightning`/`block`) is chosen via `weaponAnimKind`.
- Everything is TDD-friendly: RNG, ids and `now` are injected; mutators clone.
</content>
