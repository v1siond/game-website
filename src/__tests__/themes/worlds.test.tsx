import { themes } from '@/themes/themes'

// Every world component is mocked so the suite checks the registry wiring, not 17 heavy layouts, and a
// world mid edit cannot break it. Each call is written out at the top level with a literal path and an
// inline factory, because babel-jest hoists only those above the imports; a call inside a helper runs
// after the imports and the real worlds load.
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
jest.mock('@/components/themes/MythicTheme', () => ({ __esModule: true, default: () => null }))
jest.mock('@/components/themes/TropicalPlatformerTheme', () => ({ __esModule: true, default: () => null }))
jest.mock('@/components/themes/MedievalFantasyTheme', () => ({ __esModule: true, default: () => null }))

import {
  WORLDS,
  WORLD_CATEGORIES,
  getWorldComponent,
  getWorldsByCategory,
} from '@/themes/worlds'

describe('worlds registry', () => {
  it('has exactly one world per theme, in the same order', () => {
    expect(WORLDS.map((w) => w.id)).toEqual(themes.map((t) => t.id))
  })

  it('gives every world a component and a known category', () => {
    const known = new Set(WORLD_CATEGORIES.map((c) => c.name))
    for (const world of WORLDS) {
      expect(typeof world.component).toBe('function')
      expect(known.has(world.category)).toBe(true)
    }
  })

  it('every declared category contains at least one world', () => {
    for (const cat of WORLD_CATEGORIES) {
      expect(getWorldsByCategory(cat.name).length).toBeGreaterThan(0)
    }
  })

  it('partitions all worlds across the categories (no orphans, no dupes)', () => {
    const total = WORLD_CATEGORIES.reduce(
      (sum, c) => sum + getWorldsByCategory(c.name).length,
      0
    )
    expect(total).toBe(WORLDS.length)
  })

  describe('getWorldComponent', () => {
    it('returns the component for a valid world id', () => {
      expect(getWorldComponent('mythic')).toBe(
        WORLDS.find((w) => w.id === 'mythic')!.component
      )
    })

    it('returns undefined for an unknown id', () => {
      expect(getWorldComponent('does-not-exist')).toBeUndefined()
    })
  })
})
