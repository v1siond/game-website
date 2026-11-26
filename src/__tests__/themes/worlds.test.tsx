import { themes } from '@/themes/themes'

// Every world component and the shared stage are mocked so the suite checks the registry wiring, not 17 heavy layouts, and a
// world mid edit cannot break it. Each call is written out at the top level with a literal path and an
// inline factory, because babel-jest hoists only those above the imports; a call inside a helper runs
// after the imports and the real worlds load.
jest.mock('@/components/themes/EraPostcardsTheme', () => ({ __esModule: true, default: () => null }))
jest.mock('@/components/themes/DarkFantasyTheme', () => ({ __esModule: true, default: () => null }))
jest.mock('@/components/themes/SurvivalHorrorTheme', () => ({ __esModule: true, default: () => null }))
jest.mock('@/components/themes/NeonPortalsTheme', () => ({ __esModule: true, default: () => null }))
jest.mock('@/components/themes/SoulMapTheme', () => ({ __esModule: true, default: () => null }))
jest.mock('@/components/themes/AdventurePathsTheme', () => ({ __esModule: true, default: () => null }))
jest.mock('@/components/themes/RubberHoseTheme', () => ({ __esModule: true, default: () => null }))
jest.mock('@/components/themes/RetroRPGTheme', () => ({ __esModule: true, default: () => null }))
jest.mock('@/components/themes/BoldNoirTheme', () => ({ __esModule: true, default: () => null }))
jest.mock('@/components/themes/FighterSelectTheme', () => ({ __esModule: true, default: () => null }))
jest.mock('@/components/themes/ArtDecoTheme', () => ({ __esModule: true, default: () => null }))
jest.mock('@/components/themes/RetroAtomicTheme', () => ({ __esModule: true, default: () => null }))
jest.mock('@/components/themes/NeonCyberTheme', () => ({ __esModule: true, default: () => null }))
jest.mock('@/components/themes/CellShadedTheme', () => ({ __esModule: true, default: () => null }))
jest.mock('@/components/themes/SilhouetteTheme', () => ({ __esModule: true, default: () => null }))
jest.mock('@/components/themes/TropicalPlatformerTheme', () => ({ __esModule: true, default: () => null }))
jest.mock('@/components/themes/MedievalFantasyTheme', () => ({ __esModule: true, default: () => null }))
jest.mock('@/components/themes/shared/professionStage', () => ({ __esModule: true, default: () => null }))

import { WORLDS, WORLD_CATEGORIES, WORLD_IDS } from '@/lib/worlds/registry'
import { getWorldComponent } from '@/themes/worlds'

describe('worlds registry', () => {
  it('has exactly one world per theme, in the same order', () => {
    expect(WORLD_IDS).toEqual(themes.map((t) => t.id))
  })

  it('gives every world a known category', () => {
    const known = new Set(WORLD_CATEGORIES.map((c) => c.name))
    for (const world of WORLDS) {
      expect(known.has(world.category)).toBe(true)
    }
  })

  it('every declared category contains at least one world', () => {
    for (const cat of WORLD_CATEGORIES) {
      expect(WORLDS.filter((w) => w.category === cat.name).length).toBeGreaterThan(0)
    }
  })

  it('partitions all worlds across the categories (no orphans, no dupes)', () => {
    const total = WORLD_CATEGORIES.reduce(
      (sum, c) => sum + WORLDS.filter((w) => w.category === c.name).length,
      0
    )
    expect(total).toBe(WORLDS.length)
  })

  describe('getWorldComponent', () => {
    it.each(WORLD_IDS)('resolves %s to a component', (id) => {
      // The default world is a plain function component; the others are next/dynamic's loadable
      // wrappers, which React exposes as element type objects ($$typeof).
      const component = getWorldComponent(id) as unknown as { $$typeof?: symbol } | undefined
      expect(typeof component === 'function' || typeof component?.$$typeof === 'symbol').toBe(true)
    })

    it('returns undefined for an unknown id', () => {
      expect(getWorldComponent('does-not-exist')).toBeUndefined()
    })
  })
})
