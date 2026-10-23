import { WORLD_PENDING_ATTR, WORLD_PENDING_SCRIPT } from '@/themes/worldPending'
import { DEFAULT_THEME_ID, THEME_STORAGE_KEY } from '@/themes/themes'

// Runs the inline head script against a stored world and a query string, and reports whether it hid
// the server rendered default world.
const runScript = (stored: string | null, search = ''): boolean => {
  const root = document.createElement('html')
  const storage = { getItem: (key: string) => (key === THEME_STORAGE_KEY ? stored : null) }
  new Function('localStorage', 'location', 'document', WORLD_PENDING_SCRIPT)(storage, { search }, { documentElement: root })
  return root.hasAttribute(WORLD_PENDING_ATTR)
}

describe('world pending script', () => {
  it('leaves the default world visible for a fresh visitor, the one crawlers get', () => {
    expect(runScript(null)).toBe(false)
  })

  it('leaves the default world visible when the default is the stored world', () => {
    expect(runScript(DEFAULT_THEME_ID)).toBe(false)
  })

  it('hides the default world while a returning visitor waits for their stored world', () => {
    expect(runScript('retro-rpg')).toBe(true)
  })

  it('hides the default world while a capture link waits for its world', () => {
    expect(runScript(null, '?capture=neon-cyber')).toBe(true)
  })

  it('leaves the page visible when storage throws', () => {
    const root = document.createElement('html')
    const storage = { getItem: () => { throw new Error('blocked') } }
    new Function('localStorage', 'location', 'document', WORLD_PENDING_SCRIPT)(storage, { search: '' }, { documentElement: root })
    expect(root.hasAttribute(WORLD_PENDING_ATTR)).toBe(false)
  })
})
