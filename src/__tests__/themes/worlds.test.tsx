import { themes } from '@/themes/themes'

// Mock every world component so we exercise the registry wiring, not 17 heavy layouts.
const mock = (name: string) =>
  jest.mock(`@/components/themes/${name}`, () => ({
    __esModule: true,
    default: () => null,
  }))

mock('DarkFantasyTheme')
mock('SurvivalHorrorTheme')
mock('NeonPortalsTheme')
mock('SoulMapTheme')
mock('AdventurePathsTheme')
mock('RubberHoseTheme')
mock('RetroRPGTheme')
mock('BoldNoirTheme')
mock('FighterSelectTheme')
mock('ArtDecoTheme')
mock('RetroAtomicTheme')
mock('NeonCyberTheme')
mock('CellShadedTheme')
mock('SilhouetteTheme')
mock('MythicTheme')
mock('TropicalPlatformerTheme')
mock('MedievalFantasyTheme')

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
