import { DEFAULT_THEME_ID, getThemeById, themes } from '@/themes/themes'
import { WORLD_IDS } from '@/lib/worlds/registry'

// A returning visitor keeps the id of the world they last picked in localStorage, and an old link can name
// one with ?capture=. Mythic was removed from the site, so its id must open the default world, the one a
// fresh visitor gets, instead of a world that no longer exists.
const DEFAULT_WORLD = themes.find((theme) => theme.id === DEFAULT_THEME_ID)

describe('a removed world id', () => {
  it('opens the default world when it is the stored id', () => {
    expect(DEFAULT_WORLD).toBeDefined()
    expect(getThemeById('mythic')).toBe(DEFAULT_WORLD)
  })

  it('opens the default world for any id the site never had', () => {
    expect(getThemeById('no-such-world')).toBe(DEFAULT_WORLD)
  })

  it('still opens a world the site keeps', () => {
    expect(getThemeById('tropical-platformer').id).toBe('tropical-platformer')
  })

  it('is not offered in the world picker', () => {
    expect(WORLD_IDS).toContain('tropical-platformer')
    expect(WORLD_IDS).not.toContain('mythic')
  })
})
